---
name: import-api-spec
description: Import and configure API specification (OpenAPI, GraphQL, AsyncAPI) for documentation
---

## Instructions

When importing an API specification:

### Step 1: Detect Spec Type

| File Pattern | Type | Version |
|--------------|------|---------|
| `openapi.json/yaml` | OpenAPI | 3.x |
| `swagger.json/yaml` | Swagger | 2.0 |
| `schema.graphql` | GraphQL | - |
| `asyncapi.json/yaml` | AsyncAPI | 2.x/3.x |
| `*.proto` | Protobuf/gRPC | - |

### Step 2: Validate & Process

1. Validate spec syntax
2. Check for $ref resolution issues
3. Identify auth schemes
4. Extract server URLs

### Step 3: Generate Documentation

For OpenAPI/Swagger:
```
api-reference/
├── openapi.json          # Cleaned/validated spec
├── introduction.mdx      # API overview from info
├── authentication.mdx    # From securitySchemes
├── errors.mdx           # From error response schemas
└── rate-limiting.mdx    # If x-rateLimit extension exists
```

For GraphQL:
```
api-reference/
├── schema.graphql       # Schema file
├── introduction.mdx     # Overview
├── authentication.mdx   # Auth guide
├── queries.mdx          # Query documentation
├── mutations.mdx        # Mutation documentation
└── subscriptions.mdx    # If subscriptions exist
```

### Step 4: Update docs.json

Add appropriate tab configuration:

```json
// OpenAPI
{
  "tab": "API Reference",
  "type": "openapi",
  "path": "/api-reference",
  "spec": "api-reference/openapi.json",
  "groups": [
    {
      "group": "Overview",
      "pages": [
        "api-reference/introduction",
        "api-reference/authentication"
      ]
    }
  ]
}
```

```json
// GraphQL
{
  "tab": "GraphQL API", 
  "type": "graphql",
  "path": "/graphql-api",
  "schema": "api-reference/schema.graphql",
  "endpoint": "https://api.example.com/graphql"
}
```

### Step 5: Generate Supporting Pages

#### introduction.mdx
```mdx
---
title: "API Introduction"
description: "Overview of the {API Name}"
---

{Description from spec info}

## Base URL

Production: `{server URL}`

## Authentication

{Summary of auth methods}

See [Authentication](/api-reference/authentication) for details.
```

#### authentication.mdx
```mdx
---
title: "Authentication"
description: "How to authenticate API requests"
---

{Content based on securitySchemes}
```
