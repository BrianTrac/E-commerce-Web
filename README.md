# E-commerce-Web

# E-commerce-Web

A full-stack e-commerce web application built with ReactJS, Redux, Tailwind CSS (frontend), and Node.js/Express (backend).

## Features

- User authentication and authorization
- Product browsing and search
- Shopping cart and checkout
- Order management
- Admin dashboard
- Responsive design with Tailwind CSS

## Project Structure

```
.
├── client/   # Frontend (ReactJS, Redux, Tailwind)
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── config/
│       ├── helpers/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── redux/
│       ├── service/
│       └── utils/
└── server/   # Backend (Node.js, Express)
    ├── config/
    ├── controllers/
    ├── logs/
    ├── middlewares/
    ├── models/
    ├── routes/
    ├── services/
    └── utils/
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/E-commerce-Web.git
   cd E-commerce-Web
   ```

2. **Install dependencies:**

   - For the frontend:

     ```sh
     cd client
     npm install
     ```

   - For the backend:
     ```sh
     cd ../server
     npm install
     ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env` in both `client/` and `server/` and fill in the required values.

### Running the Application

- **Start the backend server:**

  ```sh
  cd server
  npm start
  ```

- **Start the frontend development server:**
  ```sh
  cd client
  npm start
  ```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:5000` (default ports).

## Scripts

- `client/package.json`:

  - `npm start` – Start React development server
  - `npm run build` – Build for production

- `server/package.json`:
  - `npm start` – Start Express server

## License

This project is licensed under the MIT License.
