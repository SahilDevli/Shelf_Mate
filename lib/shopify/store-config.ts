/**
 * Strict store allowlist. Tool input only ever carries a store KEY; the domain
 * is resolved here and never accepted from the caller.
 */
export const STORE_KEYS = ["urbanthread", "glowlab"] as const;
export type StoreKey = (typeof STORE_KEYS)[number];

export interface StoreConfig {
  readonly key: StoreKey;
  readonly name: string;
  readonly domain: string;
}

export const STORES: Readonly<Record<StoreKey, StoreConfig>> = Object.freeze({
  urbanthread: Object.freeze({
    key: "urbanthread",
    name: "UrbanThread",
    domain: "urbanthreads-9991.myshopify.com",
  }),
  glowlab: Object.freeze({
    key: "glowlab",
    name: "GlowLab",
    domain: "shelf-mate.myshopify.com",
  }),
});

export const UCP_MCP_PATH = "/api/ucp/mcp";

/** Agent profile verified during the exploration phase. */
export const DEFAULT_UCP_AGENT_PROFILE =
  "https://shopify.dev/ucp/agent-profiles/examples/2026-08-25/valid-with-capabilities.json";

export class InvalidStoreError extends Error {
  readonly code = "invalid_store";
  constructor() {
    super(`Invalid store. Allowed values: ${STORE_KEYS.join(", ")}.`);
    this.name = "InvalidStoreError";
  }
}

export function isStoreKey(value: unknown): value is StoreKey {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(STORES, value)
  );
}

export function resolveStore(value: unknown): StoreConfig {
  if (!isStoreKey(value)) throw new InvalidStoreError();
  return STORES[value];
}

export function getMcpUrl(store: StoreConfig): string {
  return `https://${store.domain}${UCP_MCP_PATH}`;
}
