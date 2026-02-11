import { useState } from 'react';
import { Calendar, Clock, MapPin, User, Scissors, ChevronRight, Plus, Star } from 'lucide-react';

export default function MyBookings() {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // Sample customer data - in production this would come from auth/user data
  const customer = {
    name: 'John Smith',
    email: 'john@email.com',
    phone: '(212) 555-1001'
  };
  
  // Sample bookings data
  const bookings = [
    {
      id: 1,
      date: '2026-02-15',
      time: '10:00 AM',
      service: 'Full Balayage',
      provider: 'Emma Wilson',
      location: 'Downtown Salon',
      price: 180,
      status: 'confirmed'
    },
    {
      id: 2,
      date: '2026-02-20',
      time: '2:00 PM',
      service: "Women's Haircut",
      provider: 'James Brown',
      location: 'Uptown Studio',
      price: 85,
      status: 'pending'
    },
    {
      id: 3,
      date: '2026-01-10',
      time: '11:00 AM',
      service: 'Keratin Treatment',
      provider: 'Sofia Garcia',
      location: 'Downtown Salon',
      price: 250,
      status: 'completed'
    },
    {
      id: 4,
      date: '2026-01-05',
      time: '3:00 PM',
      service: 'Blowout',
      provider: 'Michael Chen',
      location: 'Midtown Spa',
      price: 55,
      status: 'completed'
    }
  ];
  
  const upcomingBookings = bookings.filter(b => b.status !== 'completed');
  const pastBookings = bookings.filter(b => b.status === 'completed');
  
  const upcomingTotal = upcomingBookings.reduce((sum, b) => sum + b.price, 0);
  const pastTotal = pastBookings.reduce((sum, b) => sum + b.price, 0);
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600">Manage your appointments and booking history</p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <p className="text-sm text-gray-500">Upcoming</p>
          <p className="text-2xl font-bold text-blue-600">{upcomingBookings.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600">{pastBookings.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Upcoming Value</p>
          <p className="text-2xl font-bold text-blue-600">${upcomingTotal}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Total Spent</p>
          <p className="text-2xl font-bold text-green-600">${pastTotal}</p>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'upcoming'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'past'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Past Appointments
        </button>
      </div>
      
      {/* Upcoming Bookings */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {upcomingBookings.length === 0 ? (
            <div className="card text-center py-12">
              <Calendar size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 mb-4">No upcoming appointments</p>
              <a href="/book/service" className="btn-primary inline-flex items-center gap-2">
                <Plus size={18} />
                Book Now
              </a>
            </div>
          ) : (
            upcomingBookings.map(booking => (
              <div key={booking.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Scissors size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{booking.service}</h3>
                      <p className="text-sm text-gray-500">{booking.provider}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(booking.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {booking.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {booking.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${booking.price}</p>
                    <span className={`badge mt-1 ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 text-sm">
                    Reschedule
                  </button>
                  <button className="flex-1 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      {/* Past Bookings */}
      {activeTab === 'past' && (
        <div className="space-y-4">
          {pastBookings.length === 0 ? (
            <div className="card text-center py-12">
              <Clock size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No past appointments</p>
            </div>
          ) : (
            pastBookings.map(booking => (
              <div key={booking.id} className="card opacity-75">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Scissors size={24} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{booking.service}</h3>
                      <p className="text-sm text-gray-500">{booking.provider}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(booking.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {booking.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${booking.price}</p>
                    <span className="badge bg-gray-100 text-gray-600 mt-1">Completed</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <button className="ml-auto text-sm text-blue-600 hover:text-blue-700">
                    Leave Review
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      {/* Book New Button (Floating) */}
      <a 
        href="/book/service"
        className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
      >
        <Plus size={20} />
        Book New
      </a>
    </div>
  );
}
