import { defineTool } from "eve/tools";
import { lookupProductsInput } from "../../lib/shopify/schemas.ts";
import { lookupProducts } from "../../lib/shopify/operations.ts";
import { getDefaultUcpClient } from "../../lib/shopify/ucp-client.ts";

export default defineTool({
  description:
    "Look up up to 10 known products or variants by ID (Shopify lookup_catalog) in ONE store. " +
    "IDs must come from that same store's earlier catalog results.",
  inputSchema: lookupProductsInput,
  label: { start: ({ store, ids }) => `Look up ${ids.length} item(s) in ${store}` },
  async execute(input, ctx) {
    return lookupProducts(getDefaultUcpClient(), input, ctx.abortSignal);
  },
});
