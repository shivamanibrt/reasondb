import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve("data/financials");

// SEC EDGAR CIK numbers and known 10-K filing accession numbers (2023 fiscal year)
const FILINGS = [
  {
    company: "Apple Inc.",
    slug: "apple-2023-10k",
    cik: "0000320193",
    accession: "0000320193-23-000106",
    primaryDoc: "aapl-20230930.htm",
    year: 2023,
  },
  {
    company: "Tesla, Inc.",
    slug: "tesla-2023-10k",
    cik: "0001318605",
    // Correct accession for FY2023 10-K filed 2024-01-29
    accession: "0001628280-24-002390",
    primaryDoc: "tsla-20231231.htm",
    year: 2023,
  },
  {
    company: "Microsoft Corporation",
    slug: "microsoft-2023-10k",
    cik: "0000789019",
    // Correct accession for FY2023 10-K filed 2023-07-27
    accession: "0000950170-23-035122",
    primaryDoc: "msft-20230630.htm",
    year: 2023,
  },
];

function accessionToPath(accession: string): string {
  // "0000320193-23-000106" → "000032019323000106"
  return accession.replace(/-/g, "");
}

async function fetchFilingIndex(cik: string, accession: string): Promise<string> {
  const accPath = accessionToPath(accession);
  const url = `https://www.sec.gov/Archives/edgar/data/${parseInt(cik)}//${accPath}/index.json`;
  console.log(`  Fetching filing index: ${url}`);
  const res = await fetch(url, {
    headers: { "User-Agent": "ReasonDB Tutorials research@reasondb.ai" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchHtmAsText(cik: string, accession: string, docName: string): Promise<string> {
  const accPath = accessionToPath(accession);
  // Use numeric CIK (strip leading zeros) with single slash
  const numericCik = parseInt(cik, 10);
  const url = `https://www.sec.gov/Archives/edgar/data/${numericCik}/${accPath}/${docName}`;
  console.log(`  Fetching document: ${url}`);
  const res = await fetch(url, {
    headers: { "User-Agent": "ReasonDB Tutorials research@reasondb.ai" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const html = await res.text();
  // Strip HTML tags for plain text storage
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s{3,}/g, "\n\n")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#\d+;/g, " ")
    .trim();
}

export async function fetchFinancials() {
  console.log("\n💰 SEC EDGAR — Annual Reports (10-K)");
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const manifest: object[] = [];

  for (const filing of FILINGS) {
    const outPath = path.join(OUT_DIR, `${filing.slug}.txt`);
    const metaPath = path.join(OUT_DIR, `${filing.slug}.meta.json`);

    if (fs.existsSync(outPath)) {
      const size = fs.statSync(outPath).size;
      console.log(
        `  ✓ ${filing.slug}.txt already exists (${(size / 1024 / 1024).toFixed(1)} MB) — skipping`
      );
      manifest.push({ ...filing, file: `${filing.slug}.txt` });
      continue;
    }

    try {
      // SEC EDGAR rate-limits to ~10 requests/second; add a delay between filings
      await sleep(1500);
      const text = await fetchHtmAsText(filing.cik, filing.accession, filing.primaryDoc);
      fs.writeFileSync(outPath, text, "utf-8");

      const meta = {
        company: filing.company,
        slug: filing.slug,
        year: filing.year,
        filing_type: "10-K",
        file: `${filing.slug}.txt`,
        cik: filing.cik,
        accession: filing.accession,
        source: "SEC EDGAR",
        url: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${filing.cik}&type=10-K`,
        license: "Public Domain (US Government)",
      };
      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), "utf-8");

      const size = fs.statSync(outPath).size;
      console.log(`  ✓ Saved ${filing.slug}.txt (${(size / 1024 / 1024).toFixed(1)} MB) — ${filing.company}`);
      manifest.push(meta);
    } catch (err) {
      console.error(`  ✗ Failed to fetch ${filing.company}: ${err}`);
    }
  }

  fs.writeFileSync(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf-8"
  );
  console.log("  ✓ Written manifest.json");
}
