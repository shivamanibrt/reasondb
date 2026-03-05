"use server"
import path from "path"
import fs from "fs/promises"

const TABLE_NAME = "books"
const DATA_DIR = path.resolve(process.cwd(), "../data/books")

interface BookMeta {
  file: string
  title: string
  author: string
  source: string
  gutenberg_id: number
}

export async function initializeDataset(serverUrl: string, apiKey: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(apiKey ? { "X-API-Key": apiKey } : {}),
  }
  const base = serverUrl.replace(/\/$/, "")

  // Create table (ignore if exists)
  await fetch(`${base}/v1/tables`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: TABLE_NAME,
      description: "Classic novels from Project Gutenberg",
    }),
  }).catch(() => {})

  const manifest: BookMeta[] = JSON.parse(
    await fs.readFile(path.join(DATA_DIR, "manifest.json"), "utf-8")
  )

  const jobIds: string[] = []

  for (const book of manifest) {
    const raw = await fs.readFile(path.join(DATA_DIR, book.file), "utf-8")
    // Trim to first 80 000 chars — enough for rich querying, keeps ingestion fast
    const content = raw.slice(0, 80_000)

    const res = await fetch(`${base}/v1/tables/${TABLE_NAME}/ingest/text`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        title: book.title,
        content,
        tags: ["classic", "literature", "gutenberg"],
        metadata: { author: book.author, source: book.source, gutenberg_id: book.gutenberg_id },
      }),
    })

    if (res.ok) {
      const job = await res.json()
      if (job.job_id) jobIds.push(job.job_id)
    }
  }

  return { jobIds, count: manifest.length }
}
