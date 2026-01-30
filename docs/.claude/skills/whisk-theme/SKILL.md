---
name: whisk-theme
description: Analyze repository branding and generate custom documentation theme with branded components.
---

## Instructions

When asked to "whisk theme", "generate theme", "customize theme", or "match branding":

### Step 1: Scan for Brand Colors

Search repository for brand colors in priority order:

**Tailwind Config** (`tailwind.config.js/ts`):
```javascript
theme: { colors: { primary: '#xxx', brand: '#xxx' } }
```

**CSS Variables** (`globals.css`, `variables.css`, `app.css`):
```css
:root { --primary: #xxx; --brand-color: #xxx; }
```

**UI Frameworks**:
- Chakra: `colors.brand.500`
- MUI: `palette.primary.main`
- shadcn: `--primary: H S% L%`

### Step 2: Scan for Logo & Fonts

**Logo**: `public/logo.svg`, `assets/logo.*`, `favicon.svg`
**Fonts**: Tailwind fontFamily, CSS font-family, Next.js font imports

### Step 3: Present Findings

```
🎨 Brand Analysis Complete!

COLORS:
  Primary: #3B82F6 ████ (from tailwind.config.js)
  
LOGO: ✓ public/logo.svg
FONT: Inter

Apply to docs? (yes/customize/cancel)
```

### Step 4: Update Theme Files

#### theme.json
```json
{
  "$schema": "https://devdoc.sh/theme.json",
  "name": "{ProductName} Docs",
  "colors": {
    "primary": "{primary}",
    "primaryLight": "{lighten_15%}",
    "primaryDark": "{darken_15%}"
  },
  "typography": {
    "fontFamily": "{font}, system-ui, sans-serif"
  }
}
```

#### custom.css
```css
:root {
  --devdoc-primary: {primary};
  --devdoc-primary-light: {primaryLight};
  --devdoc-primary-dark: {primaryDark};
  --devdoc-font-family: '{font}', system-ui, sans-serif;
}
```

### Step 5: Update Branded Components

Generate component overrides based on brand colors and product type.

#### Callouts & Notices

```css
/* Branded callouts */
.callout-info {
  background: linear-gradient(135deg, var(--devdoc-primary-light) 0%, transparent 100%);
  border-left: 4px solid var(--devdoc-primary);
}

.callout-tip {
  border-left-color: var(--devdoc-primary);
}

.callout-warning {
  border-left-color: #f59e0b;
}

.callout-danger {
  border-left-color: #ef4444;
}
```

#### Cards & Card Groups

```css
/* Branded cards */
.card {
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.card:hover {
  border-color: var(--devdoc-primary);
  box-shadow: 0 4px 12px rgba(var(--devdoc-primary-rgb), 0.15);
}

.card-icon {
  color: var(--devdoc-primary);
}
```

#### Tabs

```css
/* Branded tabs */
.tabs-trigger[data-state="active"] {
  color: var(--devdoc-primary);
  border-bottom-color: var(--devdoc-primary);
}

.tabs-trigger:hover {
  color: var(--devdoc-primary-dark);
}
```

#### Accordions

```css
/* Branded accordions */
.accordion-trigger:hover {
  color: var(--devdoc-primary);
}

.accordion-trigger[data-state="open"] {
  color: var(--devdoc-primary);
}

.accordion-trigger[data-state="open"] svg {
  color: var(--devdoc-primary);
}
```

#### Buttons

```css
/* Primary button */
.btn-primary {
  background-color: var(--devdoc-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--devdoc-primary-dark);
}

/* Secondary/outline button */
.btn-secondary {
  border: 1px solid var(--devdoc-primary);
  color: var(--devdoc-primary);
  background: transparent;
}

.btn-secondary:hover {
  background-color: var(--devdoc-primary);
  color: white;
}
```

#### Code Blocks

```css
/* Branded code blocks */
.code-block {
  border: 1px solid var(--border);
  border-radius: 0.5rem;
}

.code-block-header {
  background: var(--muted);
  border-bottom: 1px solid var(--border);
}

.code-block .copy-button:hover {
  color: var(--devdoc-primary);
}

/* Syntax highlighting accent */
.token.function,
.token.class-name {
  color: var(--devdoc-primary);
}
```

#### API Playground

```css
/* API playground branding */
.api-method-get {
  background-color: #10b981;
}

.api-method-post {
  background-color: var(--devdoc-primary);
}

.api-method-put {
  background-color: #f59e0b;
}

.api-method-delete {
  background-color: #ef4444;
}

.try-it-button {
  background-color: var(--devdoc-primary);
}

.try-it-button:hover {
  background-color: var(--devdoc-primary-dark);
}
```

#### Navigation

```css
/* Sidebar navigation */
.nav-link {
  color: var(--foreground);
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--devdoc-primary);
}

.nav-link.active {
  color: var(--devdoc-primary);
  font-weight: 500;
}

.nav-group-title {
  color: var(--muted-foreground);
  font-weight: 600;
}

/* Tab navigation */
.nav-tab.active {
  color: var(--devdoc-primary);
  border-bottom: 2px solid var(--devdoc-primary);
}
```

#### Search

```css
/* Search styling */
.search-input:focus {
  border-color: var(--devdoc-primary);
  box-shadow: 0 0 0 2px rgba(var(--devdoc-primary-rgb), 0.2);
}

.search-result:hover {
  background-color: var(--muted);
}

.search-result-title mark {
  background-color: rgba(var(--devdoc-primary-rgb), 0.2);
  color: var(--devdoc-primary-dark);
}
```

#### Table of Contents

```css
/* TOC styling */
.toc-link {
  color: var(--muted-foreground);
}

.toc-link:hover {
  color: var(--devdoc-primary);
}

.toc-link.active {
  color: var(--devdoc-primary);
  font-weight: 500;
}

.toc-indicator {
  background-color: var(--devdoc-primary);
}
```

#### Steps Component

```css
/* Steps styling */
.step-number {
  background-color: var(--devdoc-primary);
  color: white;
  border-radius: 50%;
}

.step-connector {
  background-color: var(--border);
}

.step-completed .step-number {
  background-color: var(--devdoc-primary);
}

.step-completed .step-connector {
  background-color: var(--devdoc-primary);
}
```

#### Tooltips

```css
/* Tooltip styling */
.tooltip {
  background-color: var(--foreground);
  color: var(--background);
  border-radius: 0.375rem;
}

.tooltip-arrow {
  fill: var(--foreground);
}
```

### Step 6: Project-Specific Customizations

Based on detected project type, add specific styles:

#### For API Documentation
```css
/* API-specific styles */
.endpoint-badge {
  font-family: var(--devdoc-code-font-family);
  font-weight: 600;
}

.response-status.success {
  color: #10b981;
}

.response-status.error {
  color: #ef4444;
}

.schema-property {
  border-left: 2px solid var(--border);
}

.schema-property:hover {
  border-left-color: var(--devdoc-primary);
}
```

#### For SDK/Library Documentation
```css
/* SDK-specific styles */
.language-selector {
  border: 1px solid var(--border);
}

.language-selector button.active {
  background-color: var(--devdoc-primary);
  color: white;
}

.install-command {
  background: var(--muted);
  border-radius: 0.5rem;
  font-family: var(--devdoc-code-font-family);
}
```

#### For Product Documentation
```css
/* Product-specific styles */
.feature-card {
  border: 1px solid var(--border);
  border-radius: 0.75rem;
}

.feature-card:hover {
  border-color: var(--devdoc-primary);
}

.feature-icon {
  color: var(--devdoc-primary);
  font-size: 2rem;
}

.screenshot {
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

### Step 7: Complete custom.css Template

Generate the full `custom.css` with all branded components:

```css
/* {ProductName} Documentation Theme */
/* Generated by DevDoc whisk-theme */

/* ============================================
   1. CSS Variables
   ============================================ */

:root {
  /* Brand Colors */
  --devdoc-primary: {primary};
  --devdoc-primary-light: {primaryLight};
  --devdoc-primary-dark: {primaryDark};
  --devdoc-primary-rgb: {primaryRGB};
  
  /* Typography */
  --devdoc-font-family: '{font}', system-ui, sans-serif;
  --devdoc-heading-font-family: '{font}', system-ui, sans-serif;
  --devdoc-code-font-family: 'JetBrains Mono', 'Fira Code', monospace;
  
  /* Layout */
  --devdoc-sidebar-width: 280px;
  --devdoc-content-max-width: 768px;
}

/* ============================================
   2. Base Styles
   ============================================ */

* {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

::selection {
  background-color: var(--devdoc-primary);
  color: white;
}

/* ============================================
   3. Links
   ============================================ */

.docs-content a:not([class]) {
  color: var(--devdoc-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.docs-content a:not([class]):hover {
  color: var(--devdoc-primary-dark);
}

/* ============================================
   4. Navigation
   ============================================ */

.nav-link:hover { color: var(--devdoc-primary); }
.nav-link.active { color: var(--devdoc-primary); font-weight: 500; }
.nav-tab.active { color: var(--devdoc-primary); border-bottom: 2px solid var(--devdoc-primary); }

/* ============================================
   5. Components
   ============================================ */

/* Buttons */
.btn-primary { background-color: var(--devdoc-primary); color: white; }
.btn-primary:hover { background-color: var(--devdoc-primary-dark); }

/* Cards */
.card:hover { border-color: var(--devdoc-primary); }
.card-icon { color: var(--devdoc-primary); }

/* Callouts */
.callout { border-left: 4px solid var(--devdoc-primary); }

/* Tabs */
.tabs-trigger[data-state="active"] { color: var(--devdoc-primary); border-bottom-color: var(--devdoc-primary); }

/* Accordions */
.accordion-trigger[data-state="open"] { color: var(--devdoc-primary); }

/* Steps */
.step-number { background-color: var(--devdoc-primary); color: white; }

/* Search */
.search-input:focus { border-color: var(--devdoc-primary); }
.search-result-title mark { background-color: rgba(var(--devdoc-primary-rgb), 0.2); }

/* TOC */
.toc-link.active { color: var(--devdoc-primary); }
.toc-indicator { background-color: var(--devdoc-primary); }

/* ============================================
   6. Code
   ============================================ */

pre code {
  font-family: var(--devdoc-code-font-family);
  font-size: 0.875rem;
  line-height: 1.7;
}

:not(pre) > code {
  background-color: var(--muted);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.code-block .copy-button:hover { color: var(--devdoc-primary); }

/* ============================================
   7. API Reference
   ============================================ */

.api-method-post { background-color: var(--devdoc-primary); }
.try-it-button { background-color: var(--devdoc-primary); }
.try-it-button:hover { background-color: var(--devdoc-primary-dark); }
```

### Step 8: Confirm Changes

```
✅ Theme & Components Updated!

Files modified:
  ✓ theme.json - brand colors, typography
  ✓ custom.css - variables, components, styles
  ✓ docs.json - logo paths
  ✓ public/logo.svg - copied

Components branded:
  • Navigation (sidebar, tabs, TOC)
  • Buttons (primary, secondary)
  • Cards & Card groups
  • Callouts & Notices
  • Tabs & Accordions
  • Code blocks
  • Search
  • API playground
  • Steps component

Run `devdoc dev` to preview!
```
