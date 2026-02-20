const cars = [
  {
    id: 1,
    name: "Mercedes-Benz E-Class",
    category: "Sedan",
    price: 120,
    img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Range Rover Sport",
    category: "SUV",
    price: 180,
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Porsche 911 Carrera",
    category: "Sports",
    price: 350,
    img: "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Tesla Model 3",
    category: "Electric",
    price: 95,
    img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Toyota Corolla",
    category: "Compact",
    price: 65,
    img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "BMW Z4 Roadster",
    category: "Convertible",
    price: 200,
    img: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=2070&auto=format&fit=crop"
  }
];

const grid = document.getElementById("carGrid");

if (grid) {
  cars.forEach(car => {
    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => {
      window.location.href = "/product";
    };

    card.innerHTML = `
      <img src="${car.img}" alt="${car.name}">
      <div class="card-body">
        <div class="meta">${car.category}</div>
        <h4>${car.name}</h4>

        <div class="bottom">
          <div class="price">$${car.price}/day</div>
          <button>Rent Now</button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// Simple interaction for checkboxes on product page
const checkboxes = document.querySelectorAll('.service-card input');
checkboxes.forEach(cb => {
  cb.addEventListener('change', () => {
    // In a real app, update the total price here
    console.log('Service toggled');
  });
});

// Header Profile Button
const headerProfileBtn = document.getElementById('headerProfileBtn');
if (headerProfileBtn) {
  headerProfileBtn.onclick = () => {
    window.location.href = "/profile";
  };
}

// Profile Page Logic
const loginBtn = document.getElementById('loginBtn');
const authModal = document.getElementById('authModal');
const profileContent = document.getElementById('profileContent');

if (loginBtn && authModal && profileContent) {
  // Check if already "logged in" (simulated)
  if (sessionStorage.getItem('isLoggedIn') === 'true') {
    authModal.style.display = 'none';
    profileContent.style.display = 'block';
  }

  loginBtn.onclick = () => {
    sessionStorage.setItem('isLoggedIn', 'true');
    authModal.style.display = 'none';
    profileContent.style.display = 'block';
  };
}

// Tab Switching
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.onclick = () => {
    const tabId = btn.getAttribute('data-tab');
    
    // Update buttons
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update content
    tabContents.forEach(content => {
      content.classList.remove('active');
      if (content.id === tabId + 'Tab') {
        content.classList.add('active');
      }
    });
  };
});

// Payment Modal
const addPaymentBtn = document.getElementById('addPaymentBtn');
const paymentModal = document.getElementById('paymentModal');
const closePaymentModal = document.getElementById('closePaymentModal');

if (addPaymentBtn && paymentModal) {
  addPaymentBtn.onclick = () => {
    paymentModal.style.display = 'flex';
  };
}

if (closePaymentModal && paymentModal) {
  closePaymentModal.onclick = () => {
    paymentModal.style.display = 'none';
  };
}

// Close modals on overlay click
window.onclick = (event) => {
  if (event.target === paymentModal) {
    paymentModal.style.display = 'none';
  }
};
