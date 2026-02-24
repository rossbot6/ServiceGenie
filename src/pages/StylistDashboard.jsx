import { useState } from 'react';
import { Calendar, Clock, DollarSign, Users, ChevronLeft, ChevronRight, Settings, User, TrendingUp } from 'lucide-react';
import ProviderSchedule from '../components/ProviderSchedule';

export default function StylistDashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('schedule');
  
  // Mock current provider data
  const currentProvider = {
    id: 1,
    name: 'Emma Wilson',
    email: 'emma@servicegenie.com',
    phone: '(212) 555-0101',
    specialty: 'Senior Colorist',
    bio: 'Specialist in balayage and color corrections with 8 years experience',
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
    schedule_settings: null
  };
  
  const todayAppointments = [
    { id: 1, time: '10:00 AM', customer: 'John Smith', service: 'Full Balayage', price: 180, status: 'confirmed' },
    { id: 2, time: '1:00 PM', customer: 'Sarah Johnson', service: "Women's Haircut", price: 85, status: 'confirmed' },
    { id: 3, time: '3:30 PM', customer: 'Michael Davis', service: 'Root Touch-up', price: 95, status: 'pending' },
  ];
  
  const stats = [
    { label: 'Today\'s Revenue', value: '$360', icon: DollarSign },
    { label: 'Appointments', value: '3', icon: Calendar },
    { label: 'This Week', value: '$1,890', icon: TrendingUp, className: 'hidden sm:block' },
  ];
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 10 }, (_, i) => i + 9); // 9 AM to 6 PM
  
  const timeSlots = hours.flatMap(hour => [
    { time: `${hour}:00 AM`, appointments: hour === 10 ? 1 : 0 },
    { time: `${hour}:30 AM`, appointments: 0 },
  ]);
  
  const prevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };
  
  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stylist Dashboard</h1>
          <p className="text-gray-600">{currentProvider.name} - {currentProvider.specialty}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'schedule'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Schedule & Appointments
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Schedule Settings
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Profile
          </button>
        </nav>
      </div>

      {/* Schedule & Appointments Tab */}
      {activeTab === 'schedule' && (
        <div>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`card ${stat.className || ''}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Icon size={20} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Week View */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevWeek} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft size={20} />
          </button>
          <h2 className="font-semibold text-gray-900">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={nextWeek} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronRight size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day, idx) => {
            const date = new Date(currentDate);
            date.setDate(date.getDate() - date.getDay() + idx);
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <div
                key={day}
                className={`text-center p-2 ${
                  isToday ? 'bg-primary-50 rounded-lg' : ''
                }`}
              >
                <p className="text-xs text-gray-500">{day}</p>
                <p className={`font-medium ${isToday ? 'text-primary-600' : 'text-gray-900'}`}>
                  {date.getDate()}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Today's Schedule */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-4">Today's Schedule</h2>
        
        <div className="space-y-3">
          {todayAppointments.map((apt) => (
            <div
              key={apt.id}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-20 text-sm font-medium text-gray-600">{apt.time}</div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{apt.customer}</p>
                <p className="text-sm text-gray-500">{apt.service}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">${apt.price}</p>
                <span className={`badge text-xs ${
                  apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                  apt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {apt.status}
                </span>
              </div>
            </div>
          ))}
          
          {todayAppointments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No appointments scheduled
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Today's Total</span>
            <span className="font-semibold text-gray-900">
              ${todayAppointments.reduce((sum, apt) => sum + apt.price, 0)}
            </span>
          </div>
        </div>
      </div>
        </div>
      )}

      {/* Schedule Settings Tab */}
      {activeTab === 'settings' && (
        <ProviderSchedule
          provider={currentProvider}
          onSave={(scheduleData) => {
            console.log('Saving schedule:', scheduleData);
            // In a real app, this would save to the database
            setActiveTab('schedule');
          }}
          onCancel={() => setActiveTab('schedule')}
        />
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-4">Profile Information</h2>
            <div className="flex items-center gap-6">
              <img
                src={currentProvider.avatar_url}
                alt={currentProvider.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={currentProvider.name}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue={currentProvider.email}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      defaultValue={currentProvider.phone}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialty
                    </label>
                    <select className="w-full border rounded px-3 py-2">
                      <option value="Colorist">Colorist</option>
                      <option value="Stylist">Stylist</option>
                      <option value="Senior Stylist">Senior Stylist</option>
                      <option value="Master Stylist">Master Stylist</option>
                      <option value="Texture Specialist">Texture Specialist</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    defaultValue={currentProvider.bio}
                    rows="3"
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="mt-4">
                  <button className="btn btn-primary">Save Profile</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
