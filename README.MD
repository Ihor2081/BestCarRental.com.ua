# DriveAway - Premium Car Rental Platform

DriveAway is a modern, full-stack car rental platform built with **Next.js** for the frontend and **FastAPI** for the backend. It features a sleek, responsive design and a robust API for managing vehicle listings and bookings.

## 🚀 Features

- **Dynamic Car Listings**: Browse available vehicles with category and price information.
- **Advanced Filtering & Sorting**: Filter cars by price range, transmission, fuel type, passenger capacity, luggage space, and features. Sort by price, newest, or recommended.
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
  - **Booking History**: Track upcoming and completed rentals.
  - **Payment Methods**: Manage multiple saved cards with strict validation (16-digit numeric check and future expiration date enforcement) and the ability to delete existing ones.
- **JWT-Based Authentication**: Secure user registration and login using JWT tokens and bcrypt password hashing.
- **Protected Routes**: User profiles and booking features are protected and require a valid session.
- **Dynamic UI**: Header and navigation adapt in real-time to the user's authentication state.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Clean UI**: Modern aesthetic with subtle animations and clear typography.

## 🛠️ Tech Stack

- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) (Python), [Passlib](https://passlib.readthedocs.io/) (Auth), [python-jose](https://python-jose.readthedocs.io/) (JWT)
- **Database**: [MySQL](https://www.mysql.com/)
- **ORM**: [SQLAlchemy](https://www.sqlalchemy.org/) (Async)
- **Frontend**: 
  - [Next.js](https://nextjs.org/) (React Framework)
  - [Tailwind CSS](https://tailwindcss.com/) (Styling)
  - [Framer Motion](https://www.framer.com/motion/) (Animations)
  - [Lucide React](https://lucide.dev/) (Icons)
  - [Recharts](https://recharts.org/) (Data Visualization)

## 🚀 Getting Started

Follow these steps to set up and run the project on your local machine.

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (3.9 or higher)
- **MySQL Server** (e.g., XAMPP, MySQL Installer, or Docker)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd driveaway-monorepo
```

### 2. Install Dependencies

Install root and workspace dependencies:
```bash
npm install
```

Install backend dependencies (it is recommended to use a virtual environment):
```bash
pip install -r backend/requirements.txt
```

### 3. Environment Configuration

1. Navigate to the `backend` directory.
2. Copy the `.env.example` file to a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and update the database credentials (`DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`) to match your local MySQL setup.

### 4. Database Setup

1. Create a new database in your MySQL server named `car_sharing` (or the name you specified in `.env`).
2. Run the database migrations to create the necessary tables:
   ```bash
   cd backend
   alembic upgrade head
   cd ..
   ```

   > **Note**: If you encounter an error like `Can't locate revision identified by '...'`, run `alembic stamp head` to sync your database version with the migration files, then try the upgrade again.

### 5. Running the Application

Start both the frontend and backend development servers using the root command:

```bash
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **API Documentation (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)

<<<<<<< Setup-Unit-Testing-Environment-#ID-15
### 6. Running Tests

The backend includes a suite of unit tests for services and schemas. To run them:

```bash
cd backend
pytest
```

For more details, see the [Backend Testing README](backend/tests/README.md).

### 🔍 Health Checks

You can verify the status of the application and database using these endpoints:

- **Backend Health**: [http://localhost:8000/api/health](http://localhost:8000/api/health)
- **Database Health**: [http://localhost:8000/db-status](http://localhost:8000/db-status)

---

=======
### 🔍 Health Checks

You can verify the status of the application and database using these endpoints:

- **Backend Health**: [http://localhost:8000/api/health](http://localhost:8000/api/health)
- **Database Health**: [http://localhost:8000/db-status](http://localhost:8000/db-status)

---

>>>>>>> main
## 📂 Project Structure

The project follows a monorepo architecture with a clear separation of concerns:

backend/
│
├── alembic.ini
├── requirements.txt
<<<<<<< Setup-Unit-Testing-Environment-#ID-15
├──tests/
│   ├── conftest.py          # Global fixtures and configuration
│   ├── test_schemas/        # Unit tests for Pydantic schemas
│   └── test_services/       # Unit tests for business logic (Service Layer)
=======
>>>>>>> main
├── migrations/ # Alembic database migration scripts.
│   ├── versions/
│   │   ├── .keep
│   │   ├── 0001_initial_schema.py
│   │   ├── 0002_add_password_reset_codes.py
│   │   ├── 0003_add_email_verification.py
│   │   ├── a6cec37fc2b6_message.py
│   │   └── b643f49beec7_add_cards_table.py
│   ├── env.py
│   ├── README.MD
│   └── script.py
├── static/
│   ├── uploads/
│   │   └──cars/ # Storage for dynamic assets (car photos uploaded via Admin).
├── app/ # Main application package.
│   ├── main.py # Application entry point and middleware configuration.
│   │
│   ├── core/ # Core configuration, security (JWT, hashing), and dependencies.
│   │   ├── config.py
│   │   ├── security.py
│   │   └── dependencies.py
│   │
│   ├── models/ # SQLAlchemy database models.
│   │   ├── user.py
│   │   ├── car.py
│   │   ├── booking.py
│   │   ├── discount.py
│   │   └── service.py
│   │
│   ├── schemas/ # Pydantic models for request/response validation and serialization.
│   │   ├── user.py
│   │   ├── auth.py
│   │   ├── car.py
│   │   ├── booking.py
│   │   └── admin.py
│   │
│   ├── repositories/ # Data access layer for CRUD operations.
│   │   ├── user_repository.py
│   │   ├── car_repository.py
│   │   ├── booking_repository.py
│   │   └── admin_repository.py
│   │
│   ├── services/ # Business logic layer that orchestrates repositories and models.
│   │   ├── auth_service.py
│   │   ├── user_service.py
│   │   ├── car_service.py
│   │   ├── booking_service.py
│   │   ├── admin_service.py
│   │   └── email_service.py
│   │
│   ├── api/ # API route handlers (routers) organized by resource.
│   │   ├── auth_router.py
│   │   ├── user_router.py
│   │   ├── car_router.py
│   │   ├── booking_router.py
│   │   └── admin_router.py
│   │
│   └── db/ # Database connection setup and base model definitions.
│       ├── database.py
│       └── base.py
frontend/
│
├── public/
│   ├── static/    
│   │   ├── about/
│   │   │   ├── our-team.jpg
│   │   │   └── .keep  
│   │   └── .keep  
│   └── .keep    
├── src/
│   ├── app/                     # Pages, layouts, and route handlers.
│   │   ├── admin/
│   │   ├── profile/
│   │   ├── product/
│   │   └── ...
│   ├── components/  # Reusable UI components (buttons, modals, cards).
│   │   └── ...
│   ├── features/     # Feature-specific components and logic (e.g., admin dashboard, car catalog).
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── cars/
│   │   ├── admin/
│   │   ├── bookings/
│   │   ├── users/
│   │   └── payments/
│   │
│   ├── shared/       # Shared utilities, constants, and hooks.
│   │   ├── components/
│   │   ├── ui/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── constants/
│   │   └── api/
│   │       ├── client.ts
│   │       └── interceptors.ts
│   │
│   ├── store/                   # Client-side state management using Zustand.
│   │   └── auth.store.ts
│   │
│   └── types/                   # Global TypeScript type definitions.
├── metadata.json
├── package.json
├── package-lock.json
├── .gitignore
└── README.MD


---

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /register`: Register a new user account.
- `POST /login`: Authenticate user and return a JWT access token.
- `POST /forgot-password`: Request a password reset code via email.
- `POST /reset-password`: Reset password using a verification code.
- `POST /verify-email`: Verify user email using a 6-digit code.
- `POST /resend-verification`: Resend the email verification code.

### User Profile (`/api/users`)
- `GET /me`: Fetch current user profile with booking history and payment methods.
- `PUT /me`: Update user personal information.
- `POST /change-password`: Update account password (requires current password).
- `POST /cards`: Add a new payment card to the user's profile.
- `DELETE /cards/{card_id}`: Remove a specific payment card.

### Cars Catalog (`/api/cars` & `/api/catalog`)
- `GET /`: List all vehicles with advanced filtering (price, transmission, etc.) and pagination.
- `GET /makes`: Retrieve a list of all available car brands.
- `GET /categories`: Retrieve a list of all car categories.
- `GET /{car_id}`: Fetch detailed information for a specific vehicle.

### Bookings (`/api/bookings`)
- `POST /`: Create a new car rental booking.
- `GET /`: List all bookings for the authenticated user.
- `GET /{booking_id}`: Get detailed information for a specific booking.
- `POST /{booking_id}/cancel`: Cancel an existing booking.

### Services (`/api/services`)
- `GET /`: List all available additional services (Insurance, GPS, etc.).

### Management (Admin) (`/api/admin`)
- **Dashboard**:
  - `GET /stats`: Business analytics, revenue trends, and booking summaries.
- **Fleet**:
  - `GET /cars`: List all vehicles in the fleet.
  - `POST /cars`: Add a new vehicle to the catalog.
  - `PUT /cars/{car_id}`: Update vehicle specifications or status.
  - `DELETE /cars/{car_id}`: Remove a vehicle from the fleet.
  - `POST /cars/upload`: Upload a physical photo for a vehicle.
- **Bookings**:
  - `GET /bookings`: Centralized view of all system bookings with filters.
- **Customers**:
  - `GET /users`: List all registered customers with search.
  - `GET /users/{user_id}`: View detailed customer profile and history.
- **Discounts**:
  - `GET /discounts`: List all rental duration discounts.
  - `POST /discounts`: Create a new discount rule.
  - `PUT /discounts/{id}`: Update an existing discount.
  - `DELETE /discounts/{id}`: Remove a discount rule.
- **Services**:
  - `GET /services`: Manage additional services catalog.
  - `POST /services`: Add a new service.
  - `PUT /services/{id}`: Update service details.
  - `DELETE /services/{id}`: Remove a service.
- **Settings**:
  - `GET /settings`: Retrieve admin profile settings.
  - `POST /settings`: Update admin profile.
  - `POST /change-password`: Securely change admin password.

### System
- `GET /api/health`: Check if the backend is reachable.
- `GET /db-status`: Check the database connection health.


## 📄 License

This project is private and intended for internal use.