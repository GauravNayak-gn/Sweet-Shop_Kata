# Sweet Shop Management System - TDD Kata

This project is a full-stack web application built as part of a Test-Driven Development (TDD) kata. It serves as a management system for a sweet shop, featuring a complete RESTful backend API and a modern, responsive React frontend. The system allows customers to browse, search, and purchase sweets, while providing administrators with tools to manage the inventory.

The backend was built following a strict "Red-Green-Refactor" TDD cycle, which is reflected in the Git commit history. The entire project emphasizes clean coding practices, modern development workflows, and the responsible use of AI as a development partner.

## Features

*   **User Authentication**: Secure user registration and login using JWT (JSON Web Tokens).
*   **Role-Based Access Control**: Distinct permissions for regular customers and administrators.
*   **Product Catalog**: View all available sweets with details like price and stock quantity.
*   **Dynamic Search & Filter**: Search for sweets by name, category, and price range.
*   **Inventory Management**:
    *   Customers can purchase sweets, which decrements the stock.
    *   Admins can add, update, and delete sweets from the catalog.
    *   Admins can restock items, increasing their quantity.
*   **Modern Frontend**: A responsive and visually appealing single-page application (SPA) built with React and Vite.
*   **Robust Backend**: A RESTful API built with Node.js, Express, and PostgreSQL.


## Tech Stack

*   **Backend**: Node.js, Express.js, PostgreSQL, JWT, bcryptjs
*   **Frontend**: React, Vite, Axios, React Router
*   **Testing**: Jest, Supertest

## Setup and Installation

Follow these instructions to set up and run the project locally.

### Prerequisites

*   Node.js (v18 or later)
*   npm (v9 or later)
*   PostgreSQL


### 1. Backend Setup

Navigate to the backend directory and set up the environment.

```bash
# From the project root
cd backend

# Install dependencies
npm install

# Create the environment file
cp .env.example .env
```

Now, open the newly created `.env` file and update the database credentials and JWT secret to match your local setup.

```env
# .env file in /backend
PORT=5000
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sweet_shop
DB_TEST_NAME=sweet_shop_test
JWT_SECRET=your_super_strong_and_long_secret_key
```

### 2. Frontend Setup

Navigate to the frontend directory.

```bash
# From the project root
cd frontend

# Install dependencies
npm install
```

The frontend is configured to connect to the backend at `http://localhost:5000`. No `.env` file is needed for the default setup.

## Running the Application

You will need two separate terminal windows to run the backend and frontend servers simultaneously.

**Terminal 1: Start the Backend Server**

```bash
# From the /backend directory
npm run dev
```
The API server should now be running on `http://localhost:5000`.

**Terminal 2: Start the Frontend Development Server**

```bash
# From the /frontend directory
npm start 
# Or if you used Vite:
npm run dev
```
The React application should now be running and will open automatically in your browser at `http://localhost:5173` (or another port if 5173 is busy).

## Running Tests

All tests are located in the backend. To run the test suite and see the coverage report:

```bash
# From the /backend directory
npm test
```

## My AI Usage

In compliance with the project's AI Usage Policy, this section details how AI tools were leveraged throughout the development process.

**AI Tools Used:**
*   **ChatGPT **
*   **Gemini 2.5Pro**

**How I Used Them:**
1.  **Project Planning & Scaffolding**: I used ChatGPT to help structure the initial project plan and generate the directory structure. It provided the initial `npm install` commands and a boilerplate `package.json` structure, which saved significant setup time.

2.  **Boilerplate Code Generation**: For new features, especially on the backend, I used AI to generate the boilerplate for Express controllers, services, and routes. For example, I prompted: "Create an Express controller and service for handling user registration with fields: username, email, password." I then manually implemented the core business logic, such as password hashing and database interaction.

3.  **TDD Test Generation**: GitHub Copilot was instrumental in speeding up the TDD process. After writing a descriptive test name like `it('should return 403 if a regular user tries to delete a sweet')`, Copilot would often suggest a near-perfect implementation of the test case using `supertest`, which I would then review and adapt.

4.  **Complex Logic Assistance**: For the backend's sweet search functionality, I needed to build a dynamic SQL query that could handle multiple optional parameters. I used ChatGPT to help architect the service function that safely constructs this query using parameterized inputs to prevent SQL injection.

5.  **Frontend Component Creation**: I used AI to generate the basic structure for React components. For instance, for the `SweetFormModal`, I described the required input fields and props (`sweet`, `onSave`, `onCancel`), and it generated a functional component with state management using `useState` and `useEffect`, which I then styled and integrated.

6.  **Debugging and Explanation**: When I encountered an error or a concept I was less familiar with (like the `useCallback` hook for optimization), I used ChatGPT as a tutor. I would paste the code and ask, "Why is this code causing an infinite loop?" or "Explain the purpose of the dependency array in this `useEffect` hook." This was crucial for turning the AI-generated code into my own knowledge.
