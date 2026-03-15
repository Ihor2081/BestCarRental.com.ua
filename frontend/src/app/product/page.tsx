"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeft, Users, Briefcase, Gauge, Fuel, 
  Check, Shield, Navigation, Baby, Wifi, MapPin, 
  Calendar, Clock 
} from "lucide-react";
import { Car } from "@/types";

export default function ProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const carId = idParam ? Number(idParam) : null;

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idParam) {
      router.push("/");
      return;
    }

    const parsedId = Number(idParam);
    if (Number.isNaN(parsedId) || parsedId <= 0) {
      setError("Invalid car ID");
      setLoading(false);
      return;
    }

    const loadCar = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/cars/${parsedId}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error((data as any).detail || "Car not found");
        }
        const data = (await res.json()) as Car;
        setCar(data);
      } catch (err: any) {
        setError(err?.message ?? "Failed to load car");
      } finally {
        setLoading(false);
      }
    };

    loadCar();
  }, [idParam, router]);

  if (loading) {
    return (
      <main className="container mx-auto px-4 max-w-7xl py-8">
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  if (error || !car) {
    return (
      <main className="container mx-auto px-4 max-w-7xl py-8">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-red-200 text-red-700">
          <h2 className="text-xl font-bold mb-4">Unable to load car</h2>
          <p className="mb-6">{error || "Car not found."}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-black text-white px-6 py-3 rounded-2xl font-bold"
          >
            Back to All Cars
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 max-w-7xl py-8">
      {/* BREADCRUMB */}
      <div className="mb-6">
        <Link href="/" className="text-gray-600 flex items-center gap-2 hover:text-black transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to All Cars
        </Link>
      </div>

      <div className="product-layout grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
        {/* LEFT COLUMN */}
        <div className="product-main">
          {/* MAIN IMAGE */}
          <div className="car-hero-image mb-8">
            <img
              src={car.images}
              alt={`${car.brand} ${car.model}`}
              className="rounded-2xl w-full shadow-lg"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* CAR INFO HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
            <div>
              <span className="bg-gray-800 text-white px-3 py-1 rounded-md text-xs font-semibold">
                {car.status}
              </span>
              <h1 className="text-4xl font-bold mt-2">
                {car.brand} {car.model}
              </h1>
              
              {/*
              <div className="flex items-center gap-2 mt-2 text-yellow-500">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-gray-500 text-sm">(4.8 rating • 127 reviews)</span>
              </div>
              */}
            </div>
            <div className="sm:text-right">
              <div className="text-3xl font-bold">${car.price_per_day}</div>
              <div className="text-gray-500">per day</div>
            </div>
          </div>

          <hr className="mb-8 border-gray-200" />

          {/* DESCRIPTION */}
          <div className="mb-8">
            <p className="text-gray-600 leading-relaxed">
              {car.description || "No description available."}
            </p>
          </div>

          {/* SPECS GRID */}
          <div className="specs-grid grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {[
              { icon: Users, label: "Passengers", value: car.passengers },
              { icon: Briefcase, label: "Luggage", value: car.luggage },
              { icon: Gauge, label: "Transmission", value: car.transmission?.charAt(0).toUpperCase() + car.transmission?.slice(1) },
              { icon: Fuel, label: "Fuel Type", value: car.fuel_type?.charAt(0).toUpperCase() + car.fuel_type?.slice(1) }
            ].map((spec, i) => (
              <div key={i} className="spec-item bg-white p-4 rounded-xl flex items-center gap-3 border border-gray-100">
                <spec.icon className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-xs text-gray-500">{spec.label}</div>
                  <div className="font-semibold">{spec.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* FEATURES */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-6">Features & Amenities</h3>
            <div className="features-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
              {car.features?.split(",").map((feature) => (
                <div key={feature} className="feature-item flex items-center gap-3 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" /> {feature.trim()}
                </div>
              ))}
            </div>
          </div>

          {/* ADDITIONAL SERVICES */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-6">Additional Services</h3>
            <div className="services-list flex flex-col gap-4">
              {[
                { icon: Shield, name: "Full Insurance Coverage", desc: "Comprehensive protection with zero deductible", price: 25 },
                { icon: Navigation, name: "GPS Navigation", desc: "Latest navigation system with real-time traffic", price: 10, checked: true },
                { icon: Baby, name: "Child Safety Seat", desc: "High-quality child seat for safety", price: 8 },
                { icon: Wifi, name: "Mobile WiFi Hotspot", desc: "Unlimited data for your journey", price: 12 },
              ].map((service, i) => (
                <label key={i} className="service-card cursor-pointer group">
                  <input type="checkbox" className="hidden peer" defaultChecked={service.checked} />
                  <div className="service-content bg-white border border-gray-200 rounded-xl p-5 transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50 group-hover:border-gray-300">
                    <div className="flex items-center gap-4">
                      <div className="checkbox-custom w-5 h-5 border-2 border-gray-300 rounded relative peer-checked:bg-blue-600 peer-checked:border-blue-600">
                        {/* Custom checkmark handled by peer-checked in CSS or just use a lucide icon if easier */}
                      </div>
                      <service.icon className="w-6 h-6 text-gray-700" />
                      <div className="flex-1">
                        <div className="font-bold">{service.name}</div>
                        <div className="text-sm text-gray-500">{service.desc}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${service.price}</div>
                        <div className="text-xs text-gray-500">per day</div>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* SIDEBAR BOOKING */}
        <div className="product-sidebar lg:order-last order-first">
          <div className="booking-card bg-white p-8 rounded-2xl shadow-md sticky top-24">
            <h3 className="text-lg font-bold mb-6">Book This Car</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Pick-up Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="City or Airport" 
                    defaultValue="San Francisco Airport"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-lg outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Pick-up Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="dd.mm.yyyy" 
                    defaultValue="20.02.2026"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-lg outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Return Date</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="dd.mm.yyyy" 
                    defaultValue="21.02.2026"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-lg outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            <hr className="mb-6 border-gray-100" />

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>${car.price_per_day} × 1 day</span>
                <span>${car.price_per_day.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-blue-600">${car.price_per_day.toFixed(2)}</span>
              </div>
            </div>

            <div className="discount-box bg-blue-50 rounded-xl p-4 mb-6">
              <div className="font-semibold mb-2 text-sm">Available Discounts:</div>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• 10% off for 3-6 days</li>
                <li>• 15% off for 7-13 days</li>
                <li>• 20% off for 14-29 days</li>
                <li>• 25% off for 30+ days</li>
              </ul>
            </div>

            <button className="w-full bg-black text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-900 transition-colors">
              Book Now
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">
              Free cancellation up to 48 hours before pick-up
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
