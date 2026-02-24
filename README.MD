# DriveAway - Car Rental Platform

DriveAway is a modern car rental platform built with a FastAPI backend and a clean, responsive frontend using vanilla HTML, CSS, and JavaScript.

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
- **Database**: [MySQL](https://www.mysql.com/) (via XAMPP)
- **ORM**: [SQLAlchemy](https://www.sqlalchemy.org/) (Async)
- **Frontend**: 
  - Vanilla HTML5
  - Modular CSS3 (Split by feature for maintainability)
  - Vanilla JavaScript (ES6+)
- **Icons**: [Lucide Icons](https://lucide.dev/)

## 📂 Project Structure

```text
├── backend/
│   ├── main.py             # FastAPI application and routes
│   ├── database.py         # SQLAlchemy async engine and session setup
│   ├── models.py           # Database models (User, Car, Deal)
│   ├── requirements.txt    # Python dependencies (FastAPI, SQLAlchemy, aiomysql)
│   └── .env.example        # Template for environment variables
├── frontend/
│   ├── static/
│   │   ├── css/            # Split CSS files
│   │   └── js/             # Frontend logic and interactions
│   ├── index.html          # Home page
│   ├── product.html        # Car details page
│   ├── profile.html        # User profile page
│   ├── about.html          # About Us page
│   └── admin.html          # Admin Dashboard
└── car_shering.sql         # DB backup
└── README.MD               # Project documentation
```

## 🔌 API Endpoints

### Frontend Routes
- `GET /`: Serves the Home page (`index.html`).
- `GET /product`: Serves the Car Details page (`product.html`).
- `GET /profile`: Serves the User Profile page (`profile.html`).
- `GET /about`: Serves the About Us page (`about.html`).
- `GET /admin`: Serves the Admin Dashboard (`admin.html`).

### Data Endpoints
- `GET /api/cars`: Returns a JSON list of available cars from the database.
- `GET /db-status`: Health check endpoint to verify the MySQL connection.

## API Testing

Once the server is running, visit:
- **API Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/db-status
- **Cars Data:** http://localhost:8000/api/cars

## 🏁 Getting Started

### Prerequisites

- Python 3.9+
- MySQL (XAMPP recommended)
- `pip` (Python package manager)

### Installation & Setup

1. **Database Setup**:
   - Start **Apache** and **MySQL** in your XAMPP Control Panel.
   - Open [phpMyAdmin](http://localhost/phpmyadmin/).
   - Create a new database named `car_sharing`.
   - Import the `car_sharing.sql` backup file into the `car_sharing` database.

2. **Environment Configuration**:
   - Navigate to the `backend/` directory.
   - Create a `.env` file based on `.env.example`:
     ```bash
     cp backend/.env.example backend/.env
     ```
   - Update the `.env` file with your MySQL credentials (default XAMPP is `root` with no password).

3. **Install Dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

4. **Run the Application**:
   ```bash
   python backend/main.py
   ```

5. **Verify Connection**:
   - Open `http://localhost:8000/db-status` in your browser to ensure the database is connected.
   - Navigate to `http://localhost:8000` to use the platform.

## 📝 Usage Notes

- **Authorization**: The "Profile" button triggers an authorization modal. Use any email/password to "log in" (simulated via `sessionStorage`).
- **Admin page**: Use link `http://localhost:8000/admin` to check out admin page.
- **Navigation**: Use the header links to move between Home, About, and Profile pages.
- **Modals**: The "Add New Payment Method" button on the Profile -> Payment tab opens a functional modal window.
