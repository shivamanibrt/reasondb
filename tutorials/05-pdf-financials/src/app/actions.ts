"use server"
import path from "path"
import fs from "fs/promises"

const TABLE_NAME = "financials"
const DATA_DIR = path.resolve(process.cwd(), "../../data/financials")

interface FilingMeta {
  company: string
  slug: string
  year: number
  filing_type: string
  file: string
  cik: string
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
      description: "SEC EDGAR 10-K annual report filings — Apple, Tesla, Microsoft (FY2023)",
    }),
  }).catch(() => {})

  const manifest: FilingMeta[] = JSON.parse(
    await fs.readFile(path.join(DATA_DIR, "manifest.json"), "utf-8")
  )

  const jobIds: string[] = []

  for (const filing of manifest) {
    if (!filing.file) continue
    const content = await fs.readFile(path.join(DATA_DIR, filing.file), "utf-8")

    const res = await fetch(`${base}/v1/tables/${TABLE_NAME}/ingest/text`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        title: `${filing.company} ${filing.filing_type} FY${filing.year}`,
        content: content.slice(0, 80_000),
        tags: ["10-K", "sec-edgar", "annual-report", filing.company.toLowerCase().replace(/[^a-z]/g, "-")],
        metadata: {
          company: filing.company,
          year: filing.year,
          filing_type: filing.filing_type,
          cik: filing.cik,
          source_url: filing.url,
          slug: filing.slug,
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
