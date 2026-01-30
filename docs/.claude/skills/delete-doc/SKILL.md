---
name: delete-doc
description: Delete documentation pages interactively with confirmation.
---

## Instructions

When user wants to delete documentation:

### Step 1: Understand What to Delete

Ask the user:

"What would you like to delete?

1. **A specific page** - Tell me which page(s)
2. **Find unused pages** - I'll identify orphan pages not in navigation
3. **Deprecated content** - I'll find pages marked as deprecated
4. **Clean up** - Describe what you want removed"

### Step 2: Identify Pages

Based on their choice:

#### For Specific Page:
- "Which page(s)? (e.g., `guides/old-feature.mdx`)"
- Verify the file exists
- Check for incoming links from other pages

#### For Unused Pages:
Scan for orphan pages:
```
Compare:
- All .mdx files in docs/
- Pages referenced in docs.json

Orphan pages (not in navigation):
- docs/drafts/unused.mdx
- docs/old/deprecated-guide.mdx
```

#### For Deprecated Content:
Search for deprecation markers:
```
Files with deprecation notices:
- docs/api/legacy-auth.mdx (marked deprecated in v1.5)
- docs/guides/old-workflow.mdx (marked deprecated in v2.0)
```

### Step 3: Analyze Impact

Before deletion, check for:

1. **Incoming links** - Other pages linking to this page
2. **Navigation** - Entry in docs.json
3. **Redirects** - Should we redirect to a new page?

Show analysis:

"**Deletion Analysis for `guides/old-feature.mdx`:**

Incoming links (2 pages reference this):
- `quickstart.mdx:45` → links to `/guides/old-feature`
- `api/overview.mdx:23` → links to `/guides/old-feature#setup`

Navigation:
- Listed in docs.json under 'Guides' group

Recommended actions:
1. Remove from docs.json
2. Update or remove links in other pages
3. Consider redirect to replacement page"

### Step 4: Confirm Deletion

"Ready to delete `guides/old-feature.mdx`?

This will:
- ❌ Delete the file
- ❌ Remove from docs.json navigation
- ⚠️ Leave broken links in 2 pages (I can fix these)

Options:
1. **Delete and fix links** - Remove file, update linking pages
2. **Delete and redirect** - Remove file, add redirect to `{new-page}`
3. **Delete only** - Just remove the file
4. **Cancel** - Don't delete"

### Step 5: Execute Deletion

Based on user choice:

#### Delete and Fix Links:
1. Delete the MDX file
2. Update docs.json (remove page entry)
3. Find and update/remove links in other pages:
   ```mdx
   // Before
   See the [old feature guide](/guides/old-feature).
   
   // After
   See the [new feature guide](/guides/new-feature).
   // or remove the sentence entirely
   ```

#### Delete and Redirect:
1. Delete the MDX file
2. Update docs.json
3. Add redirect to docs.json or redirects file:
   ```json
   {
     "redirects": [
       { "from": "/guides/old-feature", "to": "/guides/new-feature" }
     ]
   }
   ```

#### Delete Only:
1. Delete the MDX file
2. Update docs.json
3. Warn about broken links

### Step 6: Summary

"Deleted:
- ❌ `docs/guides/old-feature.mdx`
- ✓ Removed from docs.json navigation
- ✓ Updated links in `quickstart.mdx`, `api/overview.mdx`
- ✓ Added redirect: `/guides/old-feature` → `/guides/new-feature`

Want me to commit these changes? Use `/commit` when ready."

---

## Bulk Deletion

For multiple pages:

"Found 5 orphan pages not in navigation:

| File | Last Modified | Size |
|------|--------------|------|
| `drafts/test.mdx` | 6 months ago | 2kb |
| `old/legacy-api.mdx` | 1 year ago | 15kb |
| `temp/scratch.mdx` | 3 months ago | 1kb |
| `guides/draft-feature.mdx` | 2 months ago | 8kb |
| `archive/v1-docs.mdx` | 1 year ago | 20kb |

Options:
1. **Delete all** - Remove all orphan pages
2. **Select pages** - Choose which to delete
3. **Review each** - Go through one by one
4. **Cancel** - Keep all pages"

---

## Safety Guidelines

- **Always confirm** before deleting
- **Check for links** to prevent broken references
- **Offer redirects** for removed public pages
- **Show impact** before executing
- **Keep backup** by suggesting to commit before deletion
- **Never delete** docs.json or context.json without explicit confirmation
