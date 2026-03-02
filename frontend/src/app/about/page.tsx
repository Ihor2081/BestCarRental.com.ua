import { 
  Heart, Shield, Award, TrendingUp, 
  Globe, Users, Car, MapPin, 
  ShieldCheck, PhoneCall 
} from "lucide-react";

export default function AboutPage() {
  return (
    <main>
      {/* HERO SECTION */}
      <section className="about-hero bg-gradient-to-br from-blue-600 to-blue-800 text-white py-32 text-center">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-5xl font-extrabold mb-4">About DriveAway</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            We're revolutionizing car rentals by combining premium vehicles, exceptional service, and cutting-edge technology to make your journey unforgettable.
          </p>
        </div>
      </section>

      {/* OUR STORY SECTION */}
      <section className="container mx-auto px-4 max-w-7xl py-20">
        <div className="story-grid grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="story-content">
            <h2 className="text-4xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Founded in 2018, DriveAway began with a simple mission: to make car rental accessible, affordable, and enjoyable for everyone. What started as a small fleet of 20 vehicles has grown into a nationwide service with over 5,000 premium cars.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We recognized that traditional car rental was often frustrating, with hidden fees, poor service, and limited choices. We set out to change that by putting customers first and leveraging technology to create a seamless experience from booking to return.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today, we're proud to serve over 100,000 customers annually across 50+ locations, maintaining our commitment to quality, transparency, and exceptional service.
            </p>
          </div>
          <div className="story-image">
            <img 
              src="https://images.unsplash.com/photo-1522071823991-b1ae5e6a3048?q=80&w=2070&auto=format&fit=crop" 
              alt="Our Team" 
              className="rounded-2xl shadow-xl w-full"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* NUMBERS SECTION */}
      <section className="numbers-section bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-16">DriveAway by the Numbers</h2>
          <div className="numbers-grid grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: "5,000+", label: "Vehicles Available" },
              { value: "50+", label: "Locations" },
              { value: "100K+", label: "Happy Customers" },
              { value: "4.8★", label: "Average Rating" },
            ].map((item, i) => (
              <div key={i} className="number-item">
                <div className="text-5xl font-extrabold mb-2">{item.value}</div>
                <div className="text-sm opacity-80 uppercase tracking-wider font-semibold">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE VALUES SECTION */}
      <section className="container mx-auto px-4 max-w-7xl py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Our Core Values</h2>
        <div className="values-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Heart, title: "Customer First", desc: "Every decision we make is guided by what's best for our customers. Your satisfaction is our top priority." },
            { icon: Shield, title: "Trust & Transparency", desc: "No hidden fees, no surprises. We believe in honest pricing and clear communication at every step." },
            { icon: Award, title: "Excellence", desc: "We maintain the highest standards in vehicle quality, cleanliness, and customer service." },
            { icon: TrendingUp, title: "Innovation", desc: "We continuously improve our platform and services to provide the best car rental experience." },
            { icon: Globe, title: "Sustainability", desc: "Committed to reducing our carbon footprint with electric and hybrid vehicles in our fleet." },
            { icon: Users, title: "Community", desc: "We support local communities and partner with businesses to create positive impact." },
          ].map((value, i) => (
            <div key={i} className="value-card bg-white p-10 rounded-2xl shadow-sm text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <value.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">{value.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LEADERSHIP SECTION */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-4xl font-bold text-center mb-4">Meet Our Leadership Team</h2>
          <p className="text-gray-500 text-center mb-16">Passionate professionals dedicated to transforming your car rental experience</p>
          
          <div className="leadership-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Sarah Johnson", role: "Chief Executive Officer", desc: "15+ years of experience in automotive and hospitality industries", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop" },
              { name: "Michael Chen", role: "Chief Operations Officer", desc: "Expert in fleet management and operational excellence", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop" },
              { name: "Maya Patel", role: "Head of Customer Experience", desc: "Passionate about delivering exceptional customer service", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop" },
              { name: "James Williams", role: "Head of Technology", desc: "Driving digital innovation in the car rental industry", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop" },
            ].map((leader, i) => (
              <div key={i} className="leader-card bg-white rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <img src={leader.img} alt={leader.name} className="w-full h-72 object-cover" referrerPolicy="no-referrer" />
                <div className="leader-info p-6">
                  <h4 className="text-lg font-bold">{leader.name}</h4>
                  <div className="text-blue-600 text-sm mb-4 font-semibold">{leader.role}</div>
                  <p className="text-gray-500 text-xs leading-relaxed">{leader.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="container mx-auto px-4 max-w-7xl py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Why Choose DriveAway?</h2>
        <div className="why-grid grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { icon: Car, title: "Premium Fleet", desc: "From compact cars to luxury SUVs, our diverse fleet features the latest models maintained to the highest standards." },
            { icon: MapPin, title: "Convenient Locations", desc: "With 50+ pickup locations across major cities and airports, we're always nearby when you need us." },
            { icon: ShieldCheck, title: "Flexible Policies", desc: "Free cancellation up to 48 hours, no hidden fees, and flexible pickup/return options for your convenience." },
            { icon: PhoneCall, title: "24/7 Support", desc: "Our customer support team is available around the clock to assist you with any questions or concerns." },
          ].map((why, i) => (
            <div key={i} className="why-card bg-white p-8 rounded-2xl flex gap-6 items-start shadow-sm">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <why.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">{why.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{why.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
