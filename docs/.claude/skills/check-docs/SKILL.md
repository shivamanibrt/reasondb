---
name: check-docs
description: Quick health check for documentation issues. Verifies content against actual source files.
---

## Instructions

Run a quick audit of documentation health.

### Step 0: Read Context Memory

**First, read `.devdoc/context.json` if it exists:**

```json
{
  "product": { "name": "..." },
  "terminology": { 
    "glossary": { "term": "definition" },
    "avoidTerms": [{ "wrong": "...", "correct": "..." }],
    "brandNames": { "ProductName": "ProductName" }
  },
  "api": { "style": "REST", "authentication": { "type": "api_key" } }
}
```

**Use context for additional checks:**
- Verify terminology usage matches glossary
- Flag usage of terms in `avoidTerms`
- Check brand name capitalization
- Validate API patterns match `api.conventions`

### Step 0b: Source Verification (CRITICAL)

**For each doc page, search for corresponding source files:**

```bash
# For auth docs, find auth source
git ls-files | grep -iE "auth"
rg -l "export.*login" --type ts

# For API docs, find route handlers
git ls-files | grep -iE "(route|api|controller)"
```

**Flag docs without verifiable sources:**
```
⚠️ UNVERIFIED DOCS (no matching source files)
- docs/legacy/old-api.mdx - No source found
- docs/guides/advanced.mdx - No source found

Options:
1. 🔄 Remove these docs
2. ❓ Ask for source locations
3. 📝 Mark as needs-review
```

### Step 1: Get Documentation Type

**Read `docs.json` for `docType` field:**
```json
{ "docType": "api" }  // "internal" | "api" | "product"
```

**If not set, detect from structure:**
- Has `architecture/`, `development/` → "internal"
- Has `api-reference/`, `sdks/` → "api"
- Has `features/`, `tutorials/` → "product"

This helps tailor the checks:
- **internal**: Should have setup guides, architecture docs
- **api**: Should have authentication, error handling, API reference
- **product**: Should have screenshots, tutorials, FAQs

### Step 2: Run Checks

#### Standard Checks:
1. **Broken Links** - Check all internal href links resolve
2. **Missing Pages** - Pages in docs.json but file doesn't exist
3. **Orphan Pages** - MDX files not in docs.json navigation
4. **Code Validity** - Syntax check code blocks
5. **Outdated Examples** - Compare imports against package exports
6. **Stale Versions** - Check version numbers against package.json

#### Source Verification Checks (CRITICAL):
7. **Source File Exists** - For each doc, search for matching source file
8. **Signature Match** - Compare documented signatures vs source
9. **Type Accuracy** - Verify documented types match source types
10. **Example Validity** - Check examples work with current source

#### Context-Based Checks (if context.json exists):
11. **Terminology** - Flag incorrect terms from `avoidTerms`
12. **Brand Names** - Check capitalization matches `brandNames`
13. **Product Name** - Ensure consistent use of `product.name`
14. **API Patterns** - Verify examples follow `api.conventions`

### Output Format

```
Documentation Health Check
==========================

Context: Using .devdoc/context.json ✓
DocType: api

Summary: X issues found

## Critical Issues

### Broken Links (count)
   file.mdx:line → /path (page not found)

### Missing Pages (count)
   docs.json references 'page' but file not found

### Source Verification Failed (count)
   docs/api/auth.mdx → No source file found
     Searched: src/**/*auth*.ts, lib/**/*auth*.ts
     Options:
       1. 🔄 Remove doc
       2. ❓ Ask for path
       3. 📝 Mark as TODO

### Signature Mismatch (count)
   docs/api/users.mdx → createUser signature wrong
     Documented: createUser(name, email)
     Source: createUser(options: CreateUserInput)
     File: src/lib/users.ts:45

## Warnings

### Terminology Issues (count)
   file.mdx:line → Uses "charge" instead of "payment"

### Brand Name Issues (count)
   file.mdx:line → "productname" should be "ProductName"

### Outdated Code (count)
   file.mdx:line → import { oldFunc } from 'pkg'

### Orphan Pages (count)
   path/to/file.mdx (not in navigation)

## Passed

✓ All version numbers current
✓ All internal links resolve
✓ No syntax errors in code blocks
✓ Product name used consistently
✓ All docs have verified source files
```

## Checks By DocType

### For docType: "internal"
- [ ] Setup guide exists and references correct tools
- [ ] Architecture docs present
- [ ] Development workflow documented
- [ ] Prerequisites clearly listed

### For docType: "api"
- [ ] Authentication page exists
- [ ] Error codes documented
- [ ] API reference present (OpenAPI or manual)
- [ ] Quickstart under 5 minutes
- [ ] Code examples in primary language

### For docType: "product"
- [ ] Screenshots present and described
- [ ] Tutorials have clear steps
- [ ] FAQ section exists
- [ ] Non-technical language used

## Detailed Checks

### Source Verification (CRITICAL)

**For each documentation page:**
```bash
# 1. Extract topic from doc path
# docs/api/auth.mdx → topic: "auth"

# 2. Search for source files
git ls-files | grep -iE "auth"
rg -l "export.*(login|authenticate)" --type ts

# 3. Read source and doc, compare:
#    - Function signatures
#    - Parameter types
#    - Return types
#    - Error codes
```

**If source not found:**
```
⚠️ UNVERIFIED: docs/api/auth.mdx
No source file found for authentication documentation.

Options:
1. 🔄 Auto-correct IA - Remove this doc
2. ✏️ Rename doc - Match what exists
3. 📝 Mark as TODO - Keep with warning
4. ❓ Ask for path - Where is it implemented?
```

### Link Validation
- Internal links (`href="/path"`)
- Anchor links (`href="#section"`)
- Cross-references between pages

### Code Block Validation
- Language tag present
- Valid syntax (basic check)
- Import statements resolve
- Uses correct primary language from context
- **Examples match source code**

### Navigation Validation
- All pages in docs.json exist
- No duplicate entries
- Valid group structure

### Content Validation
- Frontmatter present (title, description)
- No H1 headings (title from frontmatter)
- Images have alt text
- **Sources cited in frontmatter**

### Terminology Validation (from context)
- No terms from `avoidTerms` used
- Brand names capitalized correctly
- Glossary terms used consistently

## Quick Fixes

After running check, common fixes:

1. **Broken link** → Update href or create missing page
2. **Orphan page** → Add to docs.json or delete if unused
3. **Missing frontmatter** → Add title and description
4. **Outdated import** → Update to current export name
5. **Wrong terminology** → Replace with correct term from context
6. **Brand name** → Fix capitalization per context.json
