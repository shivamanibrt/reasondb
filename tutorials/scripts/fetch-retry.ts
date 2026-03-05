/**
 * Re-runs only the fetchers that failed or had issues.
 * Safe to run multiple times — existing files are skipped.
 *
 *   npx tsx scripts/fetch-retry.ts
 */

import { fetchOpinions } from "./fetchers/courtlistener.js";
import { fetchWikiArticles } from "./fetchers/wikipedia.js";
import { fetchFinancials } from "./fetchers/sec-edgar.js";

async function main() {
  console.log("ReasonDB Tutorials — Retry Failed Fetchers");
  console.log("============================================");

  const start = Date.now();

  await fetchOpinions();
  await fetchWikiArticles();
  await fetchFinancials();

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n✅ Done in ${elapsed}s`);
}

main().catch((err) => {
  console.error("\n❌ Fatal error:", err);
  process.exit(1);
});
