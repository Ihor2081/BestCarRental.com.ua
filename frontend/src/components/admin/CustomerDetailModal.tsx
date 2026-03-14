"use client";

import { X, Mail, Phone, MapPin, FileText, Calendar, DollarSign } from "lucide-react";
import { Customer } from "@/types";

interface CustomerDetailModalProps {
  customer: Customer;
  onClose: () => void;
}

export default function CustomerDetailModal({ customer, onClose }: CustomerDetailModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl rounded-[32px] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-black tracking-tight">Customer Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8">
          {/* Header Info */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-24 h-24 bg-black rounded-3xl flex items-center justify-center text-white text-3xl font-black">
              {customer.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="text-3xl font-black mb-2">{customer.name}</h3>
              <div className="flex flex-wrap gap-4 text-gray-500">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{customer.email}</span>
                </div>
                {customer.phone && (
                  <div className="items-center gap-2 flex">
                    <Phone className="w-4 h-4" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {new Date(customer.member_since).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-2xl">
              <div className="text-gray-500 text-sm mb-1">Total Bookings</div>
              <div className="text-2xl font-black">{customer.bookings_count}</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl">
              <div className="text-gray-500 text-sm mb-1">Total Spent</div>
              <div className="text-2xl font-black text-emerald-600">${customer.total_spent.toLocaleString()}</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl">
              <div className="text-gray-500 text-sm mb-1">Reward Points</div>
              <div className="text-2xl font-black text-blue-600">{Math.floor(customer.total_spent / 10)}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-black text-lg">Personal Information</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase">Address</div>
                    <div className="font-semibold">{customer.address || "Not provided"}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase">Driver's License</div>
                    <div className="font-semibold">{customer.drivers_license || "Not provided"}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-black text-lg">Payment Methods</h4>
              <div className="p-4 border border-gray-100 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <div className="font-bold">Visa ending in 4242</div>
                  <div className="text-xs text-gray-500">Expires 12/26</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-black text-lg">Booking History</h4>
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-xs font-bold uppercase text-gray-400">Booking ID</th>
                    <th className="p-4 text-xs font-bold uppercase text-gray-400">Vehicle</th>
                    <th className="p-4 text-xs font-bold uppercase text-gray-400">Dates</th>
                    <th className="p-4 text-xs font-bold uppercase text-gray-400">Total</th>
                    <th className="p-4 text-xs font-bold uppercase text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.booking_history?.map((b) => (
                    <tr key={b.id} className="border-t border-gray-50">
                      <td className="p-4 font-bold">#{b.id}</td>
                      <td className="p-4 font-semibold">{b.car_name}</td>
                      <td className="p-4 text-sm text-gray-500">
                        {new Date(b.start_date).toLocaleDateString()} - {new Date(b.end_date).toLocaleDateString()}
                      </td>
                      <td className="p-4 font-black">${b.total_price}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                          b.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          b.status === 'active' ? 'bg-blue-100 text-blue-700' :
                          b.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {(!customer.booking_history || customer.booking_history.length === 0) && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400 font-bold">No bookings found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}