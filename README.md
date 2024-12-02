---


---
# Wezire Wallet Backend

## Overview

The **Wezire Wallet Backend** provides a secure and scalable server-side infrastructure for the Wezire Wallet application. It is built with **Node.js**, **TypeScript**, and **MongoDB** to handle authentication, transactions, and wallet management.

## Features

- **User Authentication**:
  - Secure user registration and login.
  - JWT-based authentication and session management.
- **Wallet Management**:
  - Add money to the wallet.
  - View wallet balance.
- **Money Transactions**:
  - Send money to other users.
  - Request money from other users.
  - Approve or decline money requests.
- **Transaction History**: Log and retrieve all transactions for a user.
- **Database Transactions**:
  - Utilizes MongoDB transactions (sessions) to ensure data consistency.

## Tech Stack

- **Node.js**: Backend runtime environment.
- **TypeScript**: Provides type safety and maintainable code.
- **Express.js**: Handles API routing.
- **MongoDB**: Database for storing user and transaction data.
- **Mongoose**: ODM for MongoDB.
- **JWT**: For secure user authentication.
- **Bcrypt**: For password hashing.

## Installation

### Prerequisites

- **Node.js** (v14 or later)
- **MongoDB** (or MongoDB Atlas for a cloud-based solution)

### Steps to Install

1. **Clone the repository:**

   ```bash
   git clone <repository_url>
   cd <project_directory>
   ```
2. **Install dependencies:**

   ```bash
   npm install
   ```
3. **Set up MongoDB:**

   If using MongoDB locally, make sure the MongoDB server is running.
   For MongoDB Atlas, create a cluster and obtain your connection string.
4. **Environment variables:**
   Create a .env file in the root directory and add the following:

   ```bash
    DB_URL = <your_mongo_connection_string>
    PORT = 3000
    JWT_SECRET = <your_jwt_secret>
    EMAIL = <your_email> 
    EMAIL_PASSWORD = <your_password>
   ```
5. **Run the server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### **Authentication**

#### **POST** `/api/v1/auth/register`

Register a new user.

- **Request Body**:

  ```json
  {
    "firstName": "firstname",
    "lastName":"lastname",
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:

  ```json
  {
    "message": "User registered successfully"
  }
  ```
- **Description**: This endpoint allows users to proceed in the email-verification process.

#### **POST** `/api/v1/auth/verify-user`

User with Valid Otp Verify themself and store the data into DB.

- **Request Body**:

  ```json
  {
    "otp":value
  }
  ```
- **Response**:

  ```json
  {
    success: true,
    message: "User successfully verified and registered! You can now log in.",
  }
  ```
- **Description**: This endpoint allows users to store their data into the DB.

#### **POST** `/api/v1/auth/login`

Login and obtain a JWT token.

- **Request Body**:

  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:

  ```json
  {
    "token": "jwt_token_here"
  }
  ```
- **Description**: This endpoint allows users to login using their email and password. Upon successful login, a **JWT token** is generated and stored as a cookie, which is required to authenticate further requests.

---

## File Hierarchy

Below is the structure of the project directory, including the key files and their purposes:
   ```bash

├── src 
│   ├── config
│   │   └── dbConnect.ts                     # Database connection setup
│   ├── controllers
│   │   ├── addBalance.ts                    # user can add money to their wallet
│   │   ├── checkBalance.ts                  # checking balance 
│   │   ├── getAccountNumber.ts              # getting account number
│   │   ├── getAllRequestMoney.ts            # getting request money
│   │   ├── getUserDetails.ts                # getting user details
│   │   ├── requestMoney.ts                  # request money 
│   │   └── sendMoney.ts                     # send money
│   │   ├── showAllTransactions.ts           # show all the transactions
│   │   ├── userAuth.ts                      # user authentication    
│   ├── middleware
│   │   ├── authMiddleware.ts                # Middleware for authentication
│   │   └── ratelimiterMiddleware.ts         # Rate limiting middleware
│   ├── models
│   │   ├── userModel.ts                     # User Model (Mongoose schema)
│   │   ├── userRequestMoneyModel.ts         # Request Money Model (Mongoose schema)
│   │   ├── userTransactions.ts              # Transaction model (Mongoose schema)
│   │   ├── userWallet.ts                    # wallet model (Mongoose schema)
│   ├── routes
│   │   ├── AuthRoutes.ts                    # Routes for users authentication
│   │   └── wallet.ts                        # Routes for wallet components
│   ├── utils
│   │   └── sendMail.ts                      # Utility for sending emails
│   └── index.ts                             # Main entry point to the app
├── .gitignore                               # Specifies files and directories to be ignored by Git
├── package-lock.json                        # Automatically generated file that locks down dependencies
├── package.json                             # Project metadata and dependencies
├── README.md                                # Project documentation
└── tsconfig.json                            # TypeScript configuration file
```


### Other Important Files

- **`.env`**: Contains environment-specific variables such as the MongoDB connection string and JWT secret key.
- **`package.json`**: Contains metadata about the project, such as dependencies, scripts, and project information.
- **`tsconfig.json`**: Configuration file for TypeScript, defining compiler options and file includes.
- **`README.md`**: This file contains project documentation.