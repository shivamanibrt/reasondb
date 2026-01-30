---
name: update-doc
description: Update existing documentation by searching codebase for current implementation.
---

## Instructions

When user wants to update documentation:

### Step 0: Read Context

**Read `.devdoc/context.json` if it exists:**
- Use `product.name` for product references
- Apply `terminology.glossary` for correct terms
- Avoid `terminology.avoidTerms`
- Match `documentation.voice` for writing style

### Step 1: Understand What to Update

Ask the user:

"What would you like to update?

1. **A specific page** - Tell me which page to update
2. **Sync with codebase** - I'll find outdated docs by comparing to code
3. **Navigation structure** - Update docs.json organization
4. **Multiple pages** - Describe the changes needed
5. **Fix issues** - Point me to errors or problems"

### Step 2: Analyze Current State

Based on their choice:

#### For Specific Page:
- "Which page? (e.g., `guides/authentication.mdx`)"
- Read the current page content
- "What changes do you want?
  - Update code examples
  - Add new sections
  - Fix errors/outdated info
  - Rewrite for clarity
  - Other (describe)"

#### For Codebase Sync (Search Real Files):

**Step 2a: Search for source files related to documented topics:**
```bash
# Find all exported functions/classes
rg "export (function|class|const|interface|type)" --type ts -l

# Find specific topic files
git ls-files | grep -iE "(auth|user|api)"
```

**Step 2b: Read both doc files AND source files:**
1. Read the doc file to see what's documented
2. Search and read the corresponding source file
3. Compare documented vs actual implementation

**Step 2c: Generate comparison:**
```
DOCUMENTED (from docs/api/users.mdx):
  - createUser(name: string, email: string)

ACTUAL (from src/lib/users.ts):
  - createUser(options: CreateUserInput)

→ SIGNATURE MISMATCH - needs update
```

Compare documentation against actual source:
  - Function signatures changed?
  - New exports not documented?
  - Removed features still documented?
  - Version numbers outdated?

#### For Navigation:
- Read current `docs.json`
- "What navigation changes?
  - Add new pages
  - Reorganize groups
  - Rename tabs
  - Remove pages
  - Other"

#### For Multiple Pages:
- "Which pages need updating?"
- "What's the common change across them?"

#### For Issues:
- "What's the problem you're seeing?"
- Analyze and propose fixes

### Step 3: Detect Feature Flags & Duplicates

**Search for feature flags in source:**
```bash
rg -l "featureFlag|feature_flag|isEnabled|FF_" --type ts
rg "if.*\(.*feature|process\.env\.FEATURE" --type ts
```

**Search for duplicate/similar features:**
```bash
rg "export.*(login|authenticate|signIn)" --type ts -l
```

**Include in sync report:**

### Step 4: Generate Sync Report (From File Search)

**Compare docs against actual source files:**

```
## Documentation Sync Report

### Signature Changes (from source files)
- `docs/api/users.mdx` vs `src/lib/users.ts`:
  - Documented: `createUser(name, email)`
  - Source file: `createUser(options: CreateUserInput)`
  - Action: Update signature and params
  
### New Exports (in source, not in docs)
- `src/lib/auth.ts`: `refreshToken()` - Not documented
- `src/lib/users.ts`: `deleteUser()` - Not documented

### Removed (in docs, not in source)
- `legacyAuth()` - Not found in any source file

### Up to Date ✓
- `docs/guides/authentication.mdx` matches `src/lib/auth/`

### Unable to Verify (source not found)
⚠️ `docs/legacy/old-api.mdx` - No matching source file

═══════════════════════════════════════════════════════════
                 FEATURE FLAGS DETECTED
═══════════════════════════════════════════════════════════

⚠️ src/lib/auth/index.ts:45 - newAuthFlow
   Current docs: OLD implementation
   Feature flag: NEW implementation available
   
   Question: Update docs to which version?
   1. Keep current (old)
   2. Update to new (feature-flagged)
   3. Document both with toggle notice

═══════════════════════════════════════════════════════════
                 DUPLICATE FEATURES
═══════════════════════════════════════════════════════════

🔄 Similar functions found:
   - src/lib/auth/login.ts → login()
   - src/lib/auth/v2/authenticate.ts → authenticate()
   
   Question: How to handle?
   1. Document primary only
   2. Document all with comparison
   3. Mark duplicates as deprecated
```

Ask: "How would you like to proceed?
1. **Fix all** - Update everything (choose defaults for flags/duplicates)
2. **Interactive** - Review each change with me
3. **Specific items** - Tell me which to fix
4. **Re-search** - Search for different file patterns"

### Step 5: Review Each Change with User (MANDATORY)

**For EACH file being updated, show before/after:**

```
═══════════════════════════════════════════════════════════
              CHANGE REVIEW: docs/api/users.mdx
═══════════════════════════════════════════════════════════

📄 BEFORE (current):
───────────────────────────────────────────────────────────
## createUser(name, email)

Creates a new user account.

| Parameter | Type |
|-----------|------|
| name | string |
| email | string |
───────────────────────────────────────────────────────────

📄 AFTER (proposed):
───────────────────────────────────────────────────────────
## createUser(options)

Creates a new user account.

| Parameter | Type | Description |
|-----------|------|-------------|
| options | CreateUserInput | User creation options |

### CreateUserInput

| Property | Type | Required |
|----------|------|----------|
| name | string | Yes |
| email | string | Yes |
| role | 'admin' \| 'user' | No |
───────────────────────────────────────────────────────────

⚠️ NOTICES:
- Source: src/lib/users.ts:23
- Feature flag: None
- Duplicates: None

OPTIONS:
1. ✅ **Approve** - Apply this change
2. ✏️  **Edit** - Modify the proposed content
3. ⏭️  **Skip** - Don't update this file
4. ❌ **Cancel all** - Stop updating

Choose an option:
```

### Step 6: Apply Updates (After Approval)

**Only after user approves each change:**

1. **Preserve prose** - Keep explanations, update technical details
2. **Update code examples** - Match current signatures
3. **Fix terminology** - Apply context.json rules
4. **Add deprecation notices** for removed features:
   ```mdx
   <Warning>
   **Deprecated in v2.0**: This feature was removed. 
   See [migration guide](/guides/v2-migration).
   </Warning>
   ```
5. **Add feature flag notices** where applicable:
   ```mdx
   <Note>
   **Feature Flag**: This feature requires `newAuthFlow` to be enabled.
   </Note>
   ```
6. **Create stubs** for new features:
   ```mdx
   {/* TODO: Document this new feature */}
   ## New Feature
   Coming soon...
   ```

### Step 6: Update Navigation (if needed)

If pages were added/removed/moved:

1. Read current `docs.json`
2. Propose navigation changes
3. Apply after user confirms

### Step 7: Summary

"Updated:
- `docs/api/users.mdx` - Updated function signatures
- `docs/quickstart.mdx` - Updated to v2.0.0
- `docs.json` - Added webhooks page

Changes ready for review. Run `npm run dev` to preview.

Want me to commit these changes? Use `/commit` when ready."

---

## Update Patterns

### Changed Function Signature
```mdx
// Before
`createUser(name: string, email: string)`

// After  
`createUser(options: CreateUserInput)`

Where `CreateUserInput`:
```typescript
interface CreateUserInput {
  name: string;
  email: string;
  role?: 'admin' | 'user';
}
```
```

### Removed Feature
```mdx
<Warning>
**Removed in v2.0**: The `legacyAuth` method was removed.
Use `authenticate()` instead. See [migration guide](/migrate-v2).
</Warning>
```

### New Feature Stub
```mdx
---
title: "Webhooks"
description: "Receive real-time notifications"
---

{/* TODO: Complete this documentation */}

## Overview

Documentation coming soon.

## Quick Start

```typescript
// Example placeholder
```
```

---

## Key Principles

| Principle | Description |
|-----------|-------------|
| **Search before update** | ALWAYS read source files before changing docs |
| **No hallucination** | Only update based on actual file contents |
| **Review before write** | ALWAYS show before/after for user approval |
| **Flag feature flags** | Detect and highlight conditional features |
| **Flag duplicates** | Identify similar/related features |
| **Verify changes** | Read source to confirm what changed |

## Quality Guidelines

- **SEARCH FIRST** - Read source files before making any update
- **REVIEW WITH USER** - Show before/after for each change
- **DETECT FEATURE FLAGS** - Search for conditional features
- **DETECT DUPLICATES** - Find similar functions/features
- Always show changes before applying
- Preserve existing prose and explanations
- Update only technical details (code, versions, signatures)
- Flag when source file not found - offer auto-correct options
- Add TODO markers for human review
- Apply terminology from context.json
- Create stubs rather than skip new features
