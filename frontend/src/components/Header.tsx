"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";

export default function Header() {
  const router = useRouter();

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
          <Link href="/profile" className="font-semibold text-gray-600 hover:text-black transition-colors">Profile</Link>
          <Link href="/admin" className="font-semibold text-gray-600 hover:text-black transition-colors">Admin</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-xl font-bold hover:bg-gray-100 transition-colors"
          >
            <User className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        </div>
      </div>
    </header>
  );
}
