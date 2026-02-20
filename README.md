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
- **Frontend**: 
  - Vanilla HTML5
  - Modular CSS3 (Split by feature for maintainability)
  - Vanilla JavaScript (ES6+)

## 📂 Project Structure

```text
├── backend/
│   ├── main.py             # FastAPI application and routes
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── static/
│   │   ├── css/            # Split CSS files
│   │   │   ├── common.css  # Global styles and utilities
│   │   │   ├── home.css    # Home page specific styles
│   │   │   ├── product.css # Product page specific styles
│   │   │   ├── profile.css # Profile page specific styles
│   │   │   ├── about.css   # About page specific styles
│   │   │   └── modals.css  # Shared modal styles
│   │   └── js/
│   │       └── script.js   # Frontend logic and interactions
│   │   └── Images/
│   ├── index.html          # Home page
│   ├── product.html        # Car details page
│   ├── profile.html        # User profile page
│   └── about.html          # About Us page
└── README.MD               # Project documentation
```

## 🔌 API Endpoints

### Frontend Routes
- `GET /`: Serves the Home page (`index.html`).
- `GET /product`: Serves the Car Details page (`product.html`).
- `GET /profile`: Serves the User Profile page (`profile.html`).
- `GET /about`: Serves the About Us page (`about.html`).

### Data Endpoints
- `GET /api/cars`: Returns a JSON list of available cars with their IDs, names, and daily rates.

## 🏁 Getting Started

### Prerequisites

- Python 3.7+
- FastAPI
- Uvicorn

### Installation

1. Install the required dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

2. Run the development server:
   ```bash
   python backend/main.py
   ```

3. Open your browser and navigate to `http://localhost:8000`.

## 📝 Usage Notes

- **Authorization**: The "Profile" button triggers an authorization modal. Use any email/password to "log in" (simulated via `sessionStorage`).
- **Navigation**: Use the header links to move between Home, About, and Profile pages.
- **Modals**: The "Add New Payment Method" button on the Profile -> Payment tab opens a functional modal window.
