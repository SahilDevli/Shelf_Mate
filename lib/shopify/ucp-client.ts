import { randomUUID } from "node:crypto";
import {
  DEFAULT_UCP_AGENT_PROFILE,
  getMcpUrl,
  resolveStore,
} from "./store-config.ts";
import { APPROVED_UCP_TOOLS, UcpError } from "./types.ts";
import type { UcpToolName } from "./types.ts";

export const DEFAULT_TIMEOUT_MS = 20_000;

export interface UcpClientOptions {
  fetch?: typeof fetch;
  timeoutMs?: number;
  agentProfile?: string;
}

export interface CallOptions {
  /** Cancels the request (e.g. eve's ctx.abortSignal). */
  signal?: AbortSignal;
  /** Extra MCP `meta` entries (e.g. idempotency-key). `ucp-agent` cannot be overridden. */
  meta?: Record<string, unknown>;
}

export interface UcpClient {
  /**
   * Calls an approved UCP tool on one allow-listed store and returns the
   * validated `structuredContent` object.
   */
  callTool(
    store: unknown,
    tool: UcpToolName,
    args: Record<string, unknown>,
    options?: CallOptions,
  ): Promise<Record<string, unknown>>;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Parses either a plain JSON body or a single-event SSE body. */
function parseBody(text: string, contentType: string): unknown {
  let payload = text;
  if (contentType.includes("text/event-stream")) {
    const dataLines = text
      .split(/\r?\n/)
      .filter((l) => l.startsWith("data:"))
      .map((l) => l.slice(5).trim());
    payload = dataLines.at(-1) ?? "";
  }
  try {
    return JSON.parse(payload);
  } catch {
    throw new UcpError("invalid_json", "Shopify returned a non-JSON response.");
  }
}

function describeMessages(messages: unknown): string | undefined {
  if (!Array.isArray(messages)) return undefined;
  const text = messages
    .filter(isRecord)
    .map((m) => [m.code, m.content ?? m.text ?? m.message].filter(Boolean).join(": "))
    .filter(Boolean)
    .join("; ");
  return text || undefined;
}

export function createUcpClient(options: UcpClientOptions = {}): UcpClient {
  const doFetch = options.fetch ?? fetch;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const agentProfile =
    options.agentProfile ??
    process.env.UCP_AGENT_PROFILE ??
    DEFAULT_UCP_AGENT_PROFILE;

  return {
    async callTool(storeInput, tool, args, callOptions = {}) {
      const store = resolveStore(storeInput); // throws InvalidStoreError
      if (!(APPROVED_UCP_TOOLS as readonly string[]).includes(tool)) {
        throw new UcpError("invalid_tool", `Tool "${tool}" is not approved.`);
      }

      const controller = new AbortController();
      let timedOut = false;
      const timer = setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, timeoutMs);
      const onExternalAbort = () => controller.abort();
      callOptions.signal?.addEventListener("abort", onExternalAbort, { once: true });
      if (callOptions.signal?.aborted) controller.abort();

      const body = {
        jsonrpc: "2.0",
        method: "tools/call",
        id: randomUUID(),
        params: {
          name: tool,
          arguments: {
            ...args,
            meta: {
              ...(callOptions.meta ?? {}),
              "ucp-agent": { profile: agentProfile },
            },
          },
        },
      };

      let response: Response;
      let text: string;
      try {
        response = await doFetch(getMcpUrl(store), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json, text/event-stream",
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        text = await response.text();
      } catch (error) {
        if (timedOut) {
          throw new UcpError("timeout", `Shopify request timed out after ${timeoutMs}ms.`);
        }
        if (controller.signal.aborted) {
          throw new UcpError("aborted", "Shopify request was cancelled.");
        }
        throw new UcpError(
          "network",
          `Could not reach Shopify: ${error instanceof Error ? error.message : "unknown error"}`,
        );
      } finally {
        clearTimeout(timer);
        callOptions.signal?.removeEventListener("abort", onExternalAbort);
      }

      if (!response.ok) {
        throw new UcpError("http", `Shopify returned HTTP ${response.status}.`, response.status);
      }

      const data = parseBody(text, response.headers?.get?.("content-type") ?? "");
      if (!isRecord(data)) {
        throw new UcpError("invalid_response", "Unexpected JSON-RPC envelope.");
      }
      if (data.error !== undefined) {
        const err = isRecord(data.error) ? data.error : {};
        throw new UcpError(
          "rpc_error",
          `Shopify JSON-RPC error${err.code !== undefined ? ` ${String(err.code)}` : ""}: ${String(err.message ?? "unknown")}`,
        );
      }

      const result = data.result;
      if (!isRecord(result)) {
        throw new UcpError("invalid_response", "Missing JSON-RPC result.");
      }

      let structured: unknown = result.structuredContent;
      if (!isRecord(structured) && Array.isArray(result.content)) {
        const first = result.content.find(
          (c): c is { text: string } => isRecord(c) && typeof c.text === "string",
        );
        if (first) {
          try {
            structured = JSON.parse(first.text);
          } catch {
            /* handled below */
          }
        }
      }

      if (result.isError === true) {
        throw new UcpError(
          "tool_error",
          describeMessages(isRecord(structured) ? structured.messages : undefined) ??
            "Shopify reported a tool error.",
        );
      }
      if (!isRecord(structured)) {
        throw new UcpError("invalid_response", "Shopify response had no structured content.");
      }

      const messages = Array.isArray(structured.messages) ? structured.messages : [];
      const blocking = messages.filter(
        (m) => isRecord(m) && (m.type === "error" || m.severity === "unrecoverable"),
      );
      if (blocking.length > 0) {
        throw new UcpError("tool_error", describeMessages(blocking) ?? "Shopify reported an error.");
      }

      return structured;
    },
  };
}

let defaultClient: UcpClient | undefined;
/** Shared server-side client used by the eve tools. */
export function getDefaultUcpClient(): UcpClient {
  return (defaultClient ??= createUcpClient());
}
