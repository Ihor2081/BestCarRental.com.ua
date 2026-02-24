// ADMIN DASHBOARD LOGIC

function init() {
  initAdminTabs();
  initCharts();
  renderFleet();
  renderBookings();
  renderCustomers();
  if (window.replaceIcons) window.replaceIcons();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function initAdminTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  console.log('Found tab buttons:', tabBtns.length);
  console.log('Found tab contents:', tabContents.length);

  tabBtns.forEach(btn => {
    btn.onclick = (e) => {
      if (e) e.preventDefault();
      const tabId = btn.getAttribute('data-tab');
      console.log('Switching to tab:', tabId);
      
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

      // Re-init charts if dashboard tab is selected
      if (tabId === 'adminDashboard') {
        initCharts();
      }
    };
  });
}

function initCharts() {
  const revenueTrendContainer = document.getElementById('revenueTrendChart');
  const fleetCategoryContainer = document.getElementById('fleetCategoryChart');

  if (!revenueTrendContainer || !fleetCategoryContainer) return;

  // Clear previous charts
  revenueTrendContainer.innerHTML = '';
  fleetCategoryContainer.innerHTML = '';

  // REVENUE TREND CHART (Line Chart)
  const margin = {top: 20, right: 30, bottom: 30, left: 40};
  const width = revenueTrendContainer.clientWidth - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  const data = [
    {month: 'Jan', revenue: 45000, bookings: 120},
    {month: 'Feb', revenue: 52000, bookings: 140},
    {month: 'Mar', revenue: 48000, bookings: 130},
    {month: 'Apr', revenue: 62000, bookings: 170},
    {month: 'May', revenue: 58000, bookings: 160},
    {month: 'Jun', revenue: 70000, bookings: 189}
  ];

  const maxVal = 80000;
  const xStep = width / (data.length - 1);

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", revenueTrendContainer.clientWidth);
  svg.setAttribute("height", 300);
  
  const g = document.createElementNS(svgNS, "g");
  g.setAttribute("transform", `translate(${margin.left},${margin.top})`);
  svg.appendChild(g);

  // Helper to scale Y
  const scaleY = (val) => height - (val / maxVal) * height;

  // Grid lines
  for (let i = 0; i <= 4; i++) {
    const yVal = (maxVal / 4) * i;
    const yPos = scaleY(yVal);
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", 0);
    line.setAttribute("y1", yPos);
    line.setAttribute("x2", width);
    line.setAttribute("y2", yPos);
    line.setAttribute("stroke", "#f3f4f6");
    line.setAttribute("stroke-dasharray", "3,3");
    g.appendChild(line);

    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", -10);
    text.setAttribute("y", yPos + 4);
    text.setAttribute("text-anchor", "end");
    text.setAttribute("font-size", "10px");
    text.setAttribute("fill", "#9ca3af");
    text.textContent = yVal >= 1000 ? (yVal/1000) + 'k' : yVal;
    g.appendChild(text);
  }

  // X Axis labels
  data.forEach((d, i) => {
    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", i * xStep);
    text.setAttribute("y", height + 20);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "10px");
    text.setAttribute("fill", "#9ca3af");
    text.textContent = d.month;
    g.appendChild(text);
  });

  // Revenue Path
  let dRevenue = "";
  data.forEach((d, i) => {
    const x = i * xStep;
    const y = scaleY(d.revenue);
    dRevenue += (i === 0 ? "M" : "L") + x + "," + y;
  });

  const pathRevenue = document.createElementNS(svgNS, "path");
  pathRevenue.setAttribute("d", dRevenue);
  pathRevenue.setAttribute("fill", "none");
  pathRevenue.setAttribute("stroke", "#2563eb");
  pathRevenue.setAttribute("stroke-width", "2");
  g.appendChild(pathRevenue);

  // Bookings Path
  let dBookings = "";
  data.forEach((d, i) => {
    const x = i * xStep;
    const y = scaleY(d.bookings * 100); // Scale for visibility
    dBookings += (i === 0 ? "M" : "L") + x + "," + y;
  });

  const pathBookings = document.createElementNS(svgNS, "path");
  pathBookings.setAttribute("d", dBookings);
  pathBookings.setAttribute("fill", "none");
  pathBookings.setAttribute("stroke", "#10b981");
  pathBookings.setAttribute("stroke-width", "2");
  g.appendChild(pathBookings);

  // Dots
  data.forEach((d, i) => {
    const x = i * xStep;
    
    const circleRev = document.createElementNS(svgNS, "circle");
    circleRev.setAttribute("cx", x);
    circleRev.setAttribute("cy", scaleY(d.revenue));
    circleRev.setAttribute("r", 4);
    circleRev.setAttribute("fill", "white");
    circleRev.setAttribute("stroke", "#2563eb");
    circleRev.setAttribute("stroke-width", 2);
    g.appendChild(circleRev);

    const circleBook = document.createElementNS(svgNS, "circle");
    circleBook.setAttribute("cx", x);
    circleBook.setAttribute("cy", scaleY(d.bookings * 100));
    circleBook.setAttribute("r", 4);
    circleBook.setAttribute("fill", "white");
    circleBook.setAttribute("stroke", "#10b981");
    circleBook.setAttribute("stroke-width", 2);
    g.appendChild(circleBook);
  });

  revenueTrendContainer.appendChild(svg);

  // FLEET CATEGORY CHART (Bar Chart)
  const barData = [
    {category: 'Sedan', count: 45},
    {category: 'SUV', count: 38},
    {category: 'Sports', count: 12},
    {category: 'Electric', count: 28},
    {category: 'Compact', count: 52},
    {category: 'Convertible', count: 15}
  ];

  const svgBar = document.createElementNS(svgNS, "svg");
  svgBar.setAttribute("width", fleetCategoryContainer.clientWidth);
  svgBar.setAttribute("height", 300);
  
  const gBar = document.createElementNS(svgNS, "g");
  gBar.setAttribute("transform", `translate(${margin.left},${margin.top})`);
  svgBar.appendChild(gBar);

  const barWidth = width / barData.length;
  const maxBar = 60;

  barData.forEach((d, i) => {
    const h = (d.count / maxBar) * height;
    const x = i * barWidth + barWidth * 0.1;
    const w = barWidth * 0.8;
    const y = height - h;

    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", w);
    rect.setAttribute("height", h);
    rect.setAttribute("fill", "#3b82f6");
    rect.setAttribute("rx", 4);
    gBar.appendChild(rect);

    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", x + w/2);
    text.setAttribute("y", height + 20);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "10px");
    text.setAttribute("fill", "#9ca3af");
    text.textContent = d.category;
    gBar.appendChild(text);
  });

  // Y Axis for Bar
  for (let i = 0; i <= 4; i++) {
    const yVal = (maxBar / 4) * i;
    const yPos = height - (yVal / maxBar) * height;
    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", -10);
    text.setAttribute("y", yPos + 4);
    text.setAttribute("text-anchor", "end");
    text.setAttribute("font-size", "10px");
    text.setAttribute("fill", "#9ca3af");
    text.textContent = yVal;
    gBar.appendChild(text);
  }

  fleetCategoryContainer.appendChild(svgBar);
}

function renderFleet() {
  const fleetGrid = document.getElementById('adminFleetGrid');
  if (!fleetGrid) return;

  const fleet = [
    {id: 1, name: "Mercedes-Benz E-Class", category: "Sedan", price: 120, status: "available", bookings: 45, img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop"},
    {id: 2, name: "Range Rover Sport", category: "SUV", price: 180, status: "rented", bookings: 38, img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"},
    {id: 3, name: "Porsche 911 Carrera", category: "Sports", price: 350, status: "maintenance", bookings: 28, img: "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=2070&auto=format&fit=crop"},
    {id: 4, name: "Tesla Model 3", category: "Electric", price: 95, status: "available", bookings: 52, img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2070&auto=format&fit=crop"}
  ];

  fleetGrid.innerHTML = fleet.map(car => `
    <div class="admin-fleet-card">
      <img src="${car.img}" alt="${car.name}">
      <div class="fleet-info">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h4 class="font-bold">${car.name}</h4>
            <div class="text-xs text-gray-500">${car.category}</div>
          </div>
          <span class="status-tag ${car.status}">${car.status.charAt(0).toUpperCase() + car.status.slice(1)}</span>
        </div>
        <div class="flex justify-between items-end">
          <div>
            <div class="font-bold">$${car.price}</div>
            <div class="text-xs text-gray-400">${car.bookings} bookings</div>
          </div>
          <div class="action-btns">
            <button class="action-btn"><i class="lucide-pencil"></i></button>
            <button class="action-btn delete"><i class="lucide-trash-2"></i></button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderBookings() {
  const tableBody = document.getElementById('adminBookingsTableBody');
  if (!tableBody) return;

  const bookings = [
    {id: 'B001', customer: 'John Anderson', email: 'john.anderson@email.com', vehicle: 'Mercedes-Benz E-Class', dates: '2026-03-15 to 2026-03-20', total: '$600', status: 'upcoming'},
    {id: 'B002', customer: 'Sarah Miller', email: 'sarah.miller@email.com', vehicle: 'Tesla Model 3', dates: '2026-02-22 to 2026-02-24', total: '$190', status: 'active'},
    {id: 'B003', customer: 'Michael Chen', email: 'michael.chen@email.com', vehicle: 'Range Rover Sport', dates: '2026-02-10 to 2026-02-15', total: '$900', status: 'completed'}
  ];

  tableBody.innerHTML = bookings.map(b => `
    <tr>
      <td class="font-semibold">${b.id}</td>
      <td>
        <div class="customer-cell">
          <span class="font-semibold">${b.customer}</span>
          <span class="customer-email">${b.email}</span>
        </div>
      </td>
      <td>${b.vehicle}</td>
      <td class="text-gray-500">${b.dates}</td>
      <td class="font-bold">${b.total}</td>
      <td><span class="status-badge ${b.status}">${b.status.charAt(0).toUpperCase() + b.status.slice(1)}</span></td>
      <td><button class="action-btn"><i class="lucide-eye"></i></button></td>
    </tr>
  `).join('');
}

function renderCustomers() {
  const customersGrid = document.getElementById('adminCustomersGrid');
  if (!customersGrid) return;

  const customers = [
    {name: 'John Anderson', email: 'john.anderson@email.com', bookings: 12, spent: '$4,250', since: 'January 2024'},
    {name: 'Sarah Miller', email: 'sarah.miller@email.com', bookings: 8, spent: '$2,890', since: 'March 2024'},
    {name: 'Michael Chen', email: 'michael.chen@email.com', bookings: 15, spent: '$6,120', since: 'November 2023'}
  ];

  customersGrid.innerHTML = customers.map(c => `
    <div class="admin-customer-card">
      <div class="customer-header">
        <div class="customer-avatar">
          <i class="lucide-user"></i>
        </div>
        <span class="customer-status">active</span>
      </div>
      <h4 class="font-bold mb-1">${c.name}</h4>
      <p class="text-xs text-gray-500 mb-6">${c.email}</p>
      
      <div class="customer-details-list">
        <div class="customer-detail-item">
          <span class="detail-label">Bookings:</span>
          <span class="detail-value">${c.bookings}</span>
        </div>
        <div class="customer-detail-item">
          <span class="detail-label">Total Spent:</span>
          <span class="detail-value">${c.spent}</span>
        </div>
        <div class="customer-detail-item">
          <span class="detail-label">Member Since:</span>
          <span class="detail-value">${c.since}</span>
        </div>
      </div>
      
      <button class="view-details-btn-full">View Details</button>
    </div>
  `).join('');
}
