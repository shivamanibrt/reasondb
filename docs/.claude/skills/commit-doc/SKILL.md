---
name: commit-doc
description: Commit documentation changes to git after reviewing and confirming.
---

## Instructions

When user wants to commit documentation changes:

### Step 1: Check Current Status

Run git status to see what's changed:

```bash
git status
git diff --stat
```

Show summary to user:

"**Documentation Changes Ready to Commit:**

Modified files (3):
- `docs/guides/authentication.mdx` - Updated code examples
- `docs/api/users.mdx` - Added new endpoint docs
- `docs.json` - Updated navigation

New files (1):
- `docs/guides/webhooks.mdx` - New webhook guide

Deleted files (1):
- `docs/old/deprecated-api.mdx` - Removed deprecated docs

Would you like to:
1. **Review changes** - Show me the detailed diff
2. **Commit all** - Commit everything with a message
3. **Selective commit** - Choose which files to commit
4. **Cancel** - Don't commit yet"

### Step 2: Review Changes (if requested)

Show meaningful diff summary:

"**Changes in `docs/guides/authentication.mdx`:**

```diff
- const token = auth.getToken(user);
+ const token = await auth.getToken(user, { refresh: true });
```

Added:
- New `refresh` parameter documentation
- Updated example code
- Added error handling section

**Changes in `docs.json`:**
- Added 'Webhooks' to Guides group
- Removed 'Deprecated API' from navigation

Continue to commit?"

### Step 3: Generate Commit Message

Analyze changes and suggest a commit message:

"Suggested commit message:

```
docs: update authentication guide and add webhooks documentation

- Update auth.getToken() examples with new refresh parameter
- Add webhook integration guide
- Remove deprecated API documentation
- Update navigation structure
```

Options:
1. **Use this message** - Commit with suggested message
2. **Edit message** - Modify the commit message
3. **Custom message** - Write your own message"

### Step 4: Confirm and Commit

"Ready to commit with message:

```
docs: update authentication guide and add webhooks documentation
```

This will commit:
- 3 modified files
- 1 new file
- 1 deleted file

**Proceed with commit?** (yes/no)"

### Step 5: Execute Commit

```bash
git add docs/
git add docs.json
git commit -m "docs: update authentication guide and add webhooks documentation

- Update auth.getToken() examples with new refresh parameter
- Add webhook integration guide
- Remove deprecated API documentation
- Update navigation structure"
```

### Step 6: Summary and Next Steps

"✓ **Committed successfully!**

Commit: `abc1234`
Branch: `main`
Files: 5 changed

**Next steps:**
1. **Push changes**: `git push origin main`
2. **Deploy docs**: `npm run deploy`
3. **Create PR**: If on a feature branch

Would you like me to push the changes?"

---

## Commit Message Guidelines

### Format
```
<type>: <short description>

<detailed description>

<list of changes>
```

### Types
- `docs:` - Documentation changes (most common)
- `fix:` - Fix documentation errors
- `feat:` - New documentation features
- `refactor:` - Reorganize documentation
- `chore:` - Maintenance tasks

### Examples

**New documentation:**
```
docs: add webhook integration guide

- Add complete webhook setup guide
- Include payload examples
- Add troubleshooting section
```

**Update existing:**
```
docs: update authentication examples for v2.0

- Update code examples to use async/await
- Add new refresh token parameter
- Fix deprecated method references
```

**Fix errors:**
```
fix(docs): correct API endpoint URLs

- Fix base URL from /v1 to /v2
- Update authentication header name
- Fix typos in error codes
```

**Reorganize:**
```
refactor(docs): reorganize guide structure

- Move tutorials to dedicated folder
- Update navigation hierarchy
- Add cross-references between guides
```

---

## Selective Commit

When user wants to commit specific files:

"Select files to commit:

[ ] `docs/guides/authentication.mdx`
[ ] `docs/api/users.mdx`
[ ] `docs/guides/webhooks.mdx`
[x] `docs.json`

Enter file numbers to toggle (e.g., '1,3' or 'all'):"

After selection:
```bash
git add docs.json
git add docs/guides/webhooks.mdx
git commit -m "docs: add webhooks guide and update navigation"
```

---

## Safety Guidelines

- **Always show changes** before committing
- **Generate meaningful messages** based on actual changes
- **Don't commit sensitive data** - check for API keys, secrets
- **Suggest pushing** but don't auto-push
- **Keep commits focused** - one logical change per commit
- **Reference issues** if mentioned by user (e.g., "Fixes #123")
