import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve("data/books");

const BOOKS = [
  { id: 1342, title: "pride-and-prejudice", author: "Jane Austen" },
  { id: 2701, title: "moby-dick", author: "Herman Melville" },
  { id: 84, title: "frankenstein", author: "Mary Shelley" },
  { id: 345, title: "dracula", author: "Bram Stoker" },
  { id: 1661, title: "sherlock-holmes", author: "Arthur Conan Doyle" },
];

async function fetchBook(id: number, title: string): Promise<string> {
  const url = `https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`;
  console.log(`  Fetching: ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

export async function fetchBooks() {
  console.log("\n📚 Project Gutenberg — Classic Books");
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const book of BOOKS) {
    const outPath = path.join(OUT_DIR, `${book.title}.txt`);
    if (fs.existsSync(outPath)) {
      const size = fs.statSync(outPath).size;
      console.log(`  ✓ ${book.title}.txt already exists (${(size / 1024).toFixed(0)} KB) — skipping`);
      continue;
    }
    try {
      const text = await fetchBook(book.id, book.title);
      fs.writeFileSync(outPath, text, "utf-8");
      const size = fs.statSync(outPath).size;
      console.log(`  ✓ Saved ${book.title}.txt (${(size / 1024).toFixed(0)} KB)`);
    } catch (err) {
      console.error(`  ✗ Failed to fetch ${book.title}: ${err}`);
    }
  }

  // Write metadata manifest
  const manifest = BOOKS.map((b) => ({
    file: `${b.title}.txt`,
    title: b.title.replace(/-/g, " "),
    author: b.author,
    source: "Project Gutenberg",
    gutenberg_id: b.id,
  }));
  fs.writeFileSync(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf-8"
  );
  console.log("  ✓ Written manifest.json");
}
