import { defineTool } from "eve/tools";
import { createCartInput } from "../../lib/shopify/schemas.ts";
import { createCart } from "../../lib/shopify/operations.ts";
import { createCartApproval } from "../../lib/shopify/tool-policies.ts";
import { getDefaultUcpClient } from "../../lib/shopify/ucp-client.ts";

export default defineTool({
  description:
    "Create a NEW cart in one store (Shopify create_cart) from explicit variant IDs and quantities. " +
    "Requires the shopper's approval. Explain the cart contents before calling. Does not start checkout or payment.",
  inputSchema: createCartInput,
  approval: createCartApproval,
  label: { start: ({ store }) => `Create ${store} cart` },
  async execute(input, ctx) {
    return createCart(getDefaultUcpClient(), input, ctx.abortSignal);
  },
});