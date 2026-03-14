"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
import AuthModal from "./AuthModal";

export default function Header() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      setIsAuthorized(!!token);
      
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserRole(user.role);
        } catch (e) {
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    };

    checkAuth();

    // Listen for storage changes
    window.addEventListener("storage", checkAuth);

    // Custom event for same-window updates
    window.addEventListener("auth-change", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthorized(false);
    router.push("/");
    window.dispatchEvent(new Event("auth-change"));
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between max-w-7xl">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin-slow"></div>
          </div>
          <span className="text-2xl font-black tracking-tighter">DRIVEAWAY</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="font-semibold text-gray-600 hover:text-black transition-colors">Home</Link>
          <Link href="/about" className="font-semibold text-gray-600 hover:text-black transition-colors">About</Link>
          {/* Admin and Profile links removed from main nav as requested */}
        </nav>

        <div className="flex items-center gap-4">
          {isAuthorized ? (
            <div className="flex items-center gap-4">
              
              {userRole === "admin" ? (
                <Link 
                  href="/admin" 
                  className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl font-bold hover:bg-gray-900 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </Link>
              ) : (
                <Link 
                  href="/profile" 
                  className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                </Link>
              )}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 font-bold hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-900 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Log in</span>
            </button>
          )}
        </div>
      </div>

      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} 
          onSuccess={() => {
            setIsAuthorized(true);
            setShowAuthModal(false);
            window.dispatchEvent(new Event("auth-change"));
            
            
            const userStr = localStorage.getItem("user");
            if (userStr) {
              try {
                const user = JSON.parse(userStr);
                if (user.role === "admin") {
                  router.push("/admin");
                } else {
                  router.push("/profile");
                }
              } catch (e) {
                router.push("/profile");
              }
            } else {
              router.push("/profile");
            }
          }} 
        />
      )}
    </header>
  );
}