"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User as UserIcon, Mail, Phone, MapPin, CreditCard, 
  History, Settings, LogOut, Plus, ShieldCheck 
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!token || !storedUser) {
        router.push("/");
        return;
      }

      setUser(JSON.parse(storedUser));
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    window.addEventListener("auth-change", checkAuth);
    return () => window.removeEventListener("auth-change", checkAuth);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-change"));
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* PROFILE SIDEBAR */}
        <aside className="w-full lg:w-80 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden border-4 border-gray-50">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-2xl font-bold">{user?.name || "User"}</h2>
            <p className="text-gray-500 text-sm mb-6">Member since {new Date().getFullYear()}</p>
            <div className="flex justify-center gap-2">
              <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified
              </span>
            </div>
          </div>

          <nav className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 space-y-2">
            {[
              { id: "personal", icon: UserIcon, label: "Personal Info" },
              { id: "bookings", icon: History, label: "Booking History" },
              { id: "payment", icon: CreditCard, label: "Payment Methods" },
              { id: "settings", icon: Settings, label: "Account Settings" },
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all",
                  activeTab === tab.id ? "bg-black text-white shadow-lg" : "text-gray-500 hover:bg-gray-50 hover:text-black"
                )}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </nav>
        </aside>

        {/* CONTENT AREA */}
        <div className="flex-1">
          {activeTab === "personal" && (
            <div className="space-y-8">
              <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-2xl font-bold mb-8">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <UserIcon className="w-5 h-5 text-gray-400" />
                      <span className="font-semibold">{user?.name}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="font-semibold">{user?.email}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Role</label>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <ShieldCheck className="w-5 h-5 text-gray-400" />
                      <span className="font-semibold capitalize">{user?.role}</span>
                    </div>
                  </div>
                </div>
                <button className="mt-10 bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-900 transition-all">Edit Profile</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: "Total Bookings", value: "12", color: "blue" },
                  { label: "Active Rentals", value: "1", color: "emerald" },
                  { label: "Reward Points", value: "2,450", color: "purple" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="text-3xl font-black mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-500 font-semibold">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold mb-8">Booking History</h3>
              <div className="space-y-6">
                {[
                  { id: "DRV-90210", car: "Mercedes-Benz E-Class", date: "Mar 15 - Mar 20, 2024", status: "upcoming", price: "$600" },
                  { id: "DRV-88231", car: "Tesla Model 3", date: "Feb 10 - Feb 15, 2024", status: "completed", price: "$475" },
                  { id: "DRV-77120", car: "Range Rover Sport", date: "Jan 20 - Jan 27, 2024", status: "completed", price: "$1,260" },
                ].map((b) => (
                  <div key={b.id} className="flex flex-col md:flex-row items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 gap-4">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <History className="w-8 h-8 text-gray-300" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-400 uppercase mb-1">{b.id}</div>
                        <h4 className="font-bold text-lg">{b.car}</h4>
                        <p className="text-sm text-gray-500">{b.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className="text-xl font-black">{b.price}</div>
                        <span className={cn("status-badge", b.status)}>{b.status}</span>
                      </div>
                      <button className="bg-white p-3 rounded-xl border border-gray-200 hover:border-black transition-all">
                        <Plus className="w-5 h-5 rotate-45" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">Payment Methods</h3>
                <button className="flex items-center gap-2 text-sm font-bold hover:underline">
                  <Plus className="w-4 h-4" /> Add New
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-12">
                      <CreditCard className="w-10 h-10 text-white/50" />
                      <span className="text-xs font-bold uppercase tracking-widest opacity-50">Primary</span>
                    </div>
                    <div className="text-2xl font-mono tracking-[0.2em] mb-8">•••• •••• •••• 4242</div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-[10px] uppercase opacity-50 font-bold mb-1">Card Holder</div>
                        <div className="font-bold tracking-wide">{user?.name?.toUpperCase() || "USER"}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] uppercase opacity-50 font-bold mb-1">Expires</div>
                        <div className="font-bold tracking-wide">12/26</div>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="border-2 border-dashed border-gray-200 rounded-[32px] flex flex-col items-center justify-center gap-4 hover:border-black hover:bg-gray-50 transition-all group min-h-[220px]">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-gray-500 group-hover:text-black">Add New Card</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}