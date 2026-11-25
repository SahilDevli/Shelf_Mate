import { always } from "eve/tools/approval";

/**
 * Approval policies for the cart-mutating tools. Kept in lib/ so the exact
 * objects used by agent/tools/*.ts are unit-tested.
 */

export const createCartApproval = {
  request: always(),
  prompt: ({ input }: { input: { store: string; lineItems: { variantId: string; quantity: number }[] } }) =>
    `Create a new ${input.store} cart with ${input.lineItems
      .map((i) => `${i.quantity} x ${i.variantId}`)
      .join(", ")}?`,
};

export const updateCartApproval = {
  request: always(),
  prompt: ({
    input,
  }: {
    input: {
      store: string;
      setItems: { variantId: string; quantity: number }[];
      removeVariantIds: string[];
    };
  }) => {
    const sets = input.setItems.map((i) => `set ${i.variantId} to ${i.quantity}`);
    const removes = input.removeVariantIds.map((id) => `remove ${id}`);
    return `Update ${input.store} cart: ${[...sets, ...removes].join("; ")} (other lines are kept)?`;
  },
};

export const cancelCartApproval = {
  request: always(),
  // The cart "?key=" suffix is a capability token; never show it in prompts.
  prompt: ({ input }: { input: { store: string; cartId: string } }) =>
    `Cancel the ${input.store} cart ${input.cartId.split("?")[0]}?`,
};
