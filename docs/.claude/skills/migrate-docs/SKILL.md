---
name: migrate-docs
description: Migrate documentation from other platforms (Mintlify, Docusaurus, GitBook, README) to DevDoc format
---

## Instructions

When migrating documentation from another platform:

### Step 1: Detect Source Format

Identify the documentation source by looking for:

| Platform | Detection Files |
|----------|-----------------|
| Mintlify | `mint.json`, `.mintlify/` |
| Docusaurus | `docusaurus.config.js`, `sidebars.js` |
| GitBook | `SUMMARY.md`, `.gitbook.yaml` |
| ReadMe | `readme-oas.json`, `.readme/` |
| VuePress | `.vuepress/config.js` |
| MkDocs | `mkdocs.yml` |
| Sphinx | `conf.py`, `index.rst` |
| README only | `README.md` (no other docs) |

### Step 2: Migration Mappings

#### Mintlify → DevDoc

```
mint.json → docs.json
├── name → name
├── logo → (extract to assets/logo/)
├── favicon → favicon
├── colors → theme.json
├── navigation → navigation.tabs + groups
├── topbarLinks → navbar
├── anchors → navigation.global.anchors
└── api → api

Component Mappings:
├── <Accordion> → <Accordion>
├── <AccordionGroup> → <AccordionGroup>
├── <Card> → <Card>
├── <CardGroup> → <CardGroup>
├── <CodeGroup> → <Tabs> with code
├── <Tabs> → <Tabs>
├── <Tab> → <Tab>
├── <Info> → <Info>
├── <Note> → <Note>
├── <Tip> → <Tip>
├── <Warning> → <Warning>
├── <Check> → <Tip> (with check icon)
├── <Steps> → <Steps>
├── <Step> → <Step>
├── <Frame> → (image wrapper, convert to <img>)
├── <ResponseField> → (convert to table)
└── <ParamField> → (convert to table)
```

#### Docusaurus → DevDoc

```
docusaurus.config.js → docs.json
├── title → name
├── favicon → favicon
├── themeConfig.navbar → navbar
├── themeConfig.footer → (extract links to anchors)
└── docs.sidebarPath → navigation

sidebars.js → navigation.tabs[].groups

Component Mappings:
├── :::note → <Note>
├── :::tip → <Tip>
├── :::info → <Info>
├── :::caution → <Warning>
├── :::danger → <Warning>
├── <Tabs> → <Tabs>
├── <TabItem> → <Tab>
└── import/export → (inline or convert to snippets)
```

#### GitBook → DevDoc

```
SUMMARY.md → docs.json navigation
├── # Group → groups[].group
├── * [Page](path.md) → groups[].pages[]
└── Nested items → nested groups

Component Mappings:
├── {% hint style="info" %} → <Info>
├── {% hint style="warning" %} → <Warning>
├── {% hint style="danger" %} → <Warning>
├── {% hint style="success" %} → <Tip>
├── {% tabs %} → <Tabs>
├── {% tab title="X" %} → <Tab title="X">
├── {% code title="X" %} → ```language title="X"
└── {% embed url="X" %} → <iframe> or link
```

### Step 3: Execute Migration

1. Convert configuration files
2. Transform MDX/MD content with component mappings
3. Copy and organize assets
4. Generate docs.json navigation
5. Create theme.json from color settings

### Step 4: Post-Migration Validation

After migration:
1. Run `/check-docs` to verify all links work
2. Preview with `devdoc dev`
3. Check component rendering
4. Verify navigation structure
