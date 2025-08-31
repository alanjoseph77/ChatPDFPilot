# API Documentation

## Base URL
```
http://localhost:8080
```

## Endpoints

### PDF Management

#### Upload PDF
```http
POST /api/upload
Content-Type: multipart/form-data
```

**Request Body:**
- `file`: PDF file (multipart/form-data)

**Response:**
```json
{
  "id": "string",
  "filename": "string",
  "uploadedAt": "string",
  "size": "number"
}
```

#### Get Documents
```http
GET /api/documents
```

**Response:**
```json
[
  {
    "id": "string",
    "filename": "string",
    "uploadedAt": "string",
    "size": "number"
  }
]
```

#### Delete Document
```http
DELETE /api/documents/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

### Chat & AI

#### Generate Summary
```http
POST /api/summarize/:id
```

**Response:**
```json
{
  "summary": "string",
  "keyPoints": ["string"],
  "suggestedQuestions": ["string"]
}
```

#### Chat with Document
```http
POST /api/chat/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "string"
}
```

**Response:**
```json
{
  "response": "string",
  "timestamp": "string"
}
```

## WebSocket Events

### Connection
```javascript
const ws = new WebSocket('ws://localhost:8080');
```

### Events

#### Send Message
```json
{
  "type": "message",
  "documentId": "string",
  "message": "string"
}
```

#### Receive Response
```json
{
  "type": "response",
  "message": "string",
  "timestamp": "string"
}
```

#### Error
```json
{
  "type": "error",
  "message": "string"
}
```

## Error Responses

All endpoints return errors in the following format:
```json
{
  "error": "string",
  "message": "string",
  "statusCode": "number"
}
```

### Common Error Codes
- `400` - Bad Request (invalid input)
- `404` - Not Found (document not found)
- `413` - Payload Too Large (file too big)
- `422` - Unprocessable Entity (invalid file type)
- `500` - Internal Server Error
