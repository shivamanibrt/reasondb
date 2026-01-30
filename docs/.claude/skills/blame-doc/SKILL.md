---
name: blame-doc
description: Analyze documentation for duplicates, outdated content, and discrepancies with codebase
---

## Instructions

Perform a deep analysis of documentation quality, finding issues that need attention.

### Step 0: Read Context

**Read `.devdoc/context.json` if it exists** for product info and terminology.

**Read `docs.json`** to understand documentation structure.

### Step 1: Scan Codebase

Analyze the source code to understand:
- Exported functions, classes, types
- API endpoints and routes
- Configuration options
- Feature flags and capabilities

### Step 2: Analyze Documentation

Scan all MDX files for:
- Topics covered
- Code examples used
- Features documented
- API references

### Step 3: Generate Blame Report

```
Documentation Blame Report
==========================

Generated: [date]
Files analyzed: X docs, Y source files

## 🔴 Critical Issues

### Duplicate Content (count)

Content that appears in multiple places, causing maintenance burden:

| Topic | Files | Recommendation |
|-------|-------|----------------|
| Authentication setup | auth.mdx, quickstart.mdx, api/overview.mdx | Consolidate to auth.mdx, link from others |
| Error handling | errors.mdx, troubleshooting.mdx | Merge into single page |

**Details:**
- `auth.mdx:15-45` and `quickstart.mdx:80-110` contain nearly identical OAuth setup instructions
- `errors.mdx` and `troubleshooting.mdx` both list the same error codes

### Outdated Documentation (count)

Docs that don't match current codebase:

| File | Issue | Current State |
|------|-------|---------------|
| api/users.mdx | Wrong signature | `getUser(id)` is now `getUser(id, options)` |
| config.mdx | Missing options | `timeout` and `retries` not documented |
| quickstart.mdx | Old version | References v1.x, current is v2.x |

**Details:**
- `api/users.mdx:23` shows `getUser(id: string)` but code has `getUser(id: string, options?: UserOptions)`
- `config.mdx` missing 3 new configuration options added in v2.0

### Code-Doc Discrepancies (count)

Mismatches between documented and actual behavior:

| File | Documented | Actual |
|------|------------|--------|
| api/auth.mdx | Returns `{ token }` | Returns `{ token, expiresAt }` |
| guides/setup.mdx | Requires Node 14+ | package.json requires Node 18+ |
| api/errors.mdx | Error code 401 | Code throws 403 for this case |

## 🟡 Warnings

### Undocumented Features (count)

Code exists but no documentation:

- `src/utils/retry.ts` - Retry utility with backoff (exported, no docs)
- `src/api/webhooks.ts` - Webhook handlers (3 endpoints, no docs)
- `src/config/advanced.ts` - Advanced options (12 options, not in config.mdx)

### Stale Examples (count)

Code examples that may not work:

| File | Line | Issue |
|------|------|-------|
| quickstart.mdx | 45 | Uses deprecated `init()`, should be `initialize()` |
| api/fetch.mdx | 23 | Import path changed from `pkg` to `pkg/client` |

### Inconsistent Terminology

Terms used differently across docs:

| Term | Variations Found | Recommended |
|------|------------------|-------------|
| API key | "api key", "API Key", "apiKey", "api-key" | "API key" |
| endpoint | "endpoint", "route", "URL", "path" | "endpoint" |

## 🟢 Good Practices Found

✓ All public exports have corresponding docs
✓ Code examples have language tags
✓ Consistent use of components (Note, Warning, etc.)

## Recommendations

### High Priority
1. **Consolidate auth docs** - Merge duplicate OAuth content into single source
2. **Update API signatures** - 5 files have outdated function signatures
3. **Document webhooks** - Major feature with zero documentation

### Medium Priority
4. **Version bump** - Update all version references to v2.x
5. **Standardize terminology** - Create glossary in context.json

### Low Priority
6. **Add missing options** - Document 12 config options
7. **Fix stale examples** - Update deprecated imports
```

## Analysis Techniques

### Finding Duplicates

Look for:
1. **Exact matches** - Same paragraphs in multiple files
2. **Similar code blocks** - Nearly identical examples
3. **Repeated explanations** - Same concept explained multiple times
4. **Copy-paste patterns** - Setup instructions repeated

### Finding Outdated Content

Compare:
1. **Function signatures** - Params, return types
2. **Import paths** - Package structure changes
3. **Version numbers** - In code vs docs
4. **Default values** - Changed defaults
5. **Error messages** - Updated error text

### Finding Discrepancies

Check:
1. **Return types** - What docs say vs code returns
2. **Required fields** - Optional vs required mismatches
3. **Behavior descriptions** - Edge cases documented incorrectly
4. **Prerequisites** - Wrong versions, missing dependencies

## Output Actions

After generating report, suggest:

"Found X issues. Would you like me to:
1. **Fix outdated docs** - Update signatures and versions
2. **Consolidate duplicates** - Merge redundant content
3. **Create missing docs** - Stub pages for undocumented features
4. **Update terminology** - Standardize across all files"

## Integration with Other Skills

- After blame analysis → `/update-doc` to fix issues
- For new undocumented features → `/create-doc`
- When ready to save → `/commit-doc`
