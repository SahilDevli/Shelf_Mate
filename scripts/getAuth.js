require("dotenv").config();

const fs = require("fs");
const path = require("path");

const stores = [
  {
    name: "UrbanThread",
    shop: process.env.SHOPIFY_URBANTHREAD_SHOP,
    clientId: process.env.SHOPIFY_URBANTHREAD_CLIENT_ID,
    clientSecret: process.env.SHOPIFY_URBANTHREAD_CLIENT_SECRET,
  },
  {
    name: "GlowLab",
    shop: process.env.SHOPIFY_GLOWLAB_SHOP,
    clientId: process.env.SHOPIFY_GLOWLAB_CLIENT_ID,
    clientSecret: process.env.SHOPIFY_GLOWLAB_CLIENT_SECRET,
  },
];

async function generateToken(store) {
  const { name, shop, clientId, clientSecret } = store;

  const missing = [];

  if (!shop) missing.push("SHOP");
  if (!clientId) missing.push("CLIENT_ID");
  if (!clientSecret) missing.push("CLIENT_SECRET");

  if (missing.length > 0) {
    throw new Error(
      `${name}: Missing environment variables: ${missing.join(", ")}`
    );
  }

  const normalizedShop = shop
    .replace(/^https?:\/\//, "")
    .replace(/\.myshopify\.com\/?$/, "")
    .replace(/\/$/, "");

  const tokenUrl = `https://${normalizedShop}.myshopify.com/admin/oauth/access_token`;

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
  });

  const responseText = await response.text();

  let result;

  try {
    result = JSON.parse(responseText);
  } catch {
    throw new Error(
      `${name}: Shopify returned non-JSON response.
HTTP Status: ${response.status}
Content-Type: ${response.headers.get("content-type")}
Response Preview: ${responseText.slice(0, 300)}`
    );
  }

  if (!response.ok) {
    throw new Error(
      `${name}: Shopify returned ${response.status}: ${
        result.error_description ||
        result.error ||
        result.errors ||
        "Unknown error"
      }`
    );
  }

  if (!result.access_token) {
    throw new Error(`${name}: Response did not contain an access token`);
  }

  console.log(`\n${name}: Token generated successfully`);
  console.log("Granted scopes:", result.scope || "Not provided");
  console.log("Expires in:", result.expires_in, "seconds");

  return {
    name,
    shop: `${normalizedShop}.myshopify.com`,
    accessToken: result.access_token,
    scopes: result.scope || "",
    expiresIn: result.expires_in,
    generatedAt: new Date().toISOString(),
    expiresAt: new Date(
      Date.now() + result.expires_in * 1000
    ).toISOString(),
  };
}

async function main() {
  const tokenData = [];
  const errors = [];

  for (const store of stores) {
    try {
      const token = await generateToken(store);
      tokenData.push(token);
    } catch (error) {
      console.error(`\n${store.name} failed:`, error.message);
      errors.push(store.name);
    }
  }

  const tokenFilePath = path.join(__dirname, "..", "token.txt");

  // Save successful tokens without discarding previous successful entries
  let existingTokens = [];

  if (fs.existsSync(tokenFilePath)) {
    try {
      existingTokens = JSON.parse(
        fs.readFileSync(tokenFilePath, "utf8")
      );
    } catch {
      console.warn("Existing token.txt is invalid. Replacing it.");
    }
  }

  const updatedTokens = [
    ...existingTokens.filter(
      (existing) =>
        !tokenData.some((current) => current.name === existing.name)
    ),
    ...tokenData,
  ];

  if (tokenData.length > 0) {
    fs.writeFileSync(
      tokenFilePath,
      JSON.stringify(updatedTokens, null, 2),
      { mode: 0o600 }
    );

    console.log(`\nTokens saved to: ${tokenFilePath}`);
  }

  if (errors.length > 0) {
    console.log("\nFailed stores:", errors.join(", "));
  }
}

main().catch((error) => {
  console.error("Unexpected error:", error.message);
  process.exitCode = 1;
});
