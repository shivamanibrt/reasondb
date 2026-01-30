<p align="center">
  <pre align="center">
██████╗ ███████╗██╗   ██╗██████╗  ██████╗  ██████╗
██╔══██╗██╔════╝██║   ██║██╔══██╗██╔═══██╗██╔════╝
██║  ██║█████╗  ██║   ██║██║  ██║██║   ██║██║     
██║  ██║██╔══╝  ╚██╗ ██╔╝██║  ██║██║   ██║██║     
██████╔╝███████╗ ╚████╔╝ ██████╔╝╚██████╔╝╚██████╗
╚═════╝ ╚══════╝  ╚═══╝  ╚═════╝  ╚═════╝  ╚═════╝
  </pre>
</p>

<p align="center">
  <strong>Beautiful documentation powered by AI agents</strong>
</p>

<p align="center">
  <a href="https://your-subdomain.devdoc.sh">Live Docs</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Structure</a> •
  <a href="#deployment">Deploy</a>
</p>

---

## Features

| Feature | Description |
|---------|-------------|
| Write in MDX | Markdown with React components for rich documentation |
| Beautiful Design | Modern UI with dark mode out of the box |
| Agentic Search | AI-powered search with agentic UX and sandbox |
| API Playground | Postman/Hoppscotch-like client for testing API endpoints |
| AI Agent Support | Use Claude Code or Cursor to write docs faster |
| Fast Setup | Get started in under 5 minutes |
| Responsive | Looks great on all devices |

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3333](http://localhost:3333) to view your documentation.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build documentation for production |
| `npm run start` | Start production server |
| `npm run check` | Validate docs.json and MDX files |
| `npm run deploy` | Deploy to DevDoc platform |
| `npm run ai` | Set up AI agent configuration |
| `npm run whoami` | Show current project info |
| `npm run upgrade` | Update devdoc to latest version |

## Project Structure

```
├── docs.json              # Navigation & site configuration
├── theme.json             # Theme & color customization
├── index.mdx              # Homepage
├── quickstart.mdx         # Quickstart guide
│
├── guides/                # Documentation guides
│   ├── overview.mdx       # Core concepts
│   └── configuration.mdx  # Configuration reference
│
├── api-reference/         # API documentation (if enabled)
│   ├── introduction.mdx   # API introduction
│   ├── authentication.mdx # Auth guide
│   ├── errors.mdx         # Error handling
│   ├── openapi.json       # OpenAPI spec (REST)
│   └── schema.graphql     # GraphQL schema
│
└── assets/                # Static assets
    ├── logo.svg           # Your logo
    └── favicon.svg        # Browser favicon
```

## Configuration

Edit `docs.json` to customize your documentation:

| Setting | Description |
|---------|-------------|
| `name` | Your documentation site name |
| `logo` | Logo image paths (light/dark mode) |
| `colors.primary` | Primary brand color |
| `navigation.tabs` | Configure tabs and page groups |

See the [Configuration Guide](/guides/configuration) for more details.

## Deployment

Deploy to DevDoc hosting with a single command:

```bash
npm run deploy
```

Your docs will be live at `https://your-subdomain.devdoc.sh`

## Keeping DevDoc Updated

To update devdoc to the latest version:

```bash
npm run upgrade
```

This ensures you always have the latest features and bug fixes.

## AI Agent Support

This project includes a `CLAUDE.md` file that teaches AI agents (Claude Code, Cursor) about DevDoc's format and conventions.

**Set up AI skills:**

```bash
npm run ai
```

**Available commands in Claude Code:**

| Command | Description |
|---------|-------------|
| `/bootstrap-docs` | Generate docs from your codebase |
| `/migrate-docs` | Migrate from Mintlify, Docusaurus, etc. |
| `/import-api-spec` | Import OpenAPI, GraphQL, or AsyncAPI specs |
| `/check-docs` | Quick health check |
| `/blame-doc` | Find duplicates, outdated content, discrepancies |
| `/create-doc` | Create a new documentation page |
| `/update-doc` | Update existing documentation |
| `/delete-doc` | Delete documentation pages |
| `/commit-doc` | Commit documentation changes |

**In Cursor**, just ask in Agent mode:
- "Generate initial documentation from this repo"
- "Blame docs - find duplicates and outdated content"
- "Create a new guide about authentication"
- "Update the quickstart guide"

## Learn More

- [DevDoc Documentation](https://devdoc.sh/docs) — Full platform docs
- [Components](https://devdoc.sh/components) — Available MDX components
- [CLI Reference](https://devdoc.sh/cli) — Command line tools
- [AI Agents](https://devdoc.sh/ai) — Using AI agents to write docs

---

<p align="center">
  Built with <a href="https://devdoc.sh">DevDoc</a>
</p>
