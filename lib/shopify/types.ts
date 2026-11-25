export const APPROVED_UCP_TOOLS = [
  "search_catalog",
  "lookup_catalog",
  "get_product",
  "create_cart",
  "get_cart",
  "update_cart",
  "cancel_cart",
] as const;
export type UcpToolName = (typeof APPROVED_UCP_TOOLS)[number];

export type UcpErrorCode =
  | "invalid_store"
  | "invalid_tool"
  | "timeout"
  | "aborted"
  | "network"
  | "http"
  | "invalid_json"
  | "rpc_error"
  | "tool_error"
  | "invalid_response"
  | "validation";

export class UcpError extends Error {
  readonly code: UcpErrorCode;
  readonly status?: number;
  constructor(code: UcpErrorCode, message: string, status?: number) {
    super(message);
    this.name = "UcpError";
    this.code = code;
    this.status = status;
  }
}

export interface Money {
  amount: number; // ISO 4217 minor units
  currency: string;
  formatted: string;
}

export interface ProductVariantSummary {
  id: string;
  title: string;
  sku?: string;
  price?: Money;
  available?: boolean;
  options: { name: string; label: string }[];
}

export interface ProductSummary {
  id: string;
  title: string;
  url?: string;
  description?: string;
  priceRange?: { min: Money; max: Money };
  variants: ProductVariantSummary[];
  tags?: string[];
}

export interface CartLineSummary {
  lineId?: string;
  variantId: string;
  title?: string;
  quantity: number;
  unitPriceMinor?: number;
  totals: { type: string; amount: number; formatted: string }[];
}

export interface CartSummary {
  id: string;
  currency?: string;
  lineItems: CartLineSummary[];
  totals: { type: string; amount: number; formatted: string }[];
  expiresAt?: string;
  messages: { type?: string; text?: string }[];
}

export interface LineItemInput {
  variantId: string;
  quantity: number;
}
