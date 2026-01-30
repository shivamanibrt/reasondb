# API Reference Template

Use this structure when creating API endpoint documentation.

## Format

```mdx
---
title: [HTTP Method] [Endpoint Name]
description: [Brief description of what this endpoint does]
---

## Endpoint

<ParamField method="POST" path="/v1/resource">
  Brief description of the endpoint's purpose.
</ParamField>

## Request Flow

Visualize the API flow with a sequence diagram:

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Auth
    participant Database
    
    Client->>API: POST /v1/resource
    API->>Auth: Validate token
    Auth-->>API: Valid
    API->>Database: Create resource
    Database-->>API: resource_id
    API-->>Client: 201 Created
```

## Authentication

<Note>
This endpoint requires [authentication type]. Include your API key in the `Authorization` header.
</Note>

## Request

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | Bearer token or API key |
| `Content-Type` | Yes | `application/json` |

### Path Parameters

<ParamField path="id" type="string" required>
  The unique identifier of the resource.
</ParamField>

### Query Parameters

<ParamField query="limit" type="integer" default="20">
  Maximum number of results to return.
</ParamField>

### Request Body

<ParamField body="name" type="string" required>
  The name of the resource.
</ParamField>

<ParamField body="metadata" type="object">
  Optional metadata object.
</ParamField>

## Response

### Success Response (200)

```json
{
  "id": "res_123",
  "name": "Example",
  "created_at": "2026-01-24T10:00:00Z"
}
```

### Error Responses

| Status | Code | Description |
|--------|------|-------------|
| 400 | `invalid_request` | Request validation failed |
| 401 | `unauthorized` | Invalid or missing API key |
| 404 | `not_found` | Resource not found |

## Error Flow

```mermaid
flowchart TD
    A[Request] --> B{Valid Auth?}
    B -->|No| C[401 Unauthorized]
    B -->|Yes| D{Valid Body?}
    D -->|No| E[400 Bad Request]
    D -->|Yes| F{Resource Exists?}
    F -->|No| G[404 Not Found]
    F -->|Yes| H[200 Success]
```

## Code Examples

<CodeGroup>
```bash cURL
curl -X POST https://api.example.com/v1/resource \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "Example"}'
```

```typescript TypeScript
const response = await client.resource.create({
  name: "Example"
});
```

```python Python
response = client.resource.create(
    name="Example"
)
```
</CodeGroup>
```

## Mermaid Diagram Guidelines

### Sequence Diagrams for API Flows

Show the complete request lifecycle:

```mermaid
sequenceDiagram
    participant C as Client
    participant G as Gateway
    participant A as Auth
    participant S as Service
    participant D as Database
    
    C->>G: Request
    G->>A: Validate
    A-->>G: Token valid
    G->>S: Forward
    S->>D: Query
    D-->>S: Data
    S-->>G: Response
    G-->>C: JSON
```

### Error Handling Flow

```mermaid
flowchart TD
    A[API Request] --> B{Rate Limited?}
    B -->|Yes| C[429 Too Many Requests]
    B -->|No| D{Authenticated?}
    D -->|No| E[401 Unauthorized]
    D -->|Yes| F{Authorized?}
    F -->|No| G[403 Forbidden]
    F -->|Yes| H{Valid Request?}
    H -->|No| I[400 Bad Request]
    H -->|Yes| J[Process Request]
    J --> K{Success?}
    K -->|Yes| L[200 OK]
    K -->|No| M[500 Server Error]
```

### Webhook Flow

```mermaid
sequenceDiagram
    participant Your API
    participant DevDoc
    participant Your Server
    
    Your API->>DevDoc: Event occurs
    DevDoc->>Your Server: POST /webhook
    Your Server->>Your Server: Verify signature
    Your Server->>Your Server: Process event
    Your Server-->>DevDoc: 200 OK
```

### State Transitions

```mermaid
stateDiagram-v2
    [*] --> pending
    pending --> processing: start_processing
    processing --> completed: success
    processing --> failed: error
    failed --> processing: retry
    completed --> [*]
    failed --> cancelled: cancel
    cancelled --> [*]
```

## Guidelines

- Always show request and response examples
- Include all possible error codes
- Provide examples in multiple languages
- Document rate limits if applicable
- **Use sequence diagrams** for complex flows
- **Use flowcharts** for error handling logic
- **Use state diagrams** for resource lifecycles
