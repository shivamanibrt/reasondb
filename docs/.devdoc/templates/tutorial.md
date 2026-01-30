# Tutorial Template

Use this structure when creating step-by-step tutorials.

## Format

```mdx
---
title: Build [Something] with [Technology]
description: A complete tutorial to [achieve outcome] from scratch
---

## What You'll Build

[Screenshot or diagram of the final result]

Brief description of the end result and why it's useful.

**Time to complete:** ~X minutes

## Architecture Overview

Show the system architecture with a mermaid diagram:

```mermaid
flowchart TB
    subgraph Frontend
        A[React App]
    end
    subgraph Backend
        B[API Server]
        C[Database]
    end
    A -->|REST API| B
    B --> C
```

## Prerequisites

- [Prerequisite 1 with link]
- [Prerequisite 2 with link]
- Basic knowledge of [topic]

## Project Setup

<Steps>
  <Step title="Create a new project">
    ```bash
    mkdir my-project && cd my-project
    npm init -y
    ```
  </Step>
  
  <Step title="Install dependencies">
    ```bash
    npm install package-name
    ```
  </Step>
</Steps>

## Part 1: [First Major Section]

### Step 1.1: [Specific Task]

Explanation of what we're doing and why.

```language
// Code with comments explaining key parts
```

<Tip>
Pro tip or best practice related to this step.
</Tip>

### Step 1.2: [Next Task]

Continue building on the previous step.

## Part 2: [Second Major Section]

### Data Flow

Visualize the data flow:

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant DB
    
    User->>Frontend: Click button
    Frontend->>API: POST /action
    API->>DB: Query
    DB-->>API: Result
    API-->>Frontend: Response
    Frontend-->>User: Update UI
```

### Step 2.1: [Task]

Break complex tutorials into logical parts.

## Testing Your Implementation

How to verify everything works:

```bash
npm test
# or
npm run dev
```

Expected output:
```
✓ All tests passed
```

## Troubleshooting

<Accordion title="Error: [Common error message]">
  **Cause:** Explanation of why this happens.
  
  **Solution:** How to fix it.
</Accordion>

## Next Steps

Now that you've built [X], you can:

- [Enhancement 1]
- [Enhancement 2]
- [Related tutorial link]

## Complete Code

<Accordion title="View complete source code">
```language
// Full working code
```
</Accordion>
```

## Mermaid Diagram Guidelines

### Architecture Diagrams

Use subgraphs to group related components:

```mermaid
flowchart TB
    subgraph Client["Client Layer"]
        A[Web App]
        B[Mobile App]
    end
    subgraph Services["Service Layer"]
        C[Auth Service]
        D[API Gateway]
    end
    subgraph Data["Data Layer"]
        E[(Database)]
        F[(Cache)]
    end
    A --> D
    B --> D
    D --> C
    D --> E
    D --> F
```

### Process Flow

Show the build/deploy process:

```mermaid
flowchart LR
    A[Code] --> B[Build]
    B --> C[Test]
    C --> D{Pass?}
    D -->|Yes| E[Deploy]
    D -->|No| F[Fix]
    F --> B
```

### Class/Component Diagram

```mermaid
classDiagram
    class User {
        +String id
        +String email
        +create()
        +update()
    }
    class Order {
        +String id
        +String userId
        +submit()
    }
    User "1" --> "*" Order
```

## Guidelines

- Show the end result first to motivate readers
- Break into digestible parts (10-15 min each)
- Include checkpoints where readers can verify progress
- Provide complete code at the end for reference
- Add troubleshooting for common issues
- **Use architecture diagrams** at the start
- **Use sequence diagrams** for API interactions
- **Use flowcharts** for decision logic
