import { useState, type ReactNode } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { EveMessage, EveToolPart } from "eve/react";
import type {
  CartSummary,
  Money,
  ProductSummary,
} from "../../../lib/shopify/types";
import styles from "./MessageContent.module.scss";

type Respond = (
  answers: { interactionId: string; optionId?: string; text?: string }[],
) => unknown;

interface Props {
  message: EveMessage;
  respond: Respond;
  /** Disable approval buttons (e.g. while resuming) */
  disabled?: boolean;
}

const STORE_NAMES: Record<string, string> = {
  urbanthread: "UrbanThread",
  glowlab: "GlowLab",
};

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/* ---------------------------------- text ---------------------------------- */

function Text({ text }: { text: string }) {
  return (
    <div className={styles.markdown}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {text}
      </Markdown>
    </div>
  );
}

/* -------------------------------- products -------------------------------- */

function priceLabel(p: ProductSummary): string | undefined {
  if (!p.priceRange) return undefined;
  const { min, max } = p.priceRange;
  return min.amount === max.amount
    ? min.formatted
    : `${min.formatted} – ${max.formatted}`;
}

function ProductCard({ product }: { product: ProductSummary }) {
  const price = priceLabel(product);
  const known = product.variants.filter((v) => v.available !== undefined);
  const inStock = known.length === 0 ? undefined : known.some((v) => v.available);
  const options = new Map<string, Set<string>>();
  for (const v of product.variants) {
    if (v.available === false) continue;
    for (const o of v.options) {
      if (!options.has(o.name)) options.set(o.name, new Set());
      options.get(o.name)!.add(o.label);
    }
  }

  return (
    <li className={styles.product}>
      <div className={styles.productTop}>
        <h4 className={styles.productTitle}>{product.title}</h4>
        {price && <span className={styles.price}>{price}</span>}
      </div>

      {product.description && (
        <p className={styles.productDesc}>{product.description}</p>
      )}

      {options.size > 0 && (
        <dl className={styles.options}>
          {[...options].slice(0, 3).map(([name, labels]) => (
            <div key={name}>
              <dt>{name}</dt>
              <dd>
                {[...labels].slice(0, 6).map((l) => (
                  <span key={l} className={styles.chip}>
                    {l}
                  </span>
                ))}
                {labels.size > 6 && (
                  <span className={styles.chipMore}>+{labels.size - 6}</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <div className={styles.productFoot}>
        {inStock !== undefined && (
          <span className={inStock ? styles.stockIn : styles.stockOut}>
            {inStock ? "In stock" : "Out of stock"}
          </span>
        )}
        {product.url && (
          <a href={product.url} target="_blank" rel="noopener noreferrer">
            View product
          </a>
        )}
      </div>
    </li>
  );
}

function ProductList({
  store,
  products,
}: {
  store?: string;
  products: ProductSummary[];
}) {
  if (products.length === 0) return null;
  return (
    <section className={styles.panel} aria-label="Products">
      {store && (
        <header className={styles.panelHead}>
          <span className={styles.storeTag}>{STORE_NAMES[store] ?? store}</span>
          <span className={styles.muted}>
            {products.length} {products.length === 1 ? "product" : "products"}
          </span>
        </header>
      )}
      <ul className={styles.productGrid}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </ul>
    </section>
  );
}

/* ---------------------------------- carts --------------------------------- */

const TOTAL_LABELS: Record<string, string> = {
  subtotal: "Subtotal",
  items_discount: "Discount",
  discount: "Discount",
  fulfillment: "Shipping",
  shipping: "Shipping",
  tax: "Tax",
  total: "Total",
};

function CartCard({
  store,
  cart,
  heading,
  previous,
}: {
  store?: string;
  cart: CartSummary;
  heading: string;
  previous?: CartSummary["lineItems"];
}) {
  const count = cart.lineItems.reduce((n, l) => n + l.quantity, 0);
  const total =
    cart.totals.find((t) => t.type === "total") ??
    cart.totals[cart.totals.length - 1];
  const rows = cart.totals.filter((t) => t.type !== "total");
  const warnings = cart.messages.filter((m) => m.text);
  const prevQty = new Map(previous?.map((l) => [l.variantId, l.quantity]));

  return (
    <section className={styles.panel} aria-label={heading}>
      <header className={styles.panelHead}>
        <span className={styles.storeTag}>
          {store ? (STORE_NAMES[store] ?? store) : "Cart"}
        </span>
        <span className={styles.muted}>
          {heading} · {count} {count === 1 ? "item" : "items"}
        </span>
      </header>

      <ul className={styles.lines}>
        {cart.lineItems.map((l) => {
          const was = prevQty.get(l.variantId);
          const lineTotal = l.totals.find((t) => t.type === "subtotal") ?? l.totals[0];
          return (
            <li key={l.lineId ?? l.variantId}>
              <span className={styles.lineTitle}>
                {l.title ?? "Item"}
                {was !== undefined && was !== l.quantity && (
                  <em className={styles.changed}>
                    {" "}
                    (was {was})
                  </em>
                )}
                {was === undefined && previous && (
                  <em className={styles.changed}> (new)</em>
                )}
              </span>
              <span className={styles.qty}>× {l.quantity}</span>
              <span className={styles.lineTotal}>{lineTotal?.formatted ?? ""}</span>
            </li>
          );
        })}
      </ul>

      {(rows.length > 0 || total) && (
        <dl className={styles.totals}>
          {rows.map((t) => (
            <div key={t.type}>
              <dt>{TOTAL_LABELS[t.type] ?? t.type}</dt>
              <dd>{t.formatted}</dd>
            </div>
          ))}
          {total && (
            <div className={styles.grand}>
              <dt>{TOTAL_LABELS[total.type] ?? "Total"}</dt>
              <dd>{total.formatted}</dd>
            </div>
          )}
        </dl>
      )}

      {warnings.map((m, i) => (
        <p key={i} className={styles.notice}>
          {m.text}
        </p>
      ))}
    </section>
  );
}

/* -------------------------------- approvals ------------------------------- */

function Approval({
  part,
  respond,
  disabled,
}: {
  part: EveToolPart;
  respond: Respond;
  disabled?: boolean;
}) {
  const [sent, setSent] = useState(false);
  const ix = part.interaction;
  if (!ix) return null;

  if (ix.status === "settled") {
    if (ix.outcome === "accepted") return <p className={styles.decision}>✓ Approved</p>;
    if (ix.outcome === "declined") return <p className={styles.decision}>✕ Declined</p>;
    return null;
  }

  const options = ix.request.options ?? [];
  return (
    <section className={styles.approval} role="group" aria-label="Approval required">
      <p className={styles.approvalLabel}>Needs your approval</p>
      <p className={styles.approvalPrompt}>{ix.request.prompt}</p>
      <div className={styles.approvalActions}>
        {options.map((o, i) => (
          <button
            key={o.id}
            type="button"
            className={i === 0 ? styles.approve : styles.decline}
            disabled={disabled || sent}
            onClick={() => {
              setSent(true);
              void Promise.resolve(
                respond([{ interactionId: ix.interactionId, optionId: o.id }]),
              ).catch(() => setSent(false));
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------- tools --------------------------------- */

const ACTIVITY: Record<string, string> = {
  searchProducts: "Searching the catalog",
  lookupProducts: "Looking up products",
  getProductDetails: "Getting product details",
  createCart: "Creating your cart",
  getCart: "Checking your cart",
  updateCart: "Updating your cart",
  cancelCart: "Cancelling your cart",
};

function ToolResult({
  part,
  respond,
  disabled,
}: {
  part: EveToolPart;
  respond: Respond;
  disabled?: boolean;
}) {
  if (part.kind === "control") return null;

  const approval = <Approval part={part} respond={respond} disabled={disabled} />;

  if (part.state === "failed") {
    return (
      <>
        {approval}
        <p className={styles.notice}>
          Couldn’t complete “{part.label}”. You can ask me to try again.
        </p>
      </>
    );
  }
  if (part.state === "rejected" || part.state === "cancelled") return approval;

  if (part.state !== "completed") {
    // streaming | requested | approval | running | blocked
    if (part.state === "approval" || part.interaction?.status === "open") {
      return approval;
    }
    return (
      <p className={styles.activity} role="status">
        <span className={styles.spinner} aria-hidden="true" />
        {ACTIVITY[part.name] ?? part.label}…
      </p>
    );
  }

  const out = isRecord(part.output) ? part.output : undefined;
  if (!out) return approval;
  const store = typeof out.store === "string" ? out.store : undefined;

  switch (part.name) {
    case "searchProducts":
    case "lookupProducts":
      return (
        <ProductList
          store={store}
          products={Array.isArray(out.products) ? (out.products as ProductSummary[]) : []}
        />
      );
    case "getProductDetails":
      return isRecord(out.product) ? (
        <ProductList store={store} products={[out.product as unknown as ProductSummary]} />
      ) : null;
    case "createCart":
    case "getCart":
    case "updateCart":
      return isRecord(out.cart) ? (
        <>
          {approval}
          <CartCard
            store={store}
            cart={out.cart as unknown as CartSummary}
            heading={
              part.name === "createCart"
                ? "Cart created"
                : part.name === "updateCart"
                  ? "Cart updated"
                  : "Your cart"
            }
            previous={
              part.name === "updateCart" && Array.isArray(out.previous)
                ? (out.previous as CartSummary["lineItems"])
                : undefined
            }
          />
        </>
      ) : null;
    case "cancelCart":
      return (
        <>
          {approval}
          <p className={styles.decision}>Cart cancelled.</p>
        </>
      );
    default:
      return approval;
  }
}

/* --------------------------------- message -------------------------------- */

export default function MessageContent({ message, respond, disabled }: Props): ReactNode {
  const blocks: ReactNode[] = [];
  message.parts.forEach((part, i) => {
    if (part.type === "text") {
      if (part.text.trim()) blocks.push(<Text key={part.id ?? `t${i}`} text={part.text} />);
    } else if (part.type === "tool") {
      if (part.hidden) return;
      blocks.push(
        <ToolResult key={part.callId} part={part} respond={respond} disabled={disabled} />,
      );
    }
  });
  return <div className={styles.stack}>{blocks}</div>;
}

export type { Money };
