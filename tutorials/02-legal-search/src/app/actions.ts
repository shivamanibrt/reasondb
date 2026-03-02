"use server"
import path from "path"
import fs from "fs/promises"

const TABLE_NAME = "regulations"
const DATA_DIR = path.resolve(process.cwd(), "../../data/opinions")

interface DocMeta {
  slug: string
  title: string
  type: string
  publication_date: string
  topic: string
  file: string
  url: string
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
    body: JSON.stringify({
      name: TABLE_NAME,
      description: "AI/ML regulatory documents from the US Federal Register",
    }),
  }).catch(() => {})

  const manifest: DocMeta[] = JSON.parse(
    await fs.readFile(path.join(DATA_DIR, "manifest.json"), "utf-8")
  )

  const jobIds: string[] = []

  for (const doc of manifest) {
    if (!doc.file) continue
    const content = await fs.readFile(path.join(DATA_DIR, doc.file), "utf-8")

    const res = await fetch(`${base}/v1/tables/${TABLE_NAME}/ingest/text`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        title: doc.title,
        content: content.slice(0, 80_000),
        tags: ["regulation", "federal-register", doc.topic],
        metadata: {
          type: doc.type,
          publication_date: doc.publication_date,
          topic: doc.topic,
          source_url: doc.url,
          slug: doc.slug,
        },
      }),
    })

    if (res.ok) {
      const job = await res.json()
      if (job.job_id) jobIds.push(job.job_id)
    }
  }

  return { jobIds, count: manifest.length }
}
