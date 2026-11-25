import { defineTool } from "eve/tools";
import { updateCartInput } from "../../lib/shopify/schemas.ts";
import { updateCart } from "../../lib/shopify/operations.ts";
import { updateCartApproval } from "../../lib/shopify/tool-policies.ts";
import { getDefaultUcpClient } from "../../lib/shopify/ucp-client.ts";

export default defineTool({
  description:
    "Change an existing cart (Shopify update_cart). Requires the shopper's approval. Shopify replaces the whole " +
    "line-item list, so this tool first reads the current cart, applies your changes (setItems adds a variant or " +
    "sets its quantity; removeVariantIds removes variants) and submits the COMPLETE resulting list, preserving " +
    "all other lines. Explain the resulting cart before calling. To empty a cart use cancelCart.",
  inputSchema: updateCartInput,
  approval: updateCartApproval,
  label: { start: ({ store }) => `Update ${store} cart` },
  async execute(input, ctx) {
    return updateCart(getDefaultUcpClient(), input, ctx.abortSignal);
  },
});