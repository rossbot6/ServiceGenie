import { Link } from 'react-router-dom';
import { Calendar, Users, Gift, DollarSign, Clock, MapPin, Star } from 'lucide-react';

export default function Home() {
  const services = [
    { id: 'haircut', name: "Women's Haircut", price: 85, duration: 60, category: 'Cut' },
    { id: 'color', name: 'Full Balayage', price: 180, duration: 180, category: 'Color' },
    { id: 'treatment', name: 'Keratin Treatment', price: 250, duration: 120, category: 'Treatment' },
    { id: 'style', name: 'Blowout', price: 55, duration: 45, category: 'Style' },
  ];
  
  const features = [
    { icon: Clock, title: 'Easy Booking', description: 'Book appointments in seconds' },
    { icon: MapPin, title: 'Multiple Locations', description: 'Find a salon near you' },
    { icon: Star, title: 'Top Stylists', description: 'Rated professionals' },
  ];
  
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Welcome to ServiceGenie
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Book your perfect salon experience. Premium services, expert stylists, and unforgettable results.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <Link to="/book/service" className="btn btn-primary flex items-center gap-2">
            <Calendar size={20} />
            Book Now
          </Link>
          <Link to="/admin" className="btn btn-secondary">
            Admin Dashboard
          </Link>
        </div>
      </section>
      
      {/* Services Preview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Popular Services</h2>
          <Link to="/admin/services" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service) => (
            <Link
              key={service.id}
              to={`/book/${service.id}`}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="badge bg-primary-50 text-primary-700">{service.category}</span>
                <span className="font-semibold text-gray-900">${service.price}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Clock size={14} />
                {service.duration} min
              </p>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="card text-center">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Icon size={24} className="text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          );
        })}
      </section>
      
      {/* Quick Links */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/loyalty" className="card hover:border-primary-200 border-2 border-transparent">
          <Gift size={32} className="text-primary-600 mb-2" />
          <h3 className="font-semibold">Loyalty Program</h3>
          <p className="text-sm text-gray-500">Earn points & rewards</p>
        </Link>
        <Link to="/payouts" className="card hover:border-primary-200 border-2 border-transparent">
          <DollarSign size={32} className="text-primary-600 mb-2" />
          <h3 className="font-semibold">Provider Payouts</h3>
          <p className="text-sm text-gray-500">Track commissions</p>
        </Link>
        <Link to="/group-booking" className="card hover:border-primary-200 border-2 border-transparent">
          <Users size={32} className="text-primary-600 mb-2" />
          <h3 className="font-semibold">Group Booking</h3>
          <p className="text-sm text-gray-500">Bridal parties & events</p>
        </Link>
        <Link to="/stylist/dashboard" className="card hover:border-primary-200 border-2 border-transparent">
          <Calendar size={32} className="text-primary-600 mb-2" />
          <h3 className="font-semibold">Stylist Dashboard</h3>
          <p className="text-sm text-gray-500">Manage schedule</p>
        </Link>
      </section>
    </div>
  );
}
