# Shipping API

This is a shipping API built with Node.js and SQLite. The API provides endpoints for user authentication, retrieving shipping rates, and creating shipments with tracking numbers.

Exclusively created for SandBox HSI, November 2024

## Features

- **User Authentication**: Register and log in to receive a Bearer token.
- **Shipping Rates**: Retrieve shipping rates based on origin, destination, and weight.
- **Create Shipment**: Generate a shipment with calculated costs and tracking numbers.
- **Tracking**: Track shipments with unique tracking numbers based on the date and running number format.

## Technologies Used

- **Node.js** with **Express** for the backend server
- **SQLite** as the database
- **JWT** for authentication
- **bcrypt** for password hashing

## Getting Started

### Prerequisites

- Node.js and npm installed on your local machine

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/spartacruz/shipping-api.git
   cd shipping-api
   ```

2. **Install Dependencies**:
    ```bash
   npm install
   ```

3. **Set Up Environment Variables**: Create a .env file in the root directory and add the following:
    ```bash
   ACCESS_TOKEN_SECRET=your_jwt_secret
   ```

4. **Run The Server**: Create a .env file in the root directory and add the following:
    ```bash
   npm run dev
   ```
   The server will run on http://localhost:3000.

### Database Setup
The database is set up automatically on the first run with tables for `Users`, `ShippingRates`, `Shipments`, and `Config`. Seed data for `ShippingRates` is also automatically inserted.

## API Endpoints

### 1. Authentication

#### [POST] `/api/v1/login`
Authenticate a user and return a Bearer token.

- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password"
  }
  ```

- **Response Body**:
  ```json
  {
    "status": "success",
    "user": {
        "name": "User Name",
        "email": "user@example.com"
    },
    "authorization": {
        "token": "jwt_token",
        "type": "bearer"
        }
  }   
  ```

### 2. Get Shipping Rates

#### [GET] `/api/v1/shipping/rates`
Retrieve available shipping rates based on origin, destination, and weight. Requires Bearer token authentication.

- **Query Parameters**:
  - `origin` (string): Origin location
  - `destination` (string): Destination location
  - `weight` (float): Weight in kilograms (e.g., `2.5`)

- **Example Request**:
  ```bash
  curl --location 'http://localhost:3000/api/v1/shipping/rates?origin=Jakarta&destination=Bandung&weight=2.5' \
  --header 'Authorization: Bearer your_token_here'
  ```

- **Response Body**:
  ```json
    {
        "status": "success",
        "rates": [
            {
                "id": 1,
                "origin": "Jakarta",
                "destination": "Bandung",
                "service": "standard",
                "rate": 10000,
                "calculatedRate": 25000,
                "estimated_delivery": "3-5 business days"
            },
            {
                "id": 2,
                "origin": "Jakarta",
                "destination": "Bandung",
                "service": "express",
                "rate": 20000,
                "calculatedRate": 50000,
                "estimated_delivery": "1-2 business days"
            }
        ]
    }
  ```


### 3. Create Shipment

#### [POST] `/api/v1/shipping/create`
Create a new shipment. Requires Bearer token authentication.

- **Request Body**:
  ```json
    {
        "origin": "Jakarta",
        "destination": "Bandung",
        "weight": 2.5,
        "service": "instant",
        "recipient": {
            "name": "John Doe",
            "phone": "0809899999",
            "email": "johndoe@example.com"
        }
    }
  ```

- **Response Body**:
  ```json
    {
        "status": "success",
        "shipmentId": 123,
        "trackingNumber": "AWB202311010001"
    }
  ```

## Project Structure

```plain
.
├── config
│   └── db.js              # Database configuration and setup
├── controllers
│   └── shippingController.js # Controller for shipping-related endpoints
├── middleware
│   └── authMiddleware.js   # Middleware for authentication
├── models
│   ├── Config.js           # Model for config data
│   ├── Shipment.js         # Model for shipment data
│   └── ShippingRate.js     # Model for shipping rate data
├── routes
│   └── shippingRoutes.js   # Route definitions for shipping API
├── .env                    # Environment variables
├── package.json            # Package configuration
└── README.md               # Project documentation
```

## Notes
- **Bearer Token**: Ensure to pass the Bearer token in the headers for authenticated requests.
- **Date Formatting for Tracking Numbers**: Tracking numbers follow the format `AWB{YYYYMMDD}{runningNumber}`.
- **Configurable Weight Limits**: The weight limits are stored in the Config table as `maxWeight` and `minWeight`.`

## License
This project is open source and free for everone to fork.

## Author
Yuri - November 2024