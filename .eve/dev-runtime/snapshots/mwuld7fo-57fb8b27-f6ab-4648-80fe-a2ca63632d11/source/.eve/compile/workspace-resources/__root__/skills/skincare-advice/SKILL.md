---
description: Use when the shopper asks about skincare or beauty from GlowLab, such as sunscreen, moisturiser, cleanser, serums, or products for dry, oily, sensitive or acne-prone skin.
---

# Skincare advice (GlowLab)

Store key: `glowlab`.

1. Identify the product type and the skin concern or type (dry, oily, combination, sensitive, acne-prone). If missing and it matters, ask one short question.
2. Call `searchProducts` with `store: "glowlab"` and a query combining product and concern, for example `sunscreen for dry skin`. Use `limit` 4 to 6 and `availableOnly: true`.
3. Retry once with a broader query if there are few results.
4. Use `getProductDetails` for any product you recommend so you can mention its variants (sizes or shades) and stock.
5. Recommend 1 to 3 products. Explain in plain language why each suits the skin type, using only what the product's title, description and tags support. Do not invent ingredients or claims.
6. For a routine request, suggest an order (cleanse, treat, moisturise, sunscreen) and search for each step.

Give general guidance only. For persistent or severe skin problems, suggest seeing a dermatologist.
