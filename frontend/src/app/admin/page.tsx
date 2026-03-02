"use client";

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Car, Calendar, Users, Settings, 
  DollarSign, Search, Plus, Pencil, Trash2, Eye 
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Car as CarType, Booking, Customer } from "@/types";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const revenueData = [
  { month: 'Jan', revenue: 45000, bookings: 120 },
  { month: 'Feb', revenue: 52000, bookings: 140 },
  { month: 'Mar', revenue: 48000, bookings: 130 },
  { month: 'Apr', revenue: 62000, bookings: 170 },
  { month: 'May', revenue: 58000, bookings: 160 },
  { month: 'Jun', revenue: 70000, bookings: 189 }
];

const fleetData = [
  { category: 'Sedan', count: 45 },
  { category: 'SUV', count: 38 },
  { category: 'Sports', count: 12 },
  { category: 'Electric', count: 28 },
  { category: 'Compact', count: 52 },
  { category: 'Convertible', count: 15 }
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("adminDashboard");
  const [fleet, setFleet] = useState<CarType[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [fleetRes, bookingsRes, customersRes] = await Promise.all([
          fetch("/api/fleet"),
          fetch("/api/bookings"),
          fetch("/api/customers")
        ]);
        
        const [fleetData, bookingsData, customersData] = await Promise.all([
          fleetRes.json(),
          bookingsRes.json(),
          customersRes.json()
        ]);

        if (Array.isArray(fleetData)) setFleet(fleetData);
        if (Array.isArray(bookingsData)) setBookings(bookingsData);
        if (Array.isArray(customersData)) setCustomers(customersData);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <main className="container mx-auto px-4 max-w-7xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500">Manage your car rental business</p>
      </div>

      {/* ADMIN TABS */}
      <div className="bg-gray-100 p-1.5 rounded-xl inline-block mb-8">
        <div className="flex gap-1">
          {[
            { id: "adminDashboard", icon: LayoutDashboard, label: "Dashboard" },
            { id: "adminFleet", icon: Car, label: "Fleet" },
            { id: "adminBookings", icon: Calendar, label: "Bookings" },
            { id: "adminCustomers", icon: Users, label: "Customers" },
            { id: "adminSettings", icon: Settings, label: "Settings" },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2",
                activeTab === tab.id ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === "adminDashboard" && (
        <div className="space-y-8">
          {/* STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Monthly Revenue", value: "$70,000", trend: "+12%", icon: DollarSign, color: "blue" },
              { label: "Total Bookings", value: "189", trend: "+8%", icon: Calendar, color: "green" },
              { label: "Available Cars", value: "142", trend: "190 Total", icon: Car, color: "purple", isBadge: true },
              { label: "Active Customers", value: "1,234", trend: "+24", icon: Users, color: "orange" },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    stat.color === "blue" ? "bg-blue-50 text-blue-600" :
                    stat.color === "green" ? "bg-green-50 text-green-600" :
                    stat.color === "purple" ? "bg-purple-50 text-purple-600" :
                    "bg-orange-50 text-orange-600"
                  )}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded-lg text-xs font-bold",
                    stat.isBadge ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-700"
                  )}>
                    {stat.trend}
                  </span>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CHARTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold mb-6">Revenue & Bookings Trend</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                    <Tooltip />
                    <Legend verticalAlign="top" align="center" iconType="circle" wrapperStyle={{paddingBottom: 20}} />
                    <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} dot={{r: 4, fill: 'white', strokeWidth: 2}} activeDot={{r: 6}} />
                    <Line type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={2} dot={{r: 4, fill: 'white', strokeWidth: 2}} activeDot={{r: 6}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold mb-6">Fleet by Category</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fleetData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLEET TAB */}
      {activeTab === "adminFleet" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search fleet..." 
                className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-xl outline-none text-sm"
              />
            </div>
            <button className="bg-black text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-900 transition-colors">
              <Plus className="w-4 h-4" /> Add Vehicle
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fleet.map((car) => (
              <div key={car.id} className="bg-white rounded-2xl p-5 flex gap-6 shadow-sm">
                <img src={car.img} alt={car.name} className="w-32 h-20 object-cover rounded-lg" referrerPolicy="no-referrer" />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold">{car.name}</h4>
                      <div className="text-xs text-gray-500">{car.category}</div>
                    </div>
                    <span className={cn("status-tag capitalize", car.status)}>{car.status}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="font-bold">${car.price}</div>
                      <div className="text-xs text-gray-400">{car.bookings} bookings</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-600 hover:border-red-200 transition-colors">
                        <Trash2 className="w-4 h-4" />
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
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search bookings..." 
                className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-xl outline-none text-sm"
              />
            </div>
            <select className="px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none text-sm">
              <option>All Bookings</option>
              <option>Upcoming</option>
              <option>Active</option>
              <option>Completed</option>
            </select>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-4 text-xs font-bold uppercase text-gray-500">Booking ID</th>
                    <th className="p-4 text-xs font-bold uppercase text-gray-500">Customer</th>
                    <th className="p-4 text-xs font-bold uppercase text-gray-500">Vehicle</th>
                    <th className="p-4 text-xs font-bold uppercase text-gray-500">Dates</th>
                    <th className="p-4 text-xs font-bold uppercase text-gray-500">Total</th>
                    <th className="p-4 text-xs font-bold uppercase text-gray-500">Status</th>
                    <th className="p-4 text-xs font-bold uppercase text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-gray-50 last:border-0">
                      <td className="p-4 font-semibold">{b.id}</td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-semibold">{b.customer}</span>
                          <span className="text-xs text-gray-500">{b.email}</span>
                        </div>
                      </td>
                      <td className="p-4">{b.vehicle}</td>
                      <td className="p-4 text-gray-500 text-sm">{b.dates}</td>
                      <td className="p-4 font-bold">{b.total}</td>
                      <td className="p-4">
                        <span className={cn("status-badge capitalize", b.status)}>{b.status}</span>
                      </td>
                      <td className="p-4">
                        <button className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
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
        <div className="space-y-6">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-xl outline-none text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {customers.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-bold">Active</span>
                </div>
                <h4 className="font-bold mb-1">{c.name}</h4>
                <p className="text-xs text-gray-500 mb-6">{c.email}</p>
                
                <div className="space-y-2 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Bookings:</span>
                    <span className="font-semibold">{c.bookings}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Spent:</span>
                    <span className="font-semibold">{c.spent}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Member Since:</span>
                    <span className="font-semibold">{c.since}</span>
                  </div>
                </div>
                
                <button className="w-full py-3 border border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-colors">View Details</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === "adminSettings" && (
        <div className="bg-white rounded-2xl p-10 shadow-sm max-w-2xl">
          <h3 className="text-lg font-bold mb-6">Business Settings</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold">Business Name</label>
              <input type="text" defaultValue="DriveAway Car Rentals" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg outline-none" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold">Business Email</label>
              <input type="email" defaultValue="admin@driveaway.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg outline-none" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold">Business Phone</label>
              <input type="text" defaultValue="+1 (555) 123-4567" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg outline-none" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold">Business Address</label>
              <input type="text" defaultValue="123 Main Street, Los Angeles, CA 90001" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg outline-none" />
            </div>
            
            <button className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-900 transition-colors mt-4">
              Save Changes
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
