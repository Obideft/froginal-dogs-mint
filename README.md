# FROGINAL DOGS — Mint Terminal

FROGINAL DOGS mint portal and collection operations dashboard, using the FROGINALS orange, yellow and black visual identity.

## Current status

The first page is a front-end preview only. NFT cards, collection counters and recent activity are demo placeholders. No wallet connection or mint transaction is enabled.

## Planned modules

- Mint portal: wallet adapter connection and mint flow through a configured Solana Candy Machine.
- NFT gallery: browse assets and metadata using verified collection data.
- Transaction monitor: show indexed on-chain signatures, status, slot/time, asset mint and wallet.
- Admin view: configuration and operational health, protected server-side.
- Data layer: use a trusted Solana RPC/indexer; do not treat browser counters as authoritative.

## Safety notes

- Start on Solana devnet and use a test Candy Machine before mainnet.
- Never commit wallet secret keys, seed phrases, private RPC tokens or environment files.
- Do not enable real minting until the Candy Machine address, collection authority, asset standard, metadata URI and network are verified.
- Show a transaction as successful only after checking its on-chain confirmation status.
- Keep privileged Candy Machine/admin operations in a secured server or controlled operator environment.

## Run locally

Open index.html in a browser, or serve the folder with any static web server.

## Roadmap

1. Confirm Candy Machine / Metaplex Core configuration and devnet collection.
2. Add wallet-adapter connection UI.
3. Connect the mint button to the verified devnet mint flow.
4. Connect gallery to actual collection assets and metadata.
5. Add transaction indexing and status checks.
6. Add authentication for the admin dashboard, then perform testnet QA.
7. Review fees, metadata, authority and security before any mainnet launch.


## Connect the real on-chain NFT gallery

The gallery uses the Solana mainnet Metaplex DAS method `getAssetsByGroup` and this existing FROGINAL DOGS collection address:

`DEADY34TucemEebp6PJwmggAGDUmpSMoS4CcESKNBPRh`

### Deploy the API

This project uses a Vercel serverless function at `/api/collection`. A static GitHub Pages deployment cannot run that API function.

1. Import `Obideft/froginal-dogs-mint` into Vercel and deploy it.
2. In Vercel Project Settings → Environment Variables, add `SOLANA_RPC_URL`.
3. Set the value to a **Solana mainnet-beta RPC endpoint that supports the Metaplex DAS API** from your provider. Keep any API key in this server-side environment variable; never put it in browser JavaScript.
4. Redeploy, then visit `/api/collection?page=1&limit=12` on the deployed site. Confirm it returns real asset IDs, names and image URLs.
5. Open the site and check that gallery cards link to their actual Solscan asset pages.

The API returns 12 assets per page and caps page size at 30. It does not mint, transfer, or modify NFTs. If the provider does not index this collection, verify the collection address and asset grouping before proceeding.

### Current limitations

- The collection gallery is wired to real indexed asset data once `SOLANA_RPC_URL` is configured and the app is deployed to Vercel.
- GitHub Pages alone will not run `api/collection.js`.
- Transaction history, wallet connection, and minting are not yet implemented. The mint button remains a navigation link, not a live transaction action.
