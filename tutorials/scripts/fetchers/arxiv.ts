import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve("data/papers");

const PAPERS = [
  {
    id: "1706.03762",
    slug: "attention-is-all-you-need",
    title: "Attention Is All You Need",
    authors: "Vaswani et al.",
    year: 2017,
  },
  {
    id: "1810.04805",
    slug: "bert",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    authors: "Devlin et al.",
    year: 2018,
  },
  {
    id: "2005.14165",
    slug: "gpt-3",
    title: "Language Models are Few-Shot Learners (GPT-3)",
    authors: "Brown et al.",
    year: 2020,
  },
];

async function downloadPdf(arxivId: string, outPath: string): Promise<number> {
  const url = `https://arxiv.org/pdf/${arxivId}`;
  console.log(`  Fetching: ${url}`);
  const res = await fetch(url, {
    headers: { "User-Agent": "ReasonDB-Tutorials/1.0 (educational use)" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(outPath, Buffer.from(buffer));
  return buffer.byteLength;
}

export async function fetchPapers() {
  console.log("\n📄 ArXiv — Seminal ML Papers (PDF)");
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const manifest: object[] = [];

  for (const paper of PAPERS) {
    const outPath = path.join(OUT_DIR, `${paper.slug}.pdf`);
    const metaPath = path.join(OUT_DIR, `${paper.slug}.meta.json`);

    if (fs.existsSync(outPath)) {
      const size = fs.statSync(outPath).size;
      console.log(`  ✓ ${paper.slug}.pdf already exists (${(size / 1024 / 1024).toFixed(1)} MB) — skipping`);
      manifest.push({ ...paper, file: `${paper.slug}.pdf` });
      continue;
    }

    try {
      const bytes = await downloadPdf(paper.id, outPath);
      const meta = {
        ...paper,
        file: `${paper.slug}.pdf`,
        arxiv_url: `https://arxiv.org/abs/${paper.id}`,
        source: "ArXiv",
      };
      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), "utf-8");
      console.log(`  ✓ Saved ${paper.slug}.pdf (${(bytes / 1024 / 1024).toFixed(1)} MB)`);
      manifest.push(meta);
    } catch (err) {
      console.error(`  ✗ Failed to fetch ${paper.slug}: ${err}`);
    }
  }

  fs.writeFileSync(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf-8"
  );
  console.log("  ✓ Written manifest.json");
}
