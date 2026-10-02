/* ===== CONFIG: fill this in on launch day ===== */
const CONFIG = {
  mintPrice: 0.5,    // SOL, same for everyone: a random draw
  mintUrl: "",       // your mint page; when set, "Draw" sends people there to mint for real
  mintDate: "",      // e.g. "2026-11-08T18:00:00-06:00" shows a countdown on luck.html
  marketUrl: "",     // secondary market (Magic Eden / Tensor collection page)
  subscribeUrl: "",  // form endpoint that accepts a POST with {email} (e.g. https://formspree.io/f/xxxx)
  collection: "",   // collection address (after the mint) so profiles can list each holder's cards
  rpc: "",          // optional Solana RPC (Helius/QuickNode) for wallet balances; empty = public mainnet RPC
  x: "", telegram: ""
};
