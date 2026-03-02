import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve("data/wiki");

const ARTICLES = [
  { title: "Machine learning", slug: "machine-learning" },
  { title: "Artificial neural network", slug: "neural-network" },
  { title: "Natural language processing", slug: "nlp" },
  { title: "Transformer (deep learning architecture)", slug: "transformer" },
  { title: "Large language model", slug: "llm" },
];

// Minimum acceptable file size — below this, the article is likely a stub
const MIN_BYTES = 10_000;

interface WikiQueryResponse {
  query: {
    pages: Record<
      string,
      {
        pageid: number;
        title: string;
        extract: string;
        missing?: string;
      }
    >;
  };
}

async function fetchArticleExtract(title: string): Promise<{ title: string; pageid: number; text: string }> {
  const url =
    `https://en.wikipedia.org/w/api.php?` +
    new URLSearchParams({
      action: "query",
      titles: title,
      prop: "extracts",
      explaintext: "1",     // plain text, no HTML
      exsectionformat: "plain",
      redirects: "1",       // follow redirects
      format: "json",
      origin: "*",
    }).toString();

  const res = await fetch(url, {
    headers: { "User-Agent": "ReasonDB-Tutorials/1.0 (educational use)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const data = (await res.json()) as WikiQueryResponse;

  const pages = data.query.pages;
  const page = Object.values(pages)[0];
  if (!page || page.missing !== undefined) {
    throw new Error(`Page not found: "${title}"`);
  }
  return { title: page.title, pageid: page.pageid, text: page.extract };
}

export async function fetchWikiArticles() {
  console.log("\n🌐 Wikipedia — ML Topic Articles");
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const manifest: object[] = [];

  for (const article of ARTICLES) {
    const outPath = path.join(OUT_DIR, `${article.slug}.txt`);
    const metaPath = path.join(OUT_DIR, `${article.slug}.meta.json`);

    if (fs.existsSync(outPath)) {
      const size = fs.statSync(outPath).size;
      if (size >= MIN_BYTES) {
        console.log(`  ✓ ${article.slug}.txt already exists (${(size / 1024).toFixed(0)} KB) — skipping`);
        manifest.push({ slug: article.slug, title: article.title });
        continue;
      }
      fs.unlinkSync(outPath);
      console.log(`  ↻ ${article.slug}.txt too small (${size} bytes) — re-fetching`);
    }
    if (fs.existsSync(metaPath)) fs.unlinkSync(metaPath);

    try {
      console.log(`  Fetching: "${article.title}"`);
      const { title: resolvedTitle, pageid, text } = await fetchArticleExtract(article.title);

      if (text.length < 1000) {
        console.warn(`  ⚠ Very short extract (${text.length} chars) for "${resolvedTitle}" — may be a stub`);
      }

      fs.writeFileSync(outPath, text, "utf-8");

      const meta = {
        slug: article.slug,
        title: resolvedTitle,
        pageid,
        file: `${article.slug}.txt`,
        source: "Wikipedia",
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(resolvedTitle.replace(/ /g, "_"))}`,
        license: "CC BY-SA 4.0",
      };
      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), "utf-8");

      const size = fs.statSync(outPath).size;
      console.log(`  ✓ Saved ${article.slug}.txt (${(size / 1024).toFixed(0)} KB) — "${resolvedTitle}"`);
      manifest.push(meta);
    } catch (err) {
      console.error(`  ✗ Failed to fetch "${article.title}": ${err}`);
    }
  }

  fs.writeFileSync(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf-8"
  );
  console.log("  ✓ Written manifest.json");
}
