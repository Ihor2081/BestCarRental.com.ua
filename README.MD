# DriveAway - Premium Car Rental Platform

DriveAway is a modern, full-stack car rental platform built with **Next.js** for the frontend and **FastAPI** for the backend. It features a sleek, responsive design and a robust API for managing vehicle listings and bookings.

## 🚀 Features

- **Dynamic Car Listings**: Browse available vehicles with category and price information.
- **Detailed Product Pages**: View specific car details, specifications, and select additional services.
- **User Profile Management**:
  - **Personal Information**: View and manage account details.
  - **Booking History**: Track upcoming and completed rentals.
  - **Payment Methods**: Manage saved cards with a dedicated modal for adding new ones.
- **Simulated Authorization**: A secure-feeling login experience using modal windows and session storage.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Clean UI**: Modern aesthetic with subtle animations and clear typography.

## 🛠️ Tech Stack

- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **Database**: [MySQL](https://www.mysql.com/)
- **ORM**: [SQLAlchemy](https://www.sqlalchemy.org/) (Async)
- **Frontend**: 
  - [Next.js](https://nextjs.org/) (React Framework)
  - [Tailwind CSS](https://tailwindcss.com/) (Styling)
  - [Framer Motion](https://www.framer.com/motion/) (Animations)
  - [Lucide React](https://lucide.dev/) (Icons)

## 📂 Project Structure

```text
├── backend/
│   ├── main.py               # FastAPI application and API routes
│   ├── database.py           # Async SQLAlchemy engine & session setup
│   ├── models.py             # Database models
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example          # Environment variables template

├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js App Router (pages & layouts)
│   │   │   ├── about/
│   │   │   │   └── page.tsx  # About page
│   │   │   ├── admin/
│   │   │   │   └── page.tsx  # Admin dashboard page
│   │   │   ├── product/
│   │   │   │   └── page.tsx  # Product details page
│   │   │   ├── profile/
│   │   │   │   └── page.tsx  # User profile page
│   │   │   ├── globals.css   # Global styles
│   │   │   ├── layout.tsx    # Root layout
│   │   │   └── page.tsx      # Home page
│   │   │
│   │   ├── components/       # Reusable React components
│   │   │   ├── CarCard.tsx   # Car display card component
│   │   │   └── Header.tsx    # Navigation header
│   │   │
│   │   └── types/
│   │       └── index.ts      # TypeScript type definitions
│   │
│   ├── next-env.d.ts         # Next.js TypeScript definitions
│   ├── next.config.js        # Next.js configuration
│   ├── postcss.config.mjs    # PostCSS configuration
│   ├── tailwind.config.ts    # Tailwind CSS configuration
│   ├── tsconfig.json         # TypeScript configuration
│   ├── package.json          # Frontend dependencies & scripts
│   └── package-lock.json     # Frontend lockfile
├── package.json              # Root workspace configuration
├── package-lock.json         # Root lockfile
├── metadata.json             # Application metadata
├── car_sharing.sql           # Database backup
└── README.md                 # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Python (3.9+)
- MySQL (or compatible database)

### Installation

1. Install root dependencies:
   ```bash
   npm install
   ```

2. Install frontend dependencies:
   ```bash
   npm install --workspace=frontend
   ```

3. Install backend dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

### Running the Application

To start both the frontend and backend in development mode:

```bash
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check:** http://localhost:8000/db-status
- **Cars Data:** http://localhost:8000/api/cars

## 📄 License

This project is private and intended for internal use.
