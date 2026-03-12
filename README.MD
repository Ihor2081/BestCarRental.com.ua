# DriveAway - Premium Car Rental Platform

DriveAway is a modern, full-stack car rental platform built with **Next.js** for the frontend and **FastAPI** for the backend. It features a sleek, responsive design and a robust API for managing vehicle listings and bookings.

## 🚀 Features

- **Dynamic Car Listings**: Browse available vehicles with category and price information.
- **Detailed Product Pages**: View specific car details, specifications, and select additional services.
- **Admin Dashboard**:
  - **Real-time Analytics**: Monitor monthly revenue, total bookings, and customer engagement.
  - **Fleet Management**: Full CRUD operations for vehicles with status tracking and image management.
  - **Booking Control**: Centralized view of all rentals with status filtering and search.
  - **Customer Insights**: Detailed profiles with booking history and financial summaries.
  - **Support Integration**: Quick access to technical support via a dedicated Discord community modal.
- **User Profile Management**:
  - **Personal Information**: View and manage account details.
  - **Booking History**: Track upcoming and completed rentals.
  - **Payment Methods**: Manage saved cards with a dedicated modal for adding new ones.
- **JWT-Based Authentication**: Secure user registration and login using JWT tokens and bcrypt password hashing.
- **Protected Routes**: User profiles and booking features are protected and require a valid session.
- **Dynamic UI**: Header and navigation adapt in real-time to the user's authentication state.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Clean UI**: Modern aesthetic with subtle animations and clear typography.

## 🛠️ Tech Stack

**Backend**: [FastAPI](https://fastapi.tiangolo.com/) (Python), [Passlib](https://passlib.readthedocs.io/) (Auth), [python-jose](https://python-jose.readthedocs.io/) (JWT)
- **Database**: [MySQL](https://www.mysql.com/)
- **ORM**: [SQLAlchemy](https://www.sqlalchemy.org/) (Async)
- **Frontend**: 
  - [Next.js](https://nextjs.org/) (React Framework)
  - [Tailwind CSS](https://tailwindcss.com/) (Styling)
  - [Framer Motion](https://www.framer.com/motion/) (Animations)
  - [Lucide React](https://lucide.dev/) (Icons)

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /register`: Register a new user account.
- `POST /login`: Authenticate user and return a JWT access token.

### Vehicles & Fleet
- `GET /api/cars`: Retrieve a list of all available cars for rental.
- `GET /api/fleet`: Get detailed fleet information (Admin).

### Management (Admin)
- `GET /api/admin/dashboard`: Real-time business analytics and trends.
- `GET /api/admin/cars`: Full fleet list with booking counts.
- `POST /api/admin/cars`: Add a new vehicle to the fleet.
- `PUT /api/admin/cars/{id}`: Update vehicle details or status.
- `DELETE /api/admin/cars/{id}`: Remove a vehicle (protected against active bookings).
- `GET /api/admin/bookings`: List all bookings with search and status filters.
- `GET /api/admin/users`: List all customers with spending and booking stats.
- `GET /api/admin/settings`: Manage business profile (synced with admin user profile).
- `POST /api/admin/change-password`: Securely update admin credentials.

### System
- `GET /db-status`: Check the health of the MySQL database connection.

## 📂 Project Structure

```text
├── backend/
│   ├── main.py               # FastAPI application and API routes
│   ├── auth.py               # Contains the authentication logic
│   ├── admin.py              # Modular router for all administrative functions and dashboard analytics.
│   ├── database.py           # Async SQLAlchemy engine & session setup
│   ├── models.py             # Database models
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example          # Environment variables template

├── frontend/
│   ├── src/
│   │   ├── app/                             # Next.js App Router (pages & layouts)
│   │   │   ├── about/
│   │   │   │   └── page.tsx                 # About page
│   │   │   ├── admin/
│   │   │   │   └── page.tsx                 # Admin dashboard page
│   │   │   ├── product/
│   │   │   │   └── page.tsx                 # Product details page
│   │   │   ├── profile/
│   │   │   │   └── page.tsx                 # User profile page
│   │   │   ├── globals.css                  # Global styles
│   │   │   ├── layout.tsx                   # Root layout
│   │   │   └── page.tsx                     # Home page
│   │   │
│   │   ├── components/                      # Reusable React components
│   │   │   ├── admin/
│   │   │   │   ├── CarModal.tsx             # Form for adding and editing fleet vehicles.
│   │   │   │   ├── CustomerDetailModal.tsx  # Detailed customer profile and history view.
│   │   │   │   ├── SupportModal.tsx         # Discord support integration modal.
│   │   │   │   └── ChangePasswordModal.tsx  # Secure admin password management.
│   │   │   ├── CarCard.tsx                  # Car display card component
│   │   │   ├── AuthModal.tsx                # A unified modal for user registration and login.
│   │   │   └── Header.tsx                   # Navigation header
│   │   │
│   │   └── types/
│   │       └── index.ts                     # TypeScript type definitions
│   │
│   ├── next-env.d.ts                        # Next.js TypeScript definitions
│   ├── next.config.js                       # Next.js configuration
│   ├── postcss.config.mjs                   # PostCSS configuration
│   ├── tailwind.config.ts                   # Tailwind CSS configuration
│   ├── tsconfig.json                        # TypeScript configuration
│   ├── package.json                         # Frontend dependencies & scripts
│   └── package-lock.json                    # Frontend lockfile
├── package.json                             # Root workspace configuration
├── package-lock.json                        # Root lockfile
├── metadata.json                            # Application metadata
├── car_sharing.sql                          # Database backup
└── README.md                                # Project documentation
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
