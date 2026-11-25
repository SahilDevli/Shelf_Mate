import { z } from "zod";
import { STORE_KEYS } from "./store-config.ts";

export const storeSchema = z
  .enum(STORE_KEYS)
  .describe(
    'Which store to use: "urbanthread" (apparel) or "glowlab" (beauty/skincare). Never mix stores.',
  );

export const productIdSchema = z
  .string()
  .regex(/^gid:\/\/shopify\/Product\/\d+$/, "Must be a product GID: gid://shopify/Product/<digits>")
  .describe("Product ID returned by the catalog, e.g. gid://shopify/Product/123");

export const variantIdSchema = z
  .string()
  .regex(
    /^gid:\/\/shopify\/ProductVariant\/\d+$/,
    "Must be a variant GID: gid://shopify/ProductVariant/<digits>",
  )
  .describe("Product variant ID returned by the catalog, e.g. gid://shopify/ProductVariant/123");

export const productOrVariantIdSchema = z
  .string()
  .regex(
    /^gid:\/\/shopify\/(Product|ProductVariant)\/\d+$/,
    "Must be a product or variant GID returned by the catalog",
  );

export const cartIdSchema = z
  .string()
  .regex(
    /^gid:\/\/shopify\/Cart\/[A-Za-z0-9_-]+(\?key=[A-Za-z0-9_-]+)?$/,
    "Must be a cart GID: gid://shopify/Cart/<id>[?key=<key>]",
  )
  .describe("Cart ID exactly as returned by createCart/getCart (including any ?key=...)");

export const quantitySchema = z
  .number()
  .int("Quantity must be an integer")
  .positive("Quantity must be positive")
  .max(100, "Quantity must be at most 100");

export const countrySchema = z
  .string()
  .regex(/^[A-Z]{2}$/, "Use a 2-letter ISO 3166-1 country code, e.g. IN")
  .default("IN")
  .describe("Buyer country (ISO 3166-1 alpha-2). Defaults to IN.");

export const lineItemInputSchema = z.object({
  variantId: variantIdSchema,
  quantity: quantitySchema,
});

function uniqueVariants(items: { variantId: string }[]): boolean {
  return new Set(items.map((i) => i.variantId)).size === items.length;
}

export const searchProductsInput = z
  .object({
    store: storeSchema,
    query: z.string().trim().min(1).max(200).optional().describe("Natural-language search text"),
    categories: z.array(z.string().min(1).max(100)).max(10).optional(),
    minPrice: z.number().int().nonnegative().optional().describe("Minimum price in minor currency units"),
    maxPrice: z.number().int().nonnegative().optional().describe("Maximum price in minor currency units"),
    availableOnly: z.boolean().optional().describe("Only sale-ready items (Shopify default true)"),
    limit: z.number().int().min(1).max(20).default(5),
    cursor: z.string().min(1).max(2000).optional().describe("pagination.cursor from a previous search"),
    country: countrySchema,
  })
  .refine((v) => v.query !== undefined || (v.categories?.length ?? 0) > 0 || v.minPrice !== undefined || v.maxPrice !== undefined, {
    message: "Provide at least a query or a filter",
  })
  .refine((v) => v.minPrice === undefined || v.maxPrice === undefined || v.minPrice <= v.maxPrice, {
    message: "minPrice must be <= maxPrice",
  });

export const lookupProductsInput = z.object({
  store: storeSchema,
  ids: z.array(productOrVariantIdSchema).min(1).max(10),
  country: countrySchema,
});

export const getProductDetailsInput = z.object({
  store: storeSchema,
  productId: productIdSchema,
  country: countrySchema,
});

export const createCartInput = z.object({
  store: storeSchema,
  lineItems: z
    .array(lineItemInputSchema)
    .min(1)
    .max(20)
    .refine(uniqueVariants, "Each variant may appear only once; combine quantities"),
  country: countrySchema,
});

export const getCartInput = z.object({
  store: storeSchema,
  cartId: cartIdSchema,
});

export const updateCartInput = z
  .object({
    store: storeSchema,
    cartId: cartIdSchema,
    setItems: z
      .array(lineItemInputSchema)
      .max(20)
      .default([])
      .describe("Variants to add, or whose quantity to set to the given value"),
    removeVariantIds: z.array(variantIdSchema).max(20).default([]).describe("Variants to remove"),
    country: countrySchema,
  })
  .refine((v) => v.setItems.length + v.removeVariantIds.length > 0, {
    message: "Provide setItems and/or removeVariantIds",
  })
  .refine((v) => uniqueVariants(v.setItems), "Each variant may appear only once in setItems")
  .refine(
    (v) => !v.setItems.some((i) => v.removeVariantIds.includes(i.variantId)),
    "A variant cannot be both set and removed",
  );

export const cancelCartInput = z.object({
  store: storeSchema,
  cartId: cartIdSchema,
});
