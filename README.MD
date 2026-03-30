# DriveAway - Premium Car Rental Platform

DriveAway is a modern, full-stack car rental platform built with **Next.js** for the frontend and **FastAPI** for the backend. It features a sleek, responsive design and a robust API for managing vehicle listings and bookings.

## 🚀 Features

- **Dynamic Car Listings**: Browse available vehicles with category and price information.
**Advanced Filtering & Sorting**: Filter cars by price range, transmission, fuel type, passenger capacity, luggage space, and features. Sort by price, newest, or recommended.
- **Detailed Product Pages**: View specific car details, specifications, and select additional services.
- **Admin Dashboard**:
  - **Real-time Analytics**: Monitor monthly revenue, total bookings, and customer engagement.
  - **Fleet Management**: Full CRUD operations for vehicles with status tracking and **physical photo upload** support.
  - **Booking Control**: Centralized view of all rentals with status filtering and search.
  - **Customer Insights**: Detailed profiles with booking history and financial summaries.
  - **Features & Discounts**: Manage rental duration discounts and additional services (insurance, GPS, etc.) with dynamic icons.
  - **Support Integration**: Quick access to technical support via a dedicated Discord community modal.
- **User Profile Management**:
  - **Personal Information**: View and manage account details.
  - **Email Verification**: Secure registration flow with 6-digit email verification codes.
  - **Password Management**: 
    - Securely update account credentials with current password verification.
    - **Forgot Password**: Self-service password recovery via email verification codes.
  - **Password Management**: Securely update account credentials with current password verification.
  - **Booking History**: Track upcoming and completed rentals.
  - **Payment Methods**: Manage saved cards with strict validation (16-digit numeric check and future expiration date enforcement).
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
  - [Recharts](https://recharts.org/) (Data Visualization)

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /register`: Register a new user account (triggers verification email).
- `POST /login`: Authenticate user and return a JWT access token (requires verified email).
- `POST /verify-email`: Verify user email using a 6-digit code.
- `POST /resend-verification`: Resend the email verification code (rate-limited).
- `POST /forgot-password`: Request a password reset code via email (rate-limited).
- `POST /reset-password`: Reset password using a valid verification code.

### User Profile (`/api/users`)
- `GET /me`: Retrieve current user profile, stats, and booking history.
- `PUT /me`: Update personal information and card details.
- `POST /change-password`: Securely update user password.
- `POST /cards`: Add or update payment card (validated for 16 digits and future expiry).
- `DELETE /cards/{id}`: Clear saved payment information.

### Vehicles & Fleet
 `GET /api/cars`: Retrieve a list of all available cars for rental with support for filtering, sorting, and pagination.
- `GET /api/fleet`: Get detailed fleet information (Admin).

### Management (Admin)
- `GET /api/admin/dashboard`: Real-time business analytics and trends.
- `GET /api/admin/cars`: Full fleet list with booking counts.
- `POST /api/admin/cars`: Add a new vehicle to the fleet.
- `POST /api/admin/cars/upload`: Upload a physical photo for a vehicle (saved to `frontend/public/cars`).
- `PUT /api/admin/cars/{id}`: Update vehicle details or status.
- `DELETE /api/admin/cars/{id}`: Remove a vehicle (protected against active bookings).
- `GET /api/admin/bookings`: List all bookings with search and status filters.
- `GET /api/admin/users`: List all customers with spending and booking stats.
- `GET /api/admin/settings`: Manage business profile (synced with admin user profile).
- `GET /api/admin/users/{id}`: Retrieve detailed customer profile and booking history.
- `GET /api/admin/discounts`: List all rental duration discounts.
- `POST /api/admin/discounts`: Create a new rental discount.
- `PUT /api/admin/discounts/{id}`: Update an existing discount.
- `DELETE /api/admin/discounts/{id}`: Remove a discount.
- `GET /api/admin/services`: List all additional rental services.
- `POST /api/admin/services`: Create a new additional service.
- `PUT /api/admin/services/{id}`: Update an existing service.
- `DELETE /api/admin/services/{id}`: Remove a service.
- `GET /api/admin/settings`: Retrieve business profile settings.
- `PUT /api/admin/settings`: Update business profile (synced with admin user profile).
- `POST /api/admin/change-password`: Securely update admin credentials.
- `POST /api/admin/change-password`: Securely update admin credentials.

### System
- `GET /db-status`: Check the health of the MySQL database connection.

## 📂 Project Structure

```text
├── backend/
│   ├── main.py               # FastAPI application and API routes
│   ├── alembic.ini           # Configuration file for Alembic migrations.
│   ├── migrations/           # Directory containing Alembic migration scripts and environment setup.
│   ├── auth.py               # Contains the authentication logic
│   ├── users.py              # Manages user profile data, statistics, and payment information. Includes strict validation for card numbers and expiration dates.
│   └── admin.py              # Modular router for all administrative functions and dashboard analytics.
│   ├── database.py           # Async SQLAlchemy engine & session setup
│   ├── models.py             # Database models
│   ├── email_service.py      #  Handles sending transactional emails for verification and password resets.
│   ├── requirements.txt      # Python dependencies
│   └── .env.example          # Environment variables template

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
│   │   │   │   ├── DiscountModal.tsx        # Interface for managing rental duration discounts.
│   │   │   │   ├── ServiceModal.tsx         # Interface for managing additional services.
│   │   │   │   ├── SupportModal.tsx         # Discord support integration modal.
│   │   │   │   └── ChangePasswordModal.tsx  # Secure admin password management.
│   │   │   ├── profile/
│   │   │   │   ├── EditProfileModal.tsx     # Form for updating personal details and managing password changes.
│   │   │   │   └── CardModal.tsx            # Secure interface for adding payment cards with real-time validation.
│   │   │   ├── CarCard.tsx                  # Car display card component
│   │   │   ├── AuthModal.tsx                # A unified modal for user registration and login.
│   │   │   ├── VerifyEmailModal.tsx         # Secure interface for entering email verification codes.
│   │   │   ├── ForgotPasswordModal.tsx      # Interface for requesting password reset codes.
│   │   │   ├── ResetPasswordModal.tsx       # Form for setting a new password with code verification and cooldown timer.
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

### Database Migrations (Alembic)

To manage database schema changes, we use Alembic.

#### Writes a version
```bash
alembic stamp head
```

#### Reads a version
```bash
alembic current
```

#### Apply migrations
```bash
alembic upgrade head
```

#### Create new migration
```bash
alembic revision --autogenerate -m "message"
```

#### Rollback
```bash
alembic downgrade -1
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
