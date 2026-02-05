# Hotel Management API - Postman Test Guide

## Overview
This guide provides comprehensive instructions for testing the Hotel Management endpoints using Postman. The API includes both public and admin-restricted operations for managing hotels in the Tour Guide - Cultural Discovery application.

---

## Prerequisites

1. **Postman Installation**: Download from [postman.com](https://www.postman.com/downloads/)
2. **Server Running**: Ensure the Spring Boot server is running (typically on `http://localhost:8080`)
3. **Authentication**: Have admin credentials ready for restricted endpoints

---

## Environment Setup in Postman

### Step 1: Create a New Environment
1. Open Postman
2. Click **Environments** on the left sidebar
3. Click **Create New Environment**
4. Name it: `Hotel Management Local`
5. Add the following variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:8080` | `http://localhost:8080` |
| `admin_token` | `(empty)` | `(leave for later)` |
| `user_token` | `(empty)` | `(leave for later)` |
| `hotel_id` | `(empty)` | `(leave for later)` |

6. Save the environment

### Step 2: Create a New Collection
1. Click **Collections** on the left sidebar
2. Click **Create New Collection**
3. Name it: `Hotel Management Tests`
4. Select the environment you created

---

## Authentication (Prerequisites for Admin Endpoints)

Before testing admin-restricted endpoints, you must authenticate and get a token.

### Get Admin Token
**Endpoint**: `POST {{base_url}}/api/auth/login`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "username": "admin",
  "password": "admin_password"
}
```

**Response** (Example):
```json
{
  "id": "admin_user_id",
  "username": "admin",
  "email": "admin@example.com",
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "roles": ["ADMIN"]
}
```

**After receiving response**:
1. Copy the `token` value
2. Go to **Environments** → Select your environment
3. Set `admin_token` to the copied token value
4. Click **Save**

---

## API Endpoints

### 1. Get All Hotels (Public)

**Method**: `GET`  
**Endpoint**: `{{base_url}}/api/hotels`  
**Authentication**: Not required

**Headers**:
```
Content-Type: application/json
```

**Request Body**: None

**Expected Response** (200 OK):
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "The Grand Hotel",
    "description": "Luxury 5-star hotel in the heart of the city",
    "address": "123 Main Street, Colombo, Sri Lanka",
    "phones": ["+94112345678", "+94112345679"],
    "whatsapp": "+94712345678",
    "email": "info@grandhotel.lk",
    "website": "https://www.grandhotel.lk",
    "amenities": ["WiFi", "Swimming Pool", "Gym", "Restaurant", "Spa"],
    "imageUrls": [
      "https://example.com/hotel1.jpg",
      "https://example.com/hotel2.jpg"
    ],
    "latitude": 6.9271,
    "longitude": 80.7744,
    "isPaid": true,
    "createdAt": "2026-01-15T10:30:00",
    "createdById": "admin_id_123",
    "createdByUsername": "admin"
  }
]
```

**Common Response Codes**:
- `200 OK`: Hotels retrieved successfully
- `500 Internal Server Error`: Database connection issue

---

### 2. Get Hotel by ID (Public)

**Method**: `GET`  
**Endpoint**: `{{base_url}}/api/hotels/{hotelId}`  
**Authentication**: Not required

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `hotelId` | string | MongoDB ObjectId or hotel identifier |

**Example URL**: `http://localhost:8080/api/hotels/507f1f77bcf86cd799439011`

**Headers**:
```
Content-Type: application/json
```

**Request Body**: None

**Expected Response** (200 OK):
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "The Grand Hotel",
  "description": "Luxury 5-star hotel in the heart of the city",
  "address": "123 Main Street, Colombo, Sri Lanka",
  "phones": ["+94112345678"],
  "whatsapp": "+94712345678",
  "email": "info@grandhotel.lk",
  "website": "https://www.grandhotel.lk",
  "amenities": ["WiFi", "Swimming Pool", "Gym"],
  "imageUrls": ["https://example.com/hotel1.jpg"],
  "latitude": 6.9271,
  "longitude": 80.7744,
  "isPaid": true,
  "createdAt": "2026-01-15T10:30:00",
  "createdById": "admin_id_123",
  "createdByUsername": "admin"
}
```

**Common Response Codes**:
- `200 OK`: Hotel found
- `404 Not Found`: Hotel not found
- `500 Internal Server Error`: Server error

**Error Response Example** (404):
```json
{
  "error": "Hotel not found"
}
```

---

### 3. Get Nearby Hotels (Public)

**Method**: `GET`  
**Endpoint**: `{{base_url}}/api/hotels/near`  
**Authentication**: Not required

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `lat` | number | Yes | - | Latitude of search center |
| `lng` | number | Yes | - | Longitude of search center |
| `radiusKm` | number | No | 10 | Search radius in kilometers |

**Example URL**: 
```
http://localhost:8080/api/hotels/near?lat=6.9271&lng=80.7744&radiusKm=5
```

**Headers**:
```
Content-Type: application/json
```

**Request Body**: None

**Expected Response** (200 OK):
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "The Grand Hotel",
    "description": "Luxury 5-star hotel in the heart of the city",
    "address": "123 Main Street, Colombo, Sri Lanka",
    "phones": ["+94112345678"],
    "whatsapp": "+94712345678",
    "email": "info@grandhotel.lk",
    "website": "https://www.grandhotel.lk",
    "amenities": ["WiFi", "Swimming Pool", "Gym"],
    "imageUrls": ["https://example.com/hotel1.jpg"],
    "latitude": 6.9271,
    "longitude": 80.7744,
    "isPaid": true,
    "createdAt": "2026-01-15T10:30:00",
    "createdById": "admin_id_123",
    "createdByUsername": "admin"
  },
  {
    "id": "607f1f77bcf86cd799439012",
    "name": "Lakeside Resort",
    "description": "Peaceful resort near the lake",
    "address": "45 Lake Road, Colombo, Sri Lanka",
    "phones": ["+94119876543"],
    "whatsapp": "+94719876543",
    "email": "info@lakesideresort.lk",
    "website": "https://www.lakesideresort.lk",
    "amenities": ["Lake View", "Restaurant", "Water Sports"],
    "imageUrls": ["https://example.com/resort1.jpg"],
    "latitude": 6.9300,
    "longitude": 80.7760,
    "isPaid": true,
    "createdAt": "2026-01-20T14:45:00",
    "createdById": "admin_id_123",
    "createdByUsername": "admin"
  }
]
```

**Common Response Codes**:
- `200 OK`: Nearby hotels found
- `400 Bad Request`: Invalid latitude/longitude
- `500 Internal Server Error`: Server error

**Test Cases**:
1. Test with different radius values (1km, 5km, 10km, 25km)
2. Test with coordinates of different cities
3. Test with missing required parameters

---

### 4. Create Hotel (Admin Only)

**Method**: `POST`  
**Endpoint**: `{{base_url}}/api/hotels`  
**Authentication**: Required (Admin role)

**Headers**:
```
Content-Type: application/json
Authorization: Bearer {{admin_token}}
```

**Request Body**:
```json
{
  "name": "New Luxury Hotel",
  "description": "A beautiful 5-star luxury hotel with world-class amenities",
  "address": "789 Park Avenue, Kandy, Sri Lanka",
  "phones": ["+94812345678", "+94812345679"],
  "whatsapp": "+94702345678",
  "email": "contact@newhotel.lk",
  "website": "https://www.newhotel.lk",
  "amenities": [
    "WiFi",
    "Swimming Pool",
    "Gym",
    "Restaurant",
    "Spa",
    "Concierge",
    "Business Center"
  ],
  "imageUrls": [
    "https://example.com/new-hotel-1.jpg",
    "https://example.com/new-hotel-2.jpg",
    "https://example.com/new-hotel-3.jpg"
  ],
  "latitude": 7.2906,
  "longitude": 80.6337
}
```

**Expected Response** (200 OK):
```json
{
  "id": "707f1f77bcf86cd799439013",
  "name": "New Luxury Hotel",
  "description": "A beautiful 5-star luxury hotel with world-class amenities",
  "address": "789 Park Avenue, Kandy, Sri Lanka",
  "phones": ["+94812345678", "+94812345679"],
  "whatsapp": "+94702345678",
  "email": "contact@newhotel.lk",
  "website": "https://www.newhotel.lk",
  "amenities": [
    "WiFi",
    "Swimming Pool",
    "Gym",
    "Restaurant",
    "Spa",
    "Concierge",
    "Business Center"
  ],
  "imageUrls": [
    "https://example.com/new-hotel-1.jpg",
    "https://example.com/new-hotel-2.jpg",
    "https://example.com/new-hotel-3.jpg"
  ],
  "latitude": 7.2906,
  "longitude": 80.6337,
  "isPaid": false,
  "createdAt": "2026-01-31T10:00:00",
  "createdById": "admin_id_123",
  "createdByUsername": "admin"
}
```

**After receiving response**:
1. Copy the `id` value
2. Update your environment: Set `hotel_id` to the copied ID
3. Use this ID for update and delete operations

**Common Response Codes**:
- `200 OK`: Hotel created successfully
- `400 Bad Request`: Validation error (see error details)
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User does not have ADMIN role
- `500 Internal Server Error`: Server error

**Validation Errors** (400):
```json
{
  "error": "Validation failed",
  "details": {
    "name": "Hotel name is required",
    "description": "Description is required",
    "address": "Address is required",
    "latitude": "Latitude is required",
    "longitude": "Longitude is required"
  }
}
```

**Authentication Errors**:
- `401 Unauthorized`:
```json
{
  "error": "Unauthorized: Missing or invalid token"
}
```

- `403 Forbidden`:
```json
{
  "error": "Forbidden: Admin access required"
}
```

**Test Cases**:
1. Create hotel with all fields
2. Create hotel with only required fields (phones, whatsapp, email, website optional)
3. Test with missing required fields
4. Test with invalid coordinates
5. Test without authentication token
6. Test with non-admin token

---

### 5. Update Hotel (Admin Only)

**Method**: `PUT`  
**Endpoint**: `{{base_url}}/api/hotels/{hotelId}`  
**Authentication**: Required (Admin role)

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `hotelId` | string | MongoDB ObjectId of hotel to update |

**Headers**:
```
Content-Type: application/json
Authorization: Bearer {{admin_token}}
```

**Request Body** (All fields optional - send only fields to update):
```json
{
  "name": "Updated Hotel Name",
  "description": "Updated description with new amenities",
  "address": "New Address, City, Country",
  "phones": ["+94112233445"],
  "whatsapp": "+94701122334",
  "email": "newemail@hotel.lk",
  "website": "https://www.updatedhotel.lk",
  "amenities": [
    "WiFi",
    "Swimming Pool",
    "Gym",
    "Restaurant",
    "Spa",
    "Conference Hall"
  ],
  "imageUrls": [
    "https://example.com/updated-hotel-1.jpg",
    "https://example.com/updated-hotel-2.jpg"
  ],
  "latitude": 6.9271,
  "longitude": 80.7744,
  "isPaid": true
}
```

**Example URL**: 
```
PUT http://localhost:8080/api/hotels/707f1f77bcf86cd799439013
```

**Expected Response** (200 OK):
```json
{
  "id": "707f1f77bcf86cd799439013",
  "name": "Updated Hotel Name",
  "description": "Updated description with new amenities",
  "address": "New Address, City, Country",
  "phones": ["+94112233445"],
  "whatsapp": "+94701122334",
  "email": "newemail@hotel.lk",
  "website": "https://www.updatedhotel.lk",
  "amenities": [
    "WiFi",
    "Swimming Pool",
    "Gym",
    "Restaurant",
    "Spa",
    "Conference Hall"
  ],
  "imageUrls": [
    "https://example.com/updated-hotel-1.jpg",
    "https://example.com/updated-hotel-2.jpg"
  ],
  "latitude": 6.9271,
  "longitude": 80.7744,
  "isPaid": true,
  "createdAt": "2026-01-15T10:30:00",
  "createdById": "admin_id_123",
  "createdByUsername": "admin"
}
```

**Common Response Codes**:
- `200 OK`: Hotel updated successfully
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User does not have ADMIN role
- `404 Not Found`: Hotel not found
- `500 Internal Server Error`: Server error

**Error Response Examples**:

Not Found (404):
```json
{
  "error": "Hotel not found"
}
```

Validation Error (400):
```json
{
  "error": "Invalid latitude value"
}
```

**Test Cases**:
1. Update single field
2. Update multiple fields
3. Update with empty strings
4. Update coordinates to different location
5. Update amenities list
6. Mark hotel as paid (isPaid: true)
7. Update with invalid hotel ID
8. Update without authentication
9. Update with non-admin token

---

### 6. Delete Hotel (Admin Only)

**Method**: `DELETE`  
**Endpoint**: `{{base_url}}/api/hotels/{hotelId}`  
**Authentication**: Required (Admin role)

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| `hotelId` | string | MongoDB ObjectId of hotel to delete |

**Example URL**: 
```
DELETE http://localhost:8080/api/hotels/707f1f77bcf86cd799439013
```

**Headers**:
```
Content-Type: application/json
Authorization: Bearer {{admin_token}}
```

**Request Body**: None

**Expected Response** (200 OK):
```json
{
  "message": "Hotel deleted successfully!"
}
```

**Common Response Codes**:
- `200 OK`: Hotel deleted successfully
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User does not have ADMIN role
- `404 Not Found`: Hotel not found
- `500 Internal Server Error`: Server error

**Error Responses**:

Not Found (404):
```json
{
  "error": "Hotel not found"
}
```

Unauthorized (401):
```json
{
  "error": "Unauthorized: Missing or invalid token"
}
```

**Test Cases**:
1. Delete existing hotel
2. Delete non-existent hotel
3. Delete without authentication
4. Delete with non-admin token
5. Verify hotel is deleted by trying to get it

---

## Testing Workflows

### Workflow 1: Complete Hotel Management Cycle

1. **Authenticate**
   - GET admin token using login endpoint

2. **Create Hotel**
   - POST new hotel with all details
   - Save the returned hotel ID

3. **Retrieve Hotel**
   - GET hotel by ID
   - Verify all details match

4. **Get All Hotels**
   - GET all hotels
   - Verify new hotel appears in list

5. **Find Nearby Hotels**
   - GET nearby hotels with coordinates
   - Verify new hotel appears in results

6. **Update Hotel**
   - PUT update some fields
   - Verify changes

7. **Delete Hotel**
   - DELETE the hotel
   - Verify deletion

8. **Verify Deletion**
   - Try to GET deleted hotel
   - Should return 404

---

### Workflow 2: Validation Testing

1. **Test Missing Required Fields**
   - Try creating without name
   - Try creating without latitude/longitude
   - Verify 400 Bad Request with error details

2. **Test Invalid Data Types**
   - Send string for latitude
   - Send invalid coordinates
   - Verify appropriate error

3. **Test Optional Fields**
   - Create with only required fields
   - Verify optional fields are null/empty

---

### Workflow 3: Location-Based Testing

1. **Get Hotels in Colombo**
   - Query: `lat=6.9271&lng=80.7744&radiusKm=5`

2. **Get Hotels in Kandy**
   - Query: `lat=7.2906&lng=80.6337&radiusKm=10`

3. **Get Hotels in Galle**
   - Query: `lat=6.0535&lng=80.2210&radiusKm=8`

4. **Test Different Radius Values**
   - 1km, 5km, 10km, 25km, 50km

---

### Workflow 4: Authorization Testing

1. **Test Public Endpoints** (No auth needed)
   - GET /api/hotels ✓
   - GET /api/hotels/{id} ✓
   - GET /api/hotels/near ✓

2. **Test Admin Endpoints Without Token**
   - POST /api/hotels - Should return 401

3. **Test Admin Endpoints with Invalid Token**
   - Use random string as token - Should return 401

4. **Test Admin Endpoints with Non-Admin User Token**
   - Use regular user token - Should return 403

5. **Test Admin Endpoints with Valid Admin Token**
   - All should succeed ✓

---

## Postman Collection Template

Create requests with these settings:

### Template: Public GET Request
```
GET {{base_url}}/api/hotels
Content-Type: application/json
```

### Template: Admin POST/PUT Request
```
POST/PUT {{base_url}}/api/hotels
Content-Type: application/json
Authorization: Bearer {{admin_token}}
```

### Template: Admin DELETE Request
```
DELETE {{base_url}}/api/hotels/{{hotel_id}}
Content-Type: application/json
Authorization: Bearer {{admin_token}}
```

---

## Common Issues and Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Missing/invalid token | Authenticate first, copy token to environment variable |
| 403 Forbidden | Non-admin user | Ensure using admin account credentials |
| 404 Not Found | Wrong hotel ID | Copy correct ID from previous create/list response |
| 400 Bad Request | Missing required fields | Check request body has name, description, address, lat, lng |
| 500 Server Error | Database connection | Ensure MongoDB is running and connected |
| CORS Error | Cross-origin request | Server has CORS enabled, should work with Postman |
| Empty Response | No hotels in database | Create a hotel first using POST endpoint |
| Timeout | Server not responding | Check if server is running on http://localhost:8080 |

---

## API Response Status Codes

| Code | Status | Meaning |
|------|--------|---------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data or validation failed |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | User lacks required permissions/role |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server-side error |

---

## Sample Test Data

### Colombo Hotels
```json
{
  "name": "Grand Oriental Hotel",
  "description": "Historic 5-star hotel in downtown Colombo",
  "address": "130 Galle Road, Colombo 03, Sri Lanka",
  "phones": ["+94112598000"],
  "whatsapp": "+94701234567",
  "email": "reservations@grandoriental.lk",
  "website": "https://www.grandoriental.lk",
  "amenities": ["WiFi", "Swimming Pool", "Fitness Center", "Business Center", "Restaurant"],
  "imageUrls": ["https://example.com/oriental1.jpg"],
  "latitude": 6.9271,
  "longitude": 80.7744
}
```

### Kandy Hotels
```json
{
  "name": "Kandy Serena Hotel",
  "description": "Luxury resort overlooking the Lake",
  "address": "Annex Street, Kandy, Sri Lanka",
  "phones": ["+94812223601"],
  "whatsapp": "+94702223601",
  "email": "info@kandyserena.lk",
  "website": "https://www.kandyserena.lk",
  "amenities": ["Lake View", "Restaurant", "Spa", "Cultural Tours"],
  "imageUrls": ["https://example.com/kandy1.jpg"],
  "latitude": 7.2906,
  "longitude": 80.6337
}
```

### Galle Hotels
```json
{
  "name": "Galle Fort Hotel",
  "description": "Historic hotel within the ancient fortress",
  "address": "Church Street, Galle Fort, Sri Lanka",
  "phones": ["+94912222816"],
  "whatsapp": "+94702222816",
  "email": "info@galleforthotel.lk",
  "website": "https://www.galleforthotel.lk",
  "amenities": ["Historic Fort View", "Restaurant", "Bar", "Heritage Tours"],
  "imageUrls": ["https://example.com/galle1.jpg"],
  "latitude": 6.0535,
  "longitude": 80.2210
}
```

---

## Advanced Testing Tips

### 1. Using Postman Pre-request Scripts
Add this to automatically set hotel_id from create response:
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("hotel_id", jsonData.id);
}
```

### 2. Using Postman Tests
Add assertions to validate responses:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has hotel ID", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.id).to.be.a('string');
});

pm.test("Hotel name matches request", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.name).to.equal(pm.environment.get("hotel_name"));
});
```

### 3. Batch Testing with Collection Runner
1. Select collection
2. Click "Run" icon
3. Select environment
4. Run all requests in sequence
5. View test results

### 4. Performance Testing
- Monitor response times
- Test with large image URL arrays
- Test with 100+ nearby hotels

---

## Export/Import Collection

### To Export:
1. Right-click collection → Export
2. Choose format (JSON v2.1 recommended)
3. Save file

### To Import:
1. Click Import button
2. Select file
3. Collection will be imported

---

## Quick Reference Card

| Operation | Method | Endpoint | Auth |
|-----------|--------|----------|------|
| List all hotels | GET | `/api/hotels` | No |
| Get hotel details | GET | `/api/hotels/{id}` | No |
| Find nearby hotels | GET | `/api/hotels/near?lat=x&lng=y` | No |
| Create hotel | POST | `/api/hotels` | Admin |
| Update hotel | PUT | `/api/hotels/{id}` | Admin |
| Delete hotel | DELETE | `/api/hotels/{id}` | Admin |

---

## Notes

- All timestamps are in ISO 8601 format
- Hotel IDs are MongoDB ObjectIds (24-character hex strings)
- Latitude/longitude use decimal format (±180 degrees)
- All endpoints support Cross-Origin requests
- Database automatically creates audit fields (createdAt, createdById, createdByUsername)
- Images should be valid HTTPS URLs
- Amenities and phones are stored as arrays/lists
- isPaid field indicates payment status of hotel listing

---

**Last Updated**: January 31, 2026  
**API Version**: 1.0  
**Framework**: Spring Boot with MongoDB
