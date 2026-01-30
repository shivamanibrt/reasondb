# DevDoc Documentation Project

This is a DevDoc documentation project using MDX (Markdown + React components).

## Source Code Location

If this docs folder is inside a larger repository, the source code is in the parent directory:
- Source code: `../src/` or `../lib/`
- Package config: `../package.json`
- README: `../README.md`

When generating documentation, always check the parent directory (`../`) for source code to document.

## Project Structure

```
├── docs.json           # Navigation and site configuration
├── theme.json          # Theme colors and styling
├── custom.css          # Custom CSS overrides (optional)
├── index.mdx           # Homepage
├── quickstart.mdx      # Getting started guide
├── guides/             # Documentation guides
├── api-reference/      # API documentation
│   ├── openapi.json    # OpenAPI specification
│   └── schema.graphql  # GraphQL schema (if applicable)
└── assets/             # Static assets (images, logos, favicon)
```

## MDX File Format

Every MDX file requires frontmatter:

```yaml
---
title: "Page Title"
description: "Brief description for SEO and navigation"
---
```

**Important**: Do NOT use H1 headings (`#`) in content - the title comes from frontmatter.

## Available Components

### Callouts
```mdx
<Note>Additional information the reader should know.</Note>
<Tip>Helpful hints and best practices.</Tip>
<Warning>Important cautions and potential issues.</Warning>
<Info>General informational content.</Info>
```

### Cards & Navigation
```mdx
<CardGroup cols={2}>
  <Card title="Title" icon="icon-name" href="/path">
    Card description text
  </Card>
</CardGroup>
```

### Steps (for tutorials)
```mdx
<Steps>
  <Step title="Step 1">
    Step content here
  </Step>
  <Step title="Step 2">
    More content
  </Step>
</Steps>
```

### Tabs
```mdx
<Tabs>
  <Tab title="JavaScript">
    ```javascript
    const x = 1;
    ```
  </Tab>
  <Tab title="Python">
    ```python
    x = 1
    ```
  </Tab>
</Tabs>
```

### Accordions
```mdx
<AccordionGroup>
  <Accordion title="Question 1">
    Answer content
  </Accordion>
</AccordionGroup>
```

### Code Blocks
Use fenced code blocks with language tags:
````mdx
```javascript title="example.js"
const hello = "world";
```
````

## docs.json Configuration

The `docs.json` file controls navigation and site settings:

```json
{
  "name": "Project Name",
  "navigation": {
    "tabs": [
      {
        "tab": "Guides",
        "type": "docs",
        "groups": [
          {
            "group": "Getting Started",
            "icon": "rocket-launch",
            "pages": ["index", "quickstart"]
          }
        ]
      },
      {
        "tab": "API Reference",
        "type": "openapi",
        "path": "/api-reference",
        "spec": "api-reference/openapi.json"
      }
    ]
  }
}
```

**Page paths**: Use relative paths without `.mdx` extension.

## Icons

Use Phosphor icons (https://phosphoricons.com/). Common icons:
- `rocket-launch` - Getting started
- `book-open` - Documentation
- `terminal` - CLI/Commands
- `gear` - Configuration
- `code` - Development
- `puzzle-piece` - Components
- `key` - Authentication
- `cloud-arrow-up` - Deployment

## Writing Guidelines

1. **Introduction**: Start each page with a brief paragraph (no heading) explaining the topic
2. **Structure**: Use H2 (`##`) for main sections, H3 (`###`) for subsections
3. **Code examples**: Always include practical, working code examples
4. **Navigation**: End guides with a `<CardGroup>` linking to related pages
5. **Tone**: Write in second person ("you can", "your project")
6. **Brevity**: Keep paragraphs short (2-4 sentences)

## Common Tasks

### Add a new page
1. Create `new-page.mdx` with frontmatter
2. Add to `docs.json` navigation in appropriate group

### Add API documentation
1. Place OpenAPI spec in `api-reference/openapi.json`
2. Add tab with `"type": "openapi"` to docs.json

### Customize theme
Edit `theme.json`:
```json
{
  "colors": {
    "primary": "#0066FF",
    "background": "#FFFFFF"
  }
}
```

## CLI Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Deploy to DevDoc hosting
npx devdoc deploy
```

## DevDoc AI Agent Skills

If you have Claude Code skills installed (`devdoc ai`):

- `/bootstrap-docs` - Generate documentation from codebase
- `/migrate-docs` - Migrate from other platforms
- `/import-api-spec` - Import OpenAPI, GraphQL, or AsyncAPI specs
- `/check-docs` - Health check for docs
- `/blame-doc` - Find duplicates, outdated content, discrepancies
- `/create-doc` - Create new documentation page
- `/update-doc` - Update existing documentation
- `/delete-doc` - Delete documentation pages
- `/commit-doc` - Commit documentation changes
