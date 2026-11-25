---
description: Use when the shopper wants clothing from UrbanThread, such as shirts, trousers, outfits, or gifts, or asks about sizes, colours, or fit.
---

# Apparel shopping (UrbanThread)

Store key: `urbanthread`.

1. Work out the occasion (office, casual, party, gym), the item type, and any budget. Ask at most one question if something essential is missing. Do not interrogate.
2. Call `searchProducts` with `store: "urbanthread"` and a natural-language `query` that includes the item and occasion, for example `formal shirt for office`. Use `limit` 4 to 6. Set `availableOnly: true`.
3. If the shopper gave a budget, pass `minPrice`/`maxPrice`. These are in **minor units**, so ₹2,000 is `200000`.
4. If results look thin, retry once with a broader query (drop colour or fit words).
5. For a product the shopper is interested in, call `getProductDetails` to see sizes, colours and stock per variant.
6. Recommend 1 to 3 items. Say why each fits the occasion, and mention which sizes or colours are available.
7. Ask for size and colour before suggesting a cart, then hand over to the `cart-checkout` skill.

Do not guess sizes. Only offer variants the tool reports as available.
