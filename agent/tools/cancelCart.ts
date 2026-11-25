import { defineTool } from "eve/tools";
import { cancelCartInput } from "../../lib/shopify/schemas.ts";
import { cancelCart } from "../../lib/shopify/operations.ts";
import { cancelCartApproval } from "../../lib/shopify/tool-policies.ts";
import { getDefaultUcpClient } from "../../lib/shopify/ucp-client.ts";

export default defineTool({
  description:
    "Cancel a cart (Shopify cancel_cart) in the store it was created in. Requires the shopper's approval. " +
    "Explain which cart will be cancelled before calling.",
  inputSchema: cancelCartInput,
  approval: cancelCartApproval,
  label: { start: ({ store }) => `Cancel ${store} cart` },
  async execute(input, ctx) {
    return cancelCart(getDefaultUcpClient(), input, ctx.abortSignal);
  },
});