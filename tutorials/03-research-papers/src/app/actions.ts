"use server"
import path from "path"
import fs from "fs/promises"

const TABLE_NAME = "papers"
const DATA_DIR = path.resolve(process.cwd(), "../../data/papers")

interface PaperMeta {
  slug: string
  title: string
  authors: string
  year: number
  file: string
  arxiv_url: string
}

export async function initializeDataset(serverUrl: string, apiKey: string) {
  const base = serverUrl.replace(/\/$/, "")
  const authHeaders: Record<string, string> = apiKey ? { "X-API-Key": apiKey } : {}

  // Create table
  await fetch(`${base}/v1/tables`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders },
    body: JSON.stringify({ name: TABLE_NAME, description: "Seminal ML papers from ArXiv" }),
  }).catch(() => {})

  const manifest: PaperMeta[] = JSON.parse(
    await fs.readFile(path.join(DATA_DIR, "manifest.json"), "utf-8")
  )

  const jobIds: string[] = []

  for (const paper of manifest) {
    if (!paper.file?.endsWith(".pdf")) continue
    const pdfBuffer = await fs.readFile(path.join(DATA_DIR, paper.file))

    // Ingest as multipart file upload
    const formData = new FormData()
    formData.append("file", new Blob([pdfBuffer], { type: "application/pdf" }), paper.file)
    formData.append("title", paper.title)
    formData.append("tags", JSON.stringify(["machine-learning", "research-paper", "arxiv"]))
    formData.append("metadata", JSON.stringify({
      authors: paper.authors,
      year: paper.year,
      arxiv_url: paper.arxiv_url,
      slug: paper.slug,
    }))

    const res = await fetch(`${base}/v1/tables/${TABLE_NAME}/ingest/file`, {
      method: "POST",
      headers: authHeaders,
      body: formData,
    })

    if (res.ok) {
      const job = await res.json()
      if (job.job_id) jobIds.push(job.job_id)
    }
  }

  return { jobIds, count: manifest.length }
}
