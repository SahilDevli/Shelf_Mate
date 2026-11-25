import { defineTool } from "eve/tools";
import { searchProductsInput } from "../../lib/shopify/schemas.ts";
import { searchProducts } from "../../lib/shopify/operations.ts";
import { getDefaultUcpClient } from "../../lib/shopify/ucp-client.ts";

export default defineTool({
  description:
    "Search one store's product catalog (Shopify search_catalog). Choose the store first: " +
    '"urbanthread" for apparel, "glowlab" for beauty/skincare. Returns products with variant IDs, ' +
    "prices (minor units + formatted) and availability. Use pagination.cursor to fetch more results. " +
    "Never use IDs from one store in another.",
  inputSchema: searchProductsInput,
  label: { start: ({ store, query }) => `Search ${store}${query ? ` for "${query}"` : ""}` },
  async execute(input, ctx) {
    return searchProducts(getDefaultUcpClient(), input, ctx.abortSignal);
  },
});
