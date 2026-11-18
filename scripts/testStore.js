
require("dotenv").config();

const stores = [
  {
    name: "UrbanThread",
    shop: process.env.SHOPIFY_URBANTHREAD_SHOP,
    token: process.env.SHOPIFY_URBANTHREAD_TOKEN,
  },
  {
    name: "GlowLab",
    shop: process.env.SHOPIFY_GLOWLAB_SHOP,
    token: process.env.SHOPIFY_GLOWLAB_TOKEN,
  },
];

async function fetchShopify(store) {
  if (!store.shop || !store.token) {
    throw new Error(`${store.name}: Missing shop domain or token`);
  }

  const shop = store.shop
    .replace(/^https?:\/\//, "")
    .replace(/\.myshopify\.com\/?$/, "");

  const url = `https://${shop}.myshopify.com/admin/api/2026-10/graphql.json`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": store.token,
    },
    body: JSON.stringify({
      query: `
        query {
          shop {
            name
            myshopifyDomain
          }
        }
      `,
    }),
  });

  const data = await response.json();

  if (!response.ok || data.errors) {
    throw new Error(
      JSON.stringify(data.errors || data, null, 2)
    );
  }

  console.log(`\n${store.name}:`);
  console.log("Store name:", data.data.shop.name);
  console.log("Domain:", data.data.shop.myshopifyDomain);
}

async function main() {
  for (const store of stores) {
    try {
      await fetchShopify(store);
    } catch (error) {
      console.error(`\n${store.name} failed:`, error.message);
    }
  }
}

main();
