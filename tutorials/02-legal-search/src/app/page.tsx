"use client"
import { useState, useEffect } from "react"
import { Scale, ChevronRight, Search, Brain, Layers } from "lucide-react"
import { ConnectionBar } from "@/components/ConnectionBar"
import { DataSetupPanel } from "@/components/DataSetupPanel"
import { QueryPlayground, type ExampleQuery } from "@/components/QueryPlayground"
import { ResultsDisplay } from "@/components/ResultsDisplay"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { initializeDataset } from "./actions"
import type { QueryResult } from "@/lib/api"

const EXAMPLES: ExampleQuery[] = [
  // Search
  { label: "SELECT all",        badge: "SQL",    query: "SELECT * FROM regulations LIMIT 5" },
  { label: "By topic",          badge: "SQL",    query: "SELECT title, metadata.topic, metadata.publication_date FROM regulations WHERE metadata.topic = 'ai_policy'" },
  { label: "SEARCH AI bias",    badge: "BM25",   query: "SELECT * FROM regulations SEARCH 'artificial intelligence bias discrimination fairness'" },
  { label: "SEARCH copyright",  badge: "BM25",   query: "SELECT * FROM regulations SEARCH 'generative AI copyright intellectual property'" },
  { label: "COUNT by topic",    badge: "AGG",    query: "SELECT COUNT(*) FROM regulations GROUP BY metadata.topic" },
  // Reason
  { label: "REASON liability",        badge: "REASON", query: "SELECT * FROM regulations REASON 'What are the key AI safety and liability requirements mentioned across these regulations?'" },
  { label: "REASON compliance",       badge: "REASON", query: "SELECT * FROM regulations REASON 'What steps must organizations take to comply with AI regulations?'" },
  { label: "REASON bias & fairness",  badge: "REASON", query: "SELECT * FROM regulations REASON 'How do these regulations address algorithmic bias and require fairness in AI decision-making systems?'" },
  { label: "REASON high-risk AI",     badge: "REASON", query: "SELECT * FROM regulations REASON 'How do these regulations define high-risk AI applications and what special obligations apply to them?'" },
  { label: "REASON individual rights",badge: "REASON", query: "SELECT * FROM regulations REASON 'What rights do individuals have when subject to automated AI decision-making under these regulations?'" },
  // Combo
  { label: "COMBO — AI policy + enforcement", badge: "COMBO", query: "SELECT * FROM regulations WHERE metadata.topic = 'ai_policy' REASON 'Within these AI policy documents specifically, what enforcement mechanisms and penalties are proposed for non-compliance?'" },
  { label: "COMBO — liability passages",      badge: "COMBO", query: "SELECT * FROM regulations SEARCH 'liability accountability transparency disclosure' REASON 'From passages specifically about liability and transparency, what concrete obligations are placed on AI developers and deployers?'" },
  { label: "COMBO — safety + ADS",            badge: "COMBO", query: "SELECT * FROM regulations SEARCH 'safety autonomous vehicle automated driving' REASON 'Based on these safety-related passages, what are the specific technical and operational requirements for autonomous systems?'" },
]

type StepGroup = "search" | "reason" | "combo"

interface Step {
  num: number
  title: string
  badge: string
  desc: string
  exIdx: number
  group: StepGroup
}

const STEPS: Step[] = [
  // Search
  { num: 1,  title: "Browse Documents",      badge: "SQL",    desc: "List all AI/ML regulatory documents from the Federal Register.",                                         exIdx: 0,  group: "search" },
  { num: 2,  title: "Filter by Topic",       badge: "SQL",    desc: "Filter regulations by topic — ai_policy, ai_ethics, ai_safety, ai_copyright.",                           exIdx: 1,  group: "search" },
  { num: 3,  title: "SEARCH Keywords",       badge: "BM25",   desc: "Full-text BM25 search across regulation text for specific legal terms.",                                  exIdx: 2,  group: "search" },
  { num: 4,  title: "Aggregate by Topic",    badge: "AGG",    desc: "Count documents grouped by regulatory topic.",                                                             exIdx: 4,  group: "search" },
  // Reason
  { num: 5,  title: "REASON — Legal Q&A",       badge: "REASON", desc: "Ask a legal question. ReasonDB synthesizes answers across all documents.",                           exIdx: 5,  group: "reason" },
  { num: 6,  title: "REASON — Compliance",      badge: "REASON", desc: "Ask about compliance requirements across all regulations at once.",                                   exIdx: 6,  group: "reason" },
  { num: 7,  title: "REASON — Bias & Fairness", badge: "REASON", desc: "Explore how regulations address algorithmic bias and mandate fairness in AI systems.",               exIdx: 7,  group: "reason" },
  { num: 8,  title: "REASON — High-Risk AI",    badge: "REASON", desc: "Understand how high-risk AI applications are defined and what special obligations apply.",           exIdx: 8,  group: "reason" },
  { num: 9,  title: "REASON — Individual Rights",badge: "REASON",desc: "Discover what rights individuals hold when subject to automated AI decision-making.",                exIdx: 9,  group: "reason" },
  // Combo
  { num: 10, title: "COMBO — Policy + Enforcement", badge: "COMBO", desc: "Filter to ai_policy docs, then reason about specific enforcement mechanisms.",                   exIdx: 10, group: "combo" },
  { num: 11, title: "COMBO — Liability Passages",   badge: "COMBO", desc: "BM25-search for liability clauses, then reason about obligations on developers.",                 exIdx: 11, group: "combo" },
  { num: 12, title: "COMBO — ADS Safety",           badge: "COMBO", desc: "Search autonomous-vehicle safety passages, then reason about technical requirements.",            exIdx: 12, group: "combo" },
]

const BADGE_COLORS: Record<string, string> = {
  SQL:    "bg-slate-100 text-slate-700",
  BM25:   "bg-amber-100 text-amber-800",
  REASON: "bg-purple-100 text-purple-800",
  AGG:    "bg-blue-100 text-blue-800",
  COMBO:  "bg-rose-100 text-rose-800",
}

const GROUP_META: Record<StepGroup, { label: string; icon: React.ReactNode; color: string }> = {
  search: { label: "Search",      icon: <Search className="h-3 w-3" />, color: "text-slate-500" },
  reason: { label: "Reason",      icon: <Brain className="h-3 w-3" />,  color: "text-purple-600" },
  combo:  { label: "Combination", icon: <Layers className="h-3 w-3" />, color: "text-rose-600" },
}

export default function Page() {
  const [serverUrl, setServerUrl] = useState("http://localhost:4444")
  const [apiKey, setApiKey] = useState("")
  const [isDataReady, setIsDataReady] = useState(false)
  const [result, setResult] = useState<QueryResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [playgroundIdx, setPlaygroundIdx] = useState(0)

  useEffect(() => {
    const url = localStorage.getItem("reasondb_server_url")
    const key = localStorage.getItem("reasondb_api_key")
    if (url) setServerUrl(url)
    if (key) setApiKey(key)
  }, [])

  const handleUrlChange = (url: string) => { setServerUrl(url); localStorage.setItem("reasondb_server_url", url) }
  const handleKeyChange = (key: string) => { setApiKey(key); localStorage.setItem("reasondb_api_key", key) }

  const groups: StepGroup[] = ["search", "reason", "combo"]

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <ConnectionBar serverUrl={serverUrl} apiKey={apiKey} onServerUrlChange={handleUrlChange} onApiKeyChange={handleKeyChange} />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 shrink-0 border-r flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-gradient-to-br from-amber-50 to-orange-50">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-md bg-amber-600"><Scale className="h-4 w-4 text-white" /></div>
              <div>
                <h1 className="text-sm font-bold">Legal Document Search</h1>
                <p className="text-[11px] text-muted-foreground">Tutorial 02 · Intermediate · 45 min</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Search AI/ML regulatory documents from the US Federal Register using BM25 and LLM reasoning.</p>
          </div>
          <div className="p-3 border-b">
            <DataSetupPanel
              tableName="regulations" docCount={5} serverUrl={serverUrl} apiKey={apiKey}
              label="Federal Register Dataset"
              description="5 AI/ML regulatory documents — Executive Orders, FTC guidance, copyright rules, and autonomous vehicle regulations."
              onInitialize={initializeDataset} onReady={() => setIsDataReady(true)}
            />
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {groups.map((group) => {
              const meta = GROUP_META[group]
              const groupSteps = STEPS.filter((s) => s.group === group)
              return (
                <div key={group}>
                  <div className={`flex items-center gap-1.5 px-1 mb-1.5 ${meta.color}`}>
                    {meta.icon}
                    <p className="text-[11px] font-semibold uppercase tracking-wide">{meta.label}</p>
                  </div>
                  <div className="space-y-1.5">
                    {groupSteps.map((step) => (
                      <div key={step.num}
                        className={`rounded-md border p-3 space-y-1.5 cursor-pointer transition-colors ${activeStep === step.num ? "border-amber-200 bg-amber-50" : "hover:bg-muted/40"}`}
                        onClick={() => { setActiveStep(step.num); setPlaygroundIdx(step.exIdx); setResult(null); setError(null) }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0">{step.num}</span>
                          <span className="text-xs font-medium flex-1">{step.title}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${BADGE_COLORS[step.badge]}`}>{step.badge}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground pl-7">{step.desc}</p>
                        <div className="pl-7">
                          <button className="flex items-center gap-1 text-[11px] text-amber-700 hover:text-amber-900 font-medium">Try it <ChevronRight className="h-3 w-3" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-sm font-semibold">Query Playground</h2>
              <Badge variant="outline" className="text-xs">regulations</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Search Federal Register AI regulations with RQL.</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <QueryPlayground serverUrl={serverUrl} apiKey={apiKey} examples={EXAMPLES} onResult={setResult} onError={setError} isDataReady={isDataReady} selectedIdx={playgroundIdx} />
            <Separator />
            <div><h3 className="text-sm font-semibold mb-3">Results</h3><ResultsDisplay result={result} error={error} /></div>
          </div>
        </div>
      </div>
    </div>
  )
}
