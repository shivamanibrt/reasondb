import fs from "fs";
import path from "path";
import https from "https";

const OUT_DIR = path.resolve("data/opinions");
const FR_BASE = "https://www.federalregister.gov/api/v1";

// AI/ML regulatory documents from the Federal Register
const DOCUMENT_QUERIES = [
  { term: "artificial+intelligence+executive+order", slug: "ai-executive-order", topic: "ai_policy" },
  { term: "machine+learning+bias+discrimination", slug: "ml-bias-regulation", topic: "ai_ethics" },
  { term: "algorithmic+accountability+transparency", slug: "algorithmic-accountability", topic: "ai_transparency" },
  { term: "generative+AI+copyright", slug: "generative-ai-copyright", topic: "ai_copyright" },
  { term: "autonomous+vehicles+safety+regulation", slug: "autonomous-vehicles", topic: "ai_safety" },
];

interface FRDocument {
  document_number: string;
  title: string;
  abstract: string;
  html_url: string;
  body_html_url: string | null;
  publication_date: string;
  type: string;
}

interface FRListResponse {
  results: FRDocument[];
  count: number;
}

// Use https.get to avoid Node.js fetch re-encoding %5B/%5D
function httpsGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { headers: { "User-Agent": "ReasonDB-Tutorials/1.0 (educational use)", Accept: "application/json" } },
      (res) => {
        // Follow redirects
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          httpsGet(res.headers.location).then(resolve, reject);
          return;
        }
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
        res.on("error", reject);
      }
    );
    req.on("error", reject);
  });
}

async function fetchDocumentList(encodedTerm: string): Promise<FRDocument[]> {
  const fields = ["document_number", "title", "abstract", "html_url", "publication_date", "type", "body_html_url"]
    .map((f) => `fields%5B%5D=${f}`)
    .join("&");
  const url = `${FR_BASE}/documents.json?conditions%5Bterm%5D=${encodedTerm}&per_page=3&order=relevance&${fields}`;
  const body = await httpsGet(url);
  const data = JSON.parse(body) as FRListResponse;
  return data.results ?? [];
}

async function fetchBodyText(bodyHtmlUrl: string): Promise<string> {
  const html = await httpsGet(bodyHtmlUrl);
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s{3,}/g, "\n\n")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#\d+;/g, " ")
    .trim();
}

function formatDocument(doc: FRDocument, fullText: string): string {
  return [
    `TITLE: ${doc.title}`,
    `Document Number: ${doc.document_number}`,
    `Type: ${doc.type}`,
    `Publication Date: ${doc.publication_date}`,
    `URL: ${doc.html_url}`,
    `Source: Federal Register`,
    "",
    "ABSTRACT:",
    doc.abstract ?? "",
    "",
    fullText ? "FULL TEXT:" : "",
    fullText,
  ]
    .filter((l) => l !== undefined)
    .join("\n");
}

export async function fetchOpinions() {
  console.log("\n📜 Federal Register — AI/ML Regulatory Documents");
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const manifest: object[] = [];

  for (const query of DOCUMENT_QUERIES) {
    const outPath = path.join(OUT_DIR, `${query.slug}.txt`);
    const metaPath = path.join(OUT_DIR, `${query.slug}.meta.json`);

    if (fs.existsSync(outPath)) {
      const size = fs.statSync(outPath).size;
      console.log(`  ✓ ${query.slug}.txt already exists (${(size / 1024).toFixed(0)} KB) — skipping`);
      manifest.push({ slug: query.slug, topic: query.topic });
      continue;
    }

    try {
      console.log(`  Searching: "${query.term.replace(/\+/g, " ")}"`);
      const docs = await fetchDocumentList(query.term);

      if (docs.length === 0) {
        console.warn(`  ⚠ No results for: "${query.term}"`);
        continue;
      }

      const doc = docs[0];
      console.log(`    Found: ${doc.title} (${doc.publication_date})`);

      let fullText = "";
      if (doc.body_html_url) {
        try {
          fullText = await fetchBodyText(doc.body_html_url);
        } catch {
          // full text is optional
        }
      }

      const content = formatDocument(doc, fullText);
      fs.writeFileSync(outPath, content, "utf-8");

      const meta = {
        slug: query.slug,
        document_number: doc.document_number,
        title: doc.title,
        type: doc.type,
        publication_date: doc.publication_date,
        topic: query.topic,
        file: `${query.slug}.txt`,
        source: "Federal Register (federalregister.gov)",
        url: doc.html_url,
        license: "Public Domain (US Government)",
      };
      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), "utf-8");

      const size = fs.statSync(outPath).size;
      console.log(`  ✓ Saved ${query.slug}.txt (${(size / 1024).toFixed(0)} KB)`);
      manifest.push(meta);

      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.error(`  ✗ Failed for "${query.term}": ${err}`);
    }
  }

  fs.writeFileSync(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf-8"
  );
  console.log("  ✓ Written manifest.json");
}
