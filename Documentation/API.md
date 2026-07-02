# API Documentation

## Base URL
```
https://localhost:7001/api
```

## Authentication
All endpoints (except `/auth/login` and `/auth/register`) require JWT Bearer token:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /auth/login
Login with credentials.

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "string",
    "refreshToken": "string",
    "expiresIn": 3600,
    "user": {
      "id": 1,
      "username": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string"
    }
  }
}
```

#### POST /auth/register
Register new user.

**Request:**
```json
{
  "username": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "password": "string"
}
```

#### POST /auth/refresh
Refresh access token.

**Request:**
```json
{
  "refreshToken": "string"
}
```

#### POST /auth/logout
Logout and revoke refresh tokens.

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Data Items

#### GET /data
Get all data items for logged-in user.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "string",
      "value": 100.00,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": null
    }
  ]
}
```

#### GET /data/{id}
Get specific data item.

#### POST /data
Create new data item.

**Request:**
```json
{
  "name": "string",
  "value": 100.00
}
```

#### PUT /data/{id}
Update data item.

**Request:**
```json
{
  "name": "string",
  "value": 100.00
}
```

#### DELETE /data/{id}
Delete data item.

### User

#### GET /user/profile
Get current user profile.

#### PUT /user/profile
Update user profile.

**Request:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string"
}
```

#### POST /user/change-password
Change user password.

**Request:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid input",
  "errors": ["error1", "error2"]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```
