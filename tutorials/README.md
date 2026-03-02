# ReasonDB Tutorials

Interactive, standalone tutorial apps for ReasonDB use cases. Each tutorial is a self-contained Next.js app with real-world data and a live RQL query playground.

## Prerequisites

- ReasonDB server running at `http://localhost:4444`
- Node.js 20+
- An LLM API key configured in ReasonDB (for `REASON` queries)

## Phase 1 — Fetch Data

Download all real-world datasets before running any tutorial app:

```bash
cd tutorials/
npm install
npm run fetch-all
```

This will populate `tutorials/data/` (gitignored):

| Folder | Source | Contents |
|---|---|---|
| `data/books/` | Project Gutenberg | 5 classic novels as `.txt` |
| `data/opinions/` | CourtListener API | 5 SCOTUS opinions as `.txt` |
| `data/papers/` | ArXiv | 3 ML paper PDFs |
| `data/wiki/` | Wikipedia API | 5 ML topic articles as `.txt` |
| `data/financials/` | SEC EDGAR | 3 annual report 10-K filings as `.txt` |

## Phase 2 — Run a Tutorial

```bash
cd tutorials/01-rql-basics/
npm install
npm run dev
# Open http://localhost:3000
```

## Tutorials

| # | Folder | Use Case | Data Source |
|---|---|---|---|
| 1 | `01-rql-basics/` | RQL Query Language Basics | Project Gutenberg books |
| 2 | `02-legal-search/` | Legal Document Search | CourtListener SCOTUS opinions |
| 3 | `03-research-papers/` | Research Paper Analysis | ArXiv ML papers (PDF) |
| 4 | `04-knowledge-base/` | Knowledge Base Q&A | Wikipedia ML articles |
| 5 | `05-pdf-financials/` | PDF Financial Analysis | SEC EDGAR 10-K filings |
