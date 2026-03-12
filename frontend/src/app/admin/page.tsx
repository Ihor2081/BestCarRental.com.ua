"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, Car, Calendar, Users, Settings, 
  DollarSign, Search, Plus, Pencil, Trash2, Eye,
  TrendingUp, BarChart3, PieChart, Save, Lock
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, BarChart, Bar,
  Cell, PieChart as RePieChart, Pie
} from 'recharts';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Car as CarType, Booking, Customer, DashboardStats, Settings as SettingsType } from "@/types";
import CarModal from "@/components/admin/CarModal";
import CustomerDetailModal from "@/components/admin/CustomerDetailModal";
import ChangePasswordModal from "@/components/admin/ChangePasswordModal";
import SupportModal from "@/components/admin/SupportModal";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("adminDashboard");
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [fleet, setFleet] = useState<CarType[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [settings, setSettings] = useState<SettingsType | null>(null);

  // Filter states
  const [fleetSearch, setFleetSearch] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");

  // Modal states
  const [showCarModal, setShowCarModal] = useState(false);
  const [editingCar, setEditingCar] = useState<CarType | undefined>(undefined);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      const headers = { "Authorization": `Bearer ${token}` };
      
      const [statsRes, fleetRes, bookingsRes, customersRes, settingsRes] = await Promise.all([
        fetch("/api/admin/dashboard", { headers }),
        fetch("/api/admin/cars", { headers }),
        fetch("/api/admin/bookings", { headers }),
        fetch("/api/admin/users", { headers }),
        fetch("/api/admin/settings", { headers })
      ]);
      
      if (statsRes.status === 403 || fleetRes.status === 403) {
        router.push("/");
        return;
      }

      const [statsData, fleetData, bookingsData, customersData, settingsData] = await Promise.all([
        statsRes.json(),
        fleetRes.json(),
        bookingsRes.json(),
        customersRes.json(),
        settingsRes.json()
      ]);

      setStats(statsData);
      setFleet(fleetData);
      setBookings(bookingsData);
      setCustomers(customersData);
      setSettings(settingsData);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteCar = async (id: number) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/cars/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!response.ok) {
        const data = await response.json();
        alert(data.detail || "Failed to delete car");
        return;
      }
      
      fetchData();
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(settings)
      });
      
      if (response.ok) {
        alert("Settings updated successfully!");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const viewCustomerDetails = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/users/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      setSelectedCustomer(data);
      setShowCustomerModal(true);
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };

  // Filtered data
  const filteredFleet = fleet.filter(car => 
    `${car.brand} ${car.model}`.toLowerCase().includes(fleetSearch.toLowerCase()) ||
    car.license_plate.toLowerCase().includes(fleetSearch.toLowerCase())
  );

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.customer_name.toLowerCase().includes(bookingSearch.toLowerCase()) || 
                         b.id.toString().includes(bookingSearch);
    const matchesStatus = bookingStatus === "" || b.status === bookingStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(customerSearch.toLowerCase())
  );

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 max-w-7xl py-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 font-medium">Manage your car rental business in real-time</p>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">System Status</div>
          <div className="flex items-center gap-2 text-emerald-500 font-black">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Operational
          </div>
        </div>
      </div>

      {/* ADMIN TABS */}
      <div className="bg-gray-100 p-1.5 rounded-2xl inline-block mb-10">
        <div className="flex gap-1">
          {[
            { id: "adminDashboard", icon: LayoutDashboard, label: "Overview" },
            { id: "adminFleet", icon: Car, label: "Fleet" },
            { id: "adminBookings", icon: Calendar, label: "Bookings" },
            { id: "adminCustomers", icon: Users, label: "Customers" },
            { id: "adminSettings", icon: Settings, label: "Settings" },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2",
                activeTab === tab.id ? "bg-white text-black shadow-md" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === "adminDashboard" && stats && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Monthly Revenue", value: `$${stats.monthly_revenue.toLocaleString()}`, trend: "Live", icon: DollarSign, color: "blue" },
              { label: "Total Bookings", value: stats.total_bookings.toString(), trend: "All Time", icon: Calendar, color: "green" },
              { label: "Available Cars", value: stats.available_cars.toString(), trend: "Ready", icon: Car, color: "purple" },
              { label: "Active Customers", value: stats.active_customers.toString(), trend: "Engaged", icon: Users, color: "orange" },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300",
                    stat.color === "blue" ? "bg-blue-50 text-blue-600" :
                    stat.color === "green" ? "bg-green-50 text-green-600" :
                    stat.color === "purple" ? "bg-purple-50 text-purple-600" :
                    "bg-orange-50 text-orange-600"
                  )}>
                    <stat.icon className="w-7 h-7" />
                  </div>
                  <span className="px-3 py-1 bg-gray-50 text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {stat.trend}
                  </span>
                </div>
                <div className="text-4xl font-black mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400 font-bold uppercase tracking-tight">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CHARTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  Performance Trends
                </h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div> Revenue
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div> Bookings
                  </div>
                </div>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.revenue_trend.map((r, i) => ({ ...r, bookings: stats.bookings_trend[i]?.value }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#9ca3af'}} dy={15} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#9ca3af'}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '20px' }}
                      itemStyle={{ fontWeight: 800, fontSize: '14px' }}
                    />
                    <Line type="monotone" dataKey="value" name="Revenue" stroke="#2563eb" strokeWidth={4} dot={{r: 6, fill: 'white', strokeWidth: 3}} activeDot={{r: 8}} />
                    <Line type="monotone" dataKey="bookings" name="Bookings" stroke="#10b981" strokeWidth={4} dot={{r: 6, fill: 'white', strokeWidth: 3}} activeDot={{r: 8}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
              <h3 className="text-2xl font-black tracking-tight mb-10 flex items-center gap-3">
                <PieChart className="w-6 h-6 text-purple-600" />
                Fleet Distribution
              </h3>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={stats.fleet_by_category}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={8}
                      dataKey="count"
                      nameKey="category"
                    >
                      {stats.fleet_by_category.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '20px' }}
                    />
                    <Legend verticalAlign="bottom" align="center" iconType="circle" />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLEET TAB */}
      {activeTab === "adminFleet" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="relative flex-1 max-w-xl w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search by brand, model or license plate..." 
                value={fleetSearch}
                onChange={(e) => setFleetSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-[24px] outline-none text-sm font-bold shadow-sm focus:shadow-md transition-all"
              />
            </div>
            <button 
              onClick={() => { setEditingCar(undefined); setShowCarModal(true); }}
              className="bg-black text-white px-8 py-5 rounded-[24px] font-black flex items-center gap-3 hover:bg-gray-900 transition-all shadow-lg hover:shadow-black/20"
            >
              <Plus className="w-6 h-6" /> Add New Vehicle
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredFleet.map((car) => (
              <div key={car.id} className="bg-white rounded-[32px] p-8 flex flex-col sm:flex-row gap-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
                <div className="w-full sm:w-48 h-32 bg-gray-50 rounded-2xl overflow-hidden">
                  <img 
                    src={car.images || "https://picsum.photos/seed/car/800/600"} 
                    alt={car.model} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-black tracking-tight">{car.brand} {car.model}</h4>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{car.license_plate}</div>
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                      car.status === 'available' ? 'bg-emerald-50 text-emerald-600' :
                      car.status === 'reserved' ? 'bg-blue-50 text-blue-600' :
                      car.status === 'in_service' ? 'bg-orange-50 text-orange-600' :
                      'bg-red-50 text-red-600'
                    )}>
                      {car.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-2xl font-black">${car.price_per_day} <span className="text-xs text-gray-400 font-bold">/ day</span></div>
                      <div className="text-xs text-gray-400 font-bold mt-1">{car.bookings_count} total bookings</div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => { setEditingCar(car); setShowCarModal(true); }}
                        className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCar(car.id)}
                        className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOOKINGS TAB */}
      {activeTab === "adminBookings" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="relative flex-1 max-w-xl w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search by customer name or booking ID..." 
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-[24px] outline-none text-sm font-bold shadow-sm focus:shadow-md transition-all"
              />
            </div>
            <select 
              value={bookingStatus}
              onChange={(e) => setBookingStatus(e.target.value)}
              className="px-8 py-5 rounded-[24px] border border-gray-100 bg-white outline-none text-sm font-bold shadow-sm cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">ID</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Vehicle</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Dates</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Total</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="p-6 font-black text-gray-400">#{b.id}</td>
                      <td className="p-6">
                        <div className="font-black">{b.customer_name}</div>
                      </td>
                      <td className="p-6 font-bold">{b.car_name}</td>
                      <td className="p-6 text-gray-500 font-medium text-sm">
                        {new Date(b.start_date).toLocaleDateString()} - {new Date(b.end_date).toLocaleDateString()}
                      </td>
                      <td className="p-6 font-black text-lg">${b.total_price}</td>
                      <td className="p-6">
                        <span className={cn(
                          "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                          b.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                          b.status === 'active' ? 'bg-blue-50 text-blue-600' :
                          b.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                          'bg-gray-50 text-gray-500'
                        )}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMERS TAB */}
      {activeTab === "adminCustomers" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="relative max-w-xl w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-[24px] outline-none text-sm font-bold shadow-sm focus:shadow-md transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCustomers.map((c) => (
              <div key={c.id} className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100 hover:shadow-xl transition-all group">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center text-white text-2xl font-black">
                    {c.name.charAt(0)}
                  </div>
                  <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Client</span>
                </div>
                <h4 className="text-xl font-black mb-1">{c.name}</h4>
                <p className="text-sm text-gray-400 font-bold mb-8">{c.email}</p>
                
                <div className="space-y-3 mb-10">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-bold uppercase tracking-tighter">Bookings</span>
                    <span className="font-black">{c.bookings_count}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-bold uppercase tracking-tighter">Total Spent</span>
                    <span className="font-black text-emerald-600">${c.total_spent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400 font-bold uppercase tracking-tighter">Member Since</span>
                    <span className="font-black">{new Date(c.member_since).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => viewCustomerDetails(c.id)}
                  className="w-full py-4 border border-gray-100 rounded-2xl font-black hover:bg-black hover:text-white transition-all"
                >
                  View Full Profile
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === "adminSettings" && settings && (
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white rounded-[40px] p-12 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-black">
                <Settings className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black tracking-tight">Business Information</h3>
            </div>
            
            <form onSubmit={handleUpdateSettings} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Business Name</label>
                  <input 
                    type="text" 
                    value={settings.business_name} 
                    onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:border-black transition-all font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Business Email</label>
                  <input 
                    type="email" 
                    value={settings.business_email} 
                    onChange={(e) => setSettings({ ...settings, business_email: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:border-black transition-all font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Business Phone</label>
                  <input 
                    type="text" 
                    value={settings.business_phone} 
                    onChange={(e) => setSettings({ ...settings, business_phone: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:border-black transition-all font-bold" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Business Address</label>
                  <input 
                    type="text" 
                    value={settings.business_address} 
                    onChange={(e) => setSettings({ ...settings, business_address: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:border-black transition-all font-bold" 
                  />
                </div>
              </div>
              
              <button 
                type="submit"
                className="bg-black text-white px-10 py-5 rounded-2xl font-black hover:bg-gray-900 transition-all shadow-lg hover:shadow-black/20 flex items-center gap-3 mt-4"
              >
                <Save className="w-5 h-5" />
                Save Business Profile
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black tracking-tight">Security</h3>
              </div>
              <p className="text-gray-500 text-sm font-medium mb-8">
                Keep your admin account secure by regularly updating your password.
              </p>
              <button 
                onClick={() => setShowPasswordModal(true)}
                className="w-full py-5 border-2 border-gray-100 rounded-2xl font-black hover:border-black transition-all flex items-center justify-center gap-3"
              >
                Change Admin Password
              </button>
            </div>

            <div className="bg-black rounded-[40px] p-10 shadow-xl text-white">
              <h3 className="text-xl font-black mb-4">Need Help?</h3>
              <p className="text-gray-400 text-sm font-medium mb-8 leading-relaxed">
                If you encounter any issues with the admin panel or need technical assistance, please contact our support team.
              </p>
              <button 
                onClick={() => setShowSupportModal(true)}
                className="w-full py-5 bg-white text-black rounded-2xl font-black hover:bg-gray-100 transition-all"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {showCarModal && (
        <CarModal 
          car={editingCar} 
          onClose={() => setShowCarModal(false)} 
          onSave={() => { setShowCarModal(false); fetchData(); }} 
        />
      )}

      {showCustomerModal && selectedCustomer && (
        <CustomerDetailModal 
          customer={selectedCustomer} 
          onClose={() => setShowCustomerModal(false)} 
        />
      )}

      {showPasswordModal && (
        <ChangePasswordModal 
          onClose={() => setShowPasswordModal(false)} 
        />
      )}

      {showSupportModal && (
        <SupportModal 
          onClose={() => setShowSupportModal(false)} 
        />
      )}
    </main>
  );
}
