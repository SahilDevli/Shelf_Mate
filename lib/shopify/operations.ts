import { randomUUID } from "node:crypto";
import { z } from "zod";
import type { UcpClient } from "./ucp-client.ts";
import { resolveStore } from "./store-config.ts";
import { UcpError } from "./types.ts";
import type {
  CartLineSummary,
  CartSummary,
  LineItemInput,
  Money,
  ProductSummary,
  ProductVariantSummary,
} from "./types.ts";

// ---------- response validation (shapes taken from reports/ucp-sample-responses) ----------

const moneySchema = z.object({ amount: z.number(), currency: z.string() }).passthrough();

const variantSchema = z
  .object({
    id: z.string(),
    title: z.string().optional(),
    sku: z.string().optional(),
    price: moneySchema.optional(),
    availability: z.object({ available: z.boolean().optional() }).passthrough().optional(),
    options: z.array(z.object({ name: z.string(), label: z.string() }).passthrough()).optional(),
  })
  .passthrough();

const productSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    url: z.string().optional(),
    description: z.object({ html: z.string().optional() }).passthrough().optional(),
    price_range: z.object({ min: moneySchema, max: moneySchema }).passthrough().optional(),
    variants: z.array(variantSchema).default([]),
    tags: z.array(z.string()).optional(),
  })
  .passthrough();

const totalSchema = z
  .object({ type: z.string(), amount: z.number(), display_text: z.string().optional() })
  .passthrough();

const cartSchema = z
  .object({
    id: z.string(),
    currency: z.string().optional(),
    line_items: z
      .array(
        z
          .object({
            id: z.string().optional(),
            quantity: z.number(),
            item: z
              .object({ id: z.string(), title: z.string().optional(), price: z.number().optional() })
              .passthrough(),
            totals: z.array(totalSchema).optional(),
          })
          .passthrough(),
      )
      .default([]),
    totals: z.array(totalSchema).optional(),
    expires_at: z.string().optional(),
    messages: z.array(z.record(z.string(), z.unknown())).optional(),
  })
  .passthrough();

function parseOrThrow<T extends z.ZodType>(schema: T, value: unknown, what: string): z.infer<T> {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    throw new UcpError("invalid_response", `Shopify returned an invalid ${what} response.`);
  }
  return parsed.data;
}

// ---------- formatting ----------

export function formatMoney(amount: number, currency: string): string {
  try {
    const fmt = new Intl.NumberFormat("en", { style: "currency", currency });
    const digits = fmt.resolvedOptions().maximumFractionDigits ?? 2;
    return fmt.format(amount / 10 ** digits);
  } catch {
    return `${amount} ${currency} (minor units)`;
  }
}

function money(m: { amount: number; currency: string }): Money {
  return { amount: m.amount, currency: m.currency, formatted: formatMoney(m.amount, m.currency) };
}

function stripHtml(html: string | undefined, max = 300): string | undefined {
  if (!html) return undefined;
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export function summarizeProduct(raw: unknown): ProductSummary {
  const p = parseOrThrow(productSchema, raw, "product");
  return {
    id: p.id,
    title: p.title,
    url: p.url,
    description: stripHtml(p.description?.html),
    priceRange: p.price_range
      ? { min: money(p.price_range.min), max: money(p.price_range.max) }
      : undefined,
    variants: p.variants.map(
      (v): ProductVariantSummary => ({
        id: v.id,
        title: v.title ?? "",
        sku: v.sku,
        price: v.price ? money(v.price) : undefined,
        available: v.availability?.available,
        options: (v.options ?? []).map((o) => ({ name: o.name, label: o.label })),
      }),
    ),
    tags: p.tags,
  };
}

export function summarizeCart(raw: unknown, fallbackCurrency = "INR"): CartSummary {
  const c = parseOrThrow(cartSchema, raw, "cart");
  const currency = c.currency ?? fallbackCurrency;
  const fmtTotals = (t: z.infer<typeof totalSchema>[] | undefined) =>
    (t ?? []).map((x) => ({
      type: x.type,
      amount: x.amount,
      formatted: formatMoney(x.amount, currency),
    }));
  return {
    id: c.id,
    currency: c.currency,
    lineItems: c.line_items.map(
      (l): CartLineSummary => ({
        lineId: l.id,
        variantId: l.item.id,
        title: l.item.title,
        quantity: l.quantity,
        unitPriceMinor: l.item.price,
        totals: fmtTotals(l.totals),
      }),
    ),
    totals: fmtTotals(c.totals),
    expiresAt: c.expires_at,
    messages: (c.messages ?? []).map((m) => ({
      type: typeof m.type === "string" ? m.type : undefined,
      text: typeof (m.content ?? m.text) === "string" ? String(m.content ?? m.text) : undefined,
    })),
  };
}

function context(country: string) {
  return { address_country: country };
}

// ---------- catalog operations ----------

export interface SearchInput {
  store: string;
  query?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  availableOnly?: boolean;
  limit: number;
  cursor?: string;
  country: string;
}

export async function searchProducts(client: UcpClient, input: SearchInput, signal?: AbortSignal) {
  const store = resolveStore(input.store);
  const filters: Record<string, unknown> = {};
  if (input.categories?.length) filters.categories = input.categories;
  if (input.minPrice !== undefined || input.maxPrice !== undefined) {
    filters.price = {
      ...(input.minPrice !== undefined ? { min: input.minPrice } : {}),
      ...(input.maxPrice !== undefined ? { max: input.maxPrice } : {}),
    };
  }
  if (input.availableOnly !== undefined) filters.available = input.availableOnly;

  const catalog: Record<string, unknown> = {
    ...(input.query ? { query: input.query } : {}),
    context: context(input.country),
    ...(Object.keys(filters).length ? { filters } : {}),
    pagination: { limit: input.limit, ...(input.cursor ? { cursor: input.cursor } : {}) },
  };

  const res = await client.callTool(store.key, "search_catalog", { catalog }, { signal });
  if (!Array.isArray(res.products)) {
    throw new UcpError("invalid_response", "search_catalog response had no products array.");
  }
  const pagination = (res.pagination ?? {}) as { has_next_page?: boolean; cursor?: string };
  return {
    store: store.key,
    products: res.products.map(summarizeProduct),
    pagination: { hasNextPage: pagination.has_next_page === true, cursor: pagination.cursor },
  };
}

export async function lookupProducts(
  client: UcpClient,
  input: { store: string; ids: string[]; country: string },
  signal?: AbortSignal,
) {
  const store = resolveStore(input.store);
  const res = await client.callTool(
    store.key,
    "lookup_catalog",
    { catalog: { ids: input.ids, context: context(input.country) } },
    { signal },
  );
  if (!Array.isArray(res.products)) {
    throw new UcpError("invalid_response", "lookup_catalog response had no products array.");
  }
  return { store: store.key, products: res.products.map(summarizeProduct) };
}

export async function getProductDetails(
  client: UcpClient,
  input: { store: string; productId: string; country: string },
  signal?: AbortSignal,
) {
  const store = resolveStore(input.store);
  const res = await client.callTool(
    store.key,
    "get_product",
    { catalog: { id: input.productId, context: context(input.country) } },
    { signal },
  );
  if (!res.product) {
    throw new UcpError("invalid_response", "get_product response had no product.");
  }
  return { store: store.key, product: summarizeProduct(res.product) };
}

// ---------- cart operations ----------

/** Confirms every variant exists (and is sellable) in THIS store's catalog. */
export async function verifyVariantsInStore(
  client: UcpClient,
  storeKey: string,
  variantIds: string[],
  country: string,
  signal?: AbortSignal,
): Promise<void> {
  if (variantIds.length === 0) return;
  const found = new Map<string, boolean | undefined>();
  for (let i = 0; i < variantIds.length; i += 10) {
    const chunk = variantIds.slice(i, i + 10);
    const res = await client.callTool(
      storeKey,
      "lookup_catalog",
      { catalog: { ids: chunk, context: context(country) } },
      { signal },
    );
    if (!Array.isArray(res.products)) {
      throw new UcpError("invalid_response", "lookup_catalog response had no products array.");
    }
    for (const product of res.products) {
      const p = parseOrThrow(productSchema, product, "product");
      for (const v of p.variants) found.set(v.id, v.availability?.available);
    }
  }
  const missing = variantIds.filter((id) => !found.has(id));
  if (missing.length > 0) {
    throw new UcpError(
      "validation",
      `Variant(s) not found in store "${storeKey}": ${missing.join(", ")}. Use IDs from this store's catalog.`,
    );
  }
  const unavailable = variantIds.filter((id) => found.get(id) === false);
  if (unavailable.length > 0) {
    throw new UcpError("validation", `Variant(s) not available: ${unavailable.join(", ")}.`);
  }
}

function toLineItems(items: LineItemInput[]) {
  return items.map((i) => ({ quantity: i.quantity, item: { id: i.variantId } }));
}

export async function createCart(
  client: UcpClient,
  input: { store: string; lineItems: LineItemInput[]; country: string },
  signal?: AbortSignal,
) {
  const store = resolveStore(input.store);
  await verifyVariantsInStore(
    client,
    store.key,
    input.lineItems.map((i) => i.variantId),
    input.country,
    signal,
  );
  const res = await client.callTool(
    store.key,
    "create_cart",
    { cart: { line_items: toLineItems(input.lineItems), context: context(input.country) } },
    { signal },
  );
  return { store: store.key, cart: summarizeCart(res) };
}

export async function getCart(
  client: UcpClient,
  input: { store: string; cartId: string },
  signal?: AbortSignal,
) {
  const store = resolveStore(input.store);
  const res = await client.callTool(store.key, "get_cart", { id: input.cartId }, { signal });
  return { store: store.key, cart: summarizeCart(res) };
}

/**
 * Pure helper: builds the COMPLETE intended line-item collection from the
 * existing cart plus the requested changes. update_cart replaces the whole
 * collection, so anything omitted here would be dropped from the cart.
 */
export function mergeLineItems(
  existing: { variantId: string; quantity: number }[],
  setItems: LineItemInput[],
  removeVariantIds: string[],
): LineItemInput[] {
  const merged = new Map<string, number>();
  for (const l of existing) merged.set(l.variantId, (merged.get(l.variantId) ?? 0) + l.quantity);
  for (const s of setItems) merged.set(s.variantId, s.quantity);
  for (const id of removeVariantIds) merged.delete(id);
  return [...merged.entries()].map(([variantId, quantity]) => ({ variantId, quantity }));
}

export async function updateCart(
  client: UcpClient,
  input: {
    store: string;
    cartId: string;
    setItems: LineItemInput[];
    removeVariantIds: string[];
    country: string;
  },
  signal?: AbortSignal,
) {
  const store = resolveStore(input.store);

  // 1. Read current state so no existing line item is silently dropped.
  const current = summarizeCart(
    await client.callTool(store.key, "get_cart", { id: input.cartId }, { signal }),
  );
  const existingIds = new Set(current.lineItems.map((l) => l.variantId));

  const unknownRemovals = input.removeVariantIds.filter((id) => !existingIds.has(id));
  if (unknownRemovals.length > 0) {
    throw new UcpError("validation", `Cannot remove variants not in the cart: ${unknownRemovals.join(", ")}.`);
  }

  // 2. Build the complete intended collection.
  const desired = mergeLineItems(current.lineItems, input.setItems, input.removeVariantIds);
  if (desired.length === 0) {
    throw new UcpError("validation", "Update would empty the cart. Use cancelCart instead.");
  }

  // 3. Newly added variants must belong to this store.
  await verifyVariantsInStore(
    client,
    store.key,
    input.setItems.map((i) => i.variantId).filter((id) => !existingIds.has(id)),
    input.country,
    signal,
  );

  // 4. Submit the full collection.
  const res = await client.callTool(
    store.key,
    "update_cart",
    { id: input.cartId, cart: { line_items: toLineItems(desired), context: context(input.country) } },
    { signal },
  );
  const cart = summarizeCart(res);

  // 5. Verify Shopify's result matches the intended state exactly.
  const actual = new Map<string, number>();
  for (const l of cart.lineItems) actual.set(l.variantId, (actual.get(l.variantId) ?? 0) + l.quantity);
  const matches =
    actual.size === desired.length && desired.every((d) => actual.get(d.variantId) === d.quantity);
  if (!matches) {
    throw new UcpError(
      "invalid_response",
      "Shopify's updated cart does not match the intended line items. Re-read the cart with getCart.",
    );
  }
  return { store: store.key, previous: current.lineItems, cart };
}

export async function cancelCart(
  client: UcpClient,
  input: { store: string; cartId: string },
  signal?: AbortSignal,
) {
  const store = resolveStore(input.store);
  const res = await client.callTool(
    store.key,
    "cancel_cart",
    { id: input.cartId },
    { signal, meta: { "idempotency-key": randomUUID() } },
  );
  const parsed = cartSchema.safeParse(res);
  return {
    store: store.key,
    cartId: input.cartId,
    cancelled: true as const,
    status: typeof res.status === "string" ? res.status : undefined,
    cart: parsed.success ? summarizeCart(parsed.data) : undefined,
  };
}
