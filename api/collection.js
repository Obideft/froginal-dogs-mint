const COLLECTION = "DEADY34TucemEebp6PJwmggAGDUmpSMoS4CcESKNBPRh";

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Use GET." });

  const rpcUrl = process.env.SOLANA_RPC_URL;
  if (!rpcUrl) {
    return res.status(503).json({
      error: "NFT data source is not configured yet.",
      setup: "Set SOLANA_RPC_URL in Vercel Project Settings > Environment Variables to a mainnet RPC endpoint with DAS API support."
    });
  }

  const page = Math.max(1, Math.min(100000, Number.parseInt(req.query.page || "1", 10) || 1));
  const limit = Math.max(1, Math.min(30, Number.parseInt(req.query.limit || "12", 10) || 12));
  try {
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "froginal-dogs-gallery",
        method: "getAssetsByGroup",
        params: {
          groupKey: "collection",
          groupValue: COLLECTION,
          page,
          limit,
          sortBy: { sortBy: "id", sortDirection: "asc" },
          options: { showCollectionMetadata: true, showUnverifiedCollections: true }
        }
      })
    });
    if (!response.ok) throw new Error("RPC provider returned HTTP " + response.status);
    const payload = await response.json();
    if (payload.error) throw new Error(payload.error.message || "DAS request failed");
    const result = payload.result || {};
    const items = (result.items || []).map((asset) => {
      const content = asset.content || {};
      const metadata = content.metadata || {};
      const files = content.files || [];
      const image = (content.links && (content.links.image || content.links.external_url)) ||
        (files.find((f) => f.mime && f.mime.startsWith("image/")) || {}).uri || "";
      const grouping = asset.grouping || [];
      const collection = grouping.find((g) => g.group_key === "collection");
      return {
        id: asset.id || "",
        name: metadata.name || content.name || "Froginal Dog",
        image,
        description: metadata.description || "",
        jsonUri: content.json_uri || "",
        owner: (asset.ownership && asset.ownership.owner) || "",
        collection: collection ? collection.group_value : COLLECTION,
        explorerUrl: "https://solscan.io/token/" + encodeURIComponent(asset.id || "")
      };
    });
    return res.status(200).json({
      collection: COLLECTION,
      network: "mainnet-beta",
      page,
      limit,
      total: result.total ?? null,
      items
    });
  } catch (error) {
    return res.status(502).json({
      error: "Could not load collection assets from the Solana DAS provider.",
      detail: error.message
    });
  }
};
