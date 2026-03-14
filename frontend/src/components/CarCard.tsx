"use client";

import { useRouter } from "next/navigation";
import { Car } from "@/types";
import { Users, Briefcase, Gauge, Fuel, Check } from "lucide-react";

export default function CarCard({ car }: { car: Car }) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-gray-100">
      
      {/* IMAGE */}
      <div className="relative h-52 overflow-hidden">
        <img 
          src={car.image || "https://picsum.photos/seed/car/800/600"} 
          alt={`${car.brand} ${car.model}`} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {/* CATEGORY BADGE */}
        <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm capitalize">
          {car.category || "Unknown"}
        </div>
        {/* FUEL BADGE */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm capitalize">
          {car.fuel_type}
        </div>
      </div>

      {/* INFO */}
      <div className="p-6">
        {/* BRAND / MODEL + SPECS */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{car.brand} {car.model}</h3>

            <div className="flex flex-wrap gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4 text-blue-600" /> {car.passengers} Seats
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4 text-blue-600" /> {car.luggage} Bags
              </span>
              <span className="flex items-center gap-1 capitalize">
                <Gauge className="w-4 h-4 text-blue-600" /> {car.transmission || "-"}
              </span>
            </div>
          </div>

          {/* PRICE */}
          <div className="text-right">
            <div className="text-2xl font-black text-black">${car.price_per_day}</div>
            <div className="text-[10px] text-gray-400 uppercase font-bold">per day</div>
          </div>
        </div>

        {/* FEATURES */}
        <div className="flex flex-wrap gap-2 mb-4">
          {car.features?.includes("gps") && (
            <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs">
              <Check className="w-3 h-3" /> GPS
            </span>
          )}
          {car.features?.includes("bluetooth") && (
            <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs">
              <Check className="w-3 h-3" /> Bluetooth
            </span>
          )}
          {car.features?.includes("leather") && (
            <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs">
              <Check className="w-3 h-3" /> Leather Seats
            </span>
          )}
        </div>

        {/* BUTTON */}
        <button 
          onClick={() => router.push(`/product?id=${car.id}`)}
          className="w-full bg-black text-white py-3.5 rounded-2xl font-bold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
        >
          Rent Now
        </button>
      </div>
    </div>
  );
}