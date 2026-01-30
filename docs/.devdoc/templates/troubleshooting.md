# Troubleshooting Template

Use this structure for troubleshooting and FAQ documentation.

## Format

```mdx
---
title: Troubleshooting [Topic]
description: Solutions for common [Topic] issues
---

## Decision Tree

Use this to find your issue:

```mermaid
flowchart TD
    A[Having Issues?] --> B{Can you install?}
    B -->|No| C[Installation Issues]
    B -->|Yes| D{Can you authenticate?}
    D -->|No| E[Auth Issues]
    D -->|Yes| F{Getting errors?}
    F -->|Yes| G[Error Reference]
    F -->|No| H[Performance Issues]
    
    click C "#installation-issues"
    click E "#authentication-issues"
    click G "#error-reference"
    click H "#performance-issues"
```

## Common Issues

### Error: [Exact error message]

<Accordion title="[Short description of the error]">
**Symptoms:**
- What the user sees
- When it typically occurs

**Cause:**
Brief explanation of why this happens.

**Solution:**

<Steps>
  <Step title="Check [first thing]">
    ```bash
    command to diagnose
    ```
  </Step>
  <Step title="Fix [the issue]">
    ```bash
    command to fix
    ```
  </Step>
</Steps>

**Prevention:**
How to avoid this in the future.
</Accordion>

### [Another common issue]

<Accordion title="[Description]">
**Symptoms:**
- Symptom 1
- Symptom 2

**Cause:**
Explanation.

**Solution:**
Step-by-step fix.
</Accordion>

## Error Flow Reference

```mermaid
flowchart LR
    subgraph "400 Errors"
        A[400 Bad Request]
        B[401 Unauthorized]
        C[403 Forbidden]
        D[404 Not Found]
        E[429 Rate Limited]
    end
    subgraph "500 Errors"
        F[500 Server Error]
        G[502 Bad Gateway]
        H[503 Unavailable]
    end
```

## Diagnostic Commands

Useful commands for debugging:

```bash
# Check version
package-name --version

# Verify configuration
package-name config validate

# Test connection
package-name ping

# Debug mode
DEBUG=* package-name command
```

## Connection Troubleshooting

```mermaid
sequenceDiagram
    participant You
    participant CLI
    participant API
    
    You->>CLI: Run command
    CLI->>API: Connect
    
    alt Success
        API-->>CLI: 200 OK
        CLI-->>You: ✓ Connected
    else Timeout
        API--xCLI: Timeout
        CLI-->>You: ✗ Connection timeout
        Note over You,CLI: Check network/firewall
    else Auth Error
        API-->>CLI: 401 Unauthorized
        CLI-->>You: ✗ Invalid API key
        Note over You,CLI: Regenerate API key
    end
```

## Getting Help

If you're still experiencing issues:

1. **Search existing issues:** [GitHub Issues](https://github.com/org/repo/issues)
2. **Community support:** [Discord](https://discord.gg/example)
3. **Contact support:** [support@example.com](mailto:support@example.com)

When reporting an issue, include:
- Error message (full stack trace)
- Package version (`package-name --version`)
- Environment (OS, Node version, etc.)
- Steps to reproduce
```

## Mermaid Diagram Guidelines

### Decision Trees

Help users find their issue:

```mermaid
flowchart TD
    A{What's happening?}
    A -->|Can't install| B[Check Node version >= 18]
    A -->|Can't connect| C[Check API key]
    A -->|Slow performance| D[Check rate limits]
    A -->|Unexpected results| E[Check request params]
    
    B --> B1[npm cache clean]
    C --> C1[Regenerate key]
    D --> D1[Implement caching]
    E --> E1[Enable debug mode]
```

### Error Code Reference

```mermaid
flowchart LR
    subgraph Client["Client Errors (4xx)"]
        A[400] --> A1[Bad Request]
        B[401] --> B1[Unauthorized]
        C[403] --> C1[Forbidden]
        D[404] --> D1[Not Found]
        E[429] --> E1[Rate Limited]
    end
    subgraph Server["Server Errors (5xx)"]
        F[500] --> F1[Server Error]
        G[502] --> G1[Bad Gateway]
        H[503] --> H1[Unavailable]
    end
```

### Retry Logic

```mermaid
flowchart TD
    A[Request] --> B{Success?}
    B -->|Yes| C[Done]
    B -->|No| D{Retryable?}
    D -->|No| E[Fail]
    D -->|Yes| F{Retries < 3?}
    F -->|No| E
    F -->|Yes| G[Wait with backoff]
    G --> A
```

## Guidelines

- Use exact error messages as headings (searchable)
- Provide copy-paste solutions
- Include diagnostic commands
- Explain the "why" not just the "how"
- Link to support channels
- **Use decision trees** to guide users to solutions
- **Use sequence diagrams** for debugging flows
- **Use flowcharts** for retry/error handling logic
