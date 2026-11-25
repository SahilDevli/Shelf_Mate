import { defineTool } from "eve/tools";
import { getProductDetailsInput } from "../../lib/shopify/schemas.ts";
import { getProductDetails } from "../../lib/shopify/operations.ts";
import { getDefaultUcpClient } from "../../lib/shopify/ucp-client.ts";

export default defineTool({
  description:
    "Get full details for one product (Shopify get_product): variants, options, prices and availability. " +
    "productId must be a gid://shopify/Product/... ID from the same store's catalog results.",
  inputSchema: getProductDetailsInput,
  label: { start: ({ store }) => `Get product details from ${store}` },
  async execute(input, ctx) {
    return getProductDetails(getDefaultUcpClient(), input, ctx.abortSignal);
  },
});
