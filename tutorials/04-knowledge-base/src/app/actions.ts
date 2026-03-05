"use server"
import path from "path"
import fs from "fs/promises"

const TABLE_NAME = "wiki"
const DATA_DIR = path.resolve(process.cwd(), "../data/wiki")

interface WikiMeta {
  slug: string
  title: string
  file: string
  url: string
  license: string
}

export async function initializeDataset(serverUrl: string, apiKey: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(apiKey ? { "X-API-Key": apiKey } : {}),
  }
  const base = serverUrl.replace(/\/$/, "")

  await fetch(`${base}/v1/tables`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name: TABLE_NAME, description: "Wikipedia ML articles knowledge base" }),
  }).catch(() => {})

  const manifest: WikiMeta[] = JSON.parse(
    await fs.readFile(path.join(DATA_DIR, "manifest.json"), "utf-8")
  )

  const jobIds: string[] = []

  for (const article of manifest) {
    if (!article.file) continue
    const content = await fs.readFile(path.join(DATA_DIR, article.file), "utf-8")

    const res = await fetch(`${base}/v1/tables/${TABLE_NAME}/ingest/text`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        title: article.title,
        content: content.slice(0, 80_000),
        tags: ["wikipedia", "machine-learning", article.slug],
        metadata: { slug: article.slug, source_url: article.url, license: article.license },
      }),
    })

    if (res.ok) {
      const job = await res.json()
      if (job.job_id) jobIds.push(job.job_id)
    }
  }

  return { jobIds, count: manifest.length }
}
