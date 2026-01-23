# Ticket Booking API with Redis Locks

A Node.js Express API for managing seat bookings with distributed locking using Redis. This system prevents double-booking by implementing time-based locks on seats.

## Features

- **Distributed Locking**: Uses Redis to ensure only one user can book a seat at a time
- **Time-Based Expiry**: Seat locks automatically expire after 60 seconds
- **Conflict Detection**: Returns clear error messages when seats are already locked
- **RESTful API**: Simple HTTP endpoints for booking operations

## Tech Stack

- **Node.js** with Express 5
- **Redis** for distributed locking
- **CORS** enabled for cross-origin requests
- **ES Modules** for modern JavaScript syntax

## Project Structure

```
4c/
├── index.js                      # Main application entry point
├── client.js                     # Redis client configuration
├── controllers/
│   └── booking.controller.js     # Booking business logic
├── models/
│   └── seat.model.js            # Seat locking data layer
└── routes/
    └── booking.routes.js        # API route definitions
```

## Installation (pnpm only)

1. Clone the repository:
```bash
git clone <repository-url>
cd 4c
```

2. Install dependencies with pnpm:
```bash
pnpm install
```

3. Configure Redis connection in `client.js` with your Redis instance credentials

## Usage (pnpm only)

### Start the Server

**Development mode** (with auto-reload):
```bash
pnpm dev
```

**Production mode**:
```bash
pnpm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Book a Seat

**POST** `/api/book`

Books a seat with a distributed lock that expires in 60 seconds.

**Request Body:**
```json
{
  "seat_number": "A12"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Seat A12 booked successfully. Lock active for 1 minute.",
  "bookingId": 1737654321000,
  "seat_number": "A12",
  "expires_in": 60
}
```

**Conflict Response (409):**
```json
{
  "success": false,
  "error": "Seat A12 is currently locked.",
  "try_again_in_seconds": 45
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "seat_number is required"
}
```

## How It Works (Detailed)

### Request Flow
1. **HTTP Request**: The client sends a POST request to `/api/book` with a `seat_number` in the JSON body.
2. **Validation**: The controller checks that `seat_number` exists. Missing values return a 400 error.
3. **Lock Attempt**: The model tries to acquire a Redis lock for the seat using a unique key.
4. **Success Path**:
  - If the lock is acquired, a booking response is returned immediately.
  - The lock expires automatically after 60 seconds so the seat is released if no further action occurs.
5. **Conflict Path**:
  - If the lock already exists, the API fetches the remaining TTL.
  - The response includes how many seconds to wait before retrying.
6. **Error Path**: Any unexpected error returns a 500 with a generic message.

### Redis Locking Details

- **Lock Key Format**: `seat_lock:<seat_number>` (for example, `seat_lock:A12`).
- **Atomic Lock**: The lock uses Redis `SET` with the `NX` flag to ensure it is only created if it does not already exist.
- **Expiry**: The lock uses `EX 60` so Redis will automatically delete it after 60 seconds.
- **TTL Retrieval**: If a lock exists, `TTL` is used to report how much time remains.

### Why This Prevents Double-Booking

Redis guarantees that the `SET` with `NX` is atomic, so only the first request can create the lock. All concurrent requests for the same seat will fail to acquire the lock and receive a conflict response, which eliminates race conditions that would otherwise allow double booking.

## Redis Configuration

The application uses Redis Cloud with the following connection settings:
- Host: `redis-13365.c330.asia-south1-1.gce.cloud.redislabs.com`
- Port: `13365`
- Connection timeout: 20 seconds

**Note**: Update the credentials in `client.js` with your own Redis instance.

## Development

### File Paths

The project uses path aliases with `@/` prefix for cleaner imports:
- `@/client.js` → Redis client
- `@/models/seatModel.js` → Seat locking functions
- `@/controllers/bookingController.js` → Request handlers

## License

ISC