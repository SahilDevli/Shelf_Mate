import { defineTool } from "eve/tools";
import { getCartInput } from "../../lib/shopify/schemas.ts";
import { getCart } from "../../lib/shopify/operations.ts";
import { getDefaultUcpClient } from "../../lib/shopify/ucp-client.ts";

export default defineTool({
  description:
    "Read a cart (Shopify get_cart) by its ID in the store it was created in. Read-only. " +
    "Cart ownership is not verified; only use cart IDs created in this conversation or supplied by the shopper.",
  inputSchema: getCartInput,
  label: { start: ({ store }) => `Get ${store} cart` },
  async execute(input, ctx) {
    return getCart(getDefaultUcpClient(), input, ctx.abortSignal);
  },
});
