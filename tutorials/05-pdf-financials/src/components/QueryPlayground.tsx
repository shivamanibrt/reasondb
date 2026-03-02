"use client"
import { useState } from "react"
import { Play, Trash2, Loader2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ReasonDBClient, type QueryResult } from "@/lib/api"

export interface ExampleQuery {
  label: string
  query: string
  badge?: "BM25" | "LLM" | "AGG" | "SQL"
}

interface Props {
  serverUrl: string
  apiKey: string
  examples: ExampleQuery[]
  onResult: (result: QueryResult | null) => void
  onError: (err: string | null) => void
  isDataReady: boolean
  accentColor?: string
}

const BADGE_STYLES: Record<string, string> = {
  BM25: "bg-amber-100 text-amber-800 border-amber-200",
  LLM: "bg-purple-100 text-purple-800 border-purple-200",
  AGG: "bg-blue-100 text-blue-800 border-blue-200",
  SQL: "bg-slate-100 text-slate-700 border-slate-200",
}

export function QueryPlayground({ serverUrl, apiKey, examples, onResult, onError, isDataReady }: Props) {
  const [query, setQuery] = useState(examples[0]?.query ?? "")
  const [running, setRunning] = useState(false)
  const [progressMsg, setProgressMsg] = useState("")
  const [activeIdx, setActiveIdx] = useState(0)

  const isReason = query.toUpperCase().includes("REASON")

  const run = async () => {
    if (!query.trim() || !serverUrl) return
    setRunning(true)
    setProgressMsg("")
    onResult(null)
    onError(null)
    try {
      const client = new ReasonDBClient(serverUrl, apiKey || undefined)
      let result
      if (isReason) {
        result = await client.executeQueryStream(query, (msg) => setProgressMsg(msg))
      } else {
        result = await client.executeQuery(query)
      }
      onResult(result)
    } catch (e) {
      onError(e instanceof Error ? e.message : "Query failed")
    } finally {
      setRunning(false)
      setProgressMsg("")
    }
  }

  const selectExample = (idx: number) => {
    setActiveIdx(idx)
    setQuery(examples[idx].query)
    onResult(null)
    onError(null)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {examples.map((ex, i) => (
          <button
            key={i}
            onClick={() => selectExample(i)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
              i === activeIdx
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background text-foreground border-border hover:bg-accent"
            }`}
          >
            {ex.label}
            {ex.badge && (
              <span className={`text-[10px] px-1 rounded border ${BADGE_STYLES[ex.badge] ?? ""}`}>
                {ex.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <Textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="font-mono text-sm resize-none h-32 bg-slate-950 text-slate-50 border-slate-800 focus-visible:ring-slate-600"
        placeholder="Enter RQL query…"
        spellCheck={false}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") run()
        }}
      />

      <div className="flex items-center gap-2">
        <Button onClick={run} disabled={running || !isDataReady} className="gap-2">
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          {running ? "Running…" : isReason ? "Run with LLM" : "Run Query"}
        </Button>
        <Button variant="outline" size="icon" onClick={() => { setQuery(""); onResult(null); onError(null) }}>
          <Trash2 className="h-4 w-4" />
        </Button>
        {isReason && !running && (
          <Badge variant="outline" className="gap-1 text-purple-700 border-purple-200 bg-purple-50">
            <Zap className="h-3 w-3" /> LLM Query — may take 5–30s
          </Badge>
        )}
        {!isDataReady && (
          <span className="text-xs text-muted-foreground">Load dataset first</span>
        )}
      </div>

      {running && progressMsg && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
          <Loader2 className="h-3 w-3 animate-spin" />
          {progressMsg}
        </div>
      )}

      <p className="text-[11px] text-muted-foreground">
        Tip: Press <kbd className="px-1 py-0.5 rounded border text-[10px] bg-muted">⌘ Enter</kbd> to run
      </p>
    </div>
  )
}
