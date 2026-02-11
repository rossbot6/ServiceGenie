import { useState, useEffect } from 'react';
import { 
  Users, Calendar, DollarSign, Settings, 
  TrendingUp, Clock, Check, X, Plus, Search,
  BarChart3, Mail, MessageSquare, CreditCard,
  MapPin, Edit, Trash2, Building2, Phone
} from 'lucide-react';

// Sample locations data
const initialLocations = [
  { id: 1, name: 'Downtown Salon', address: '123 Main St, New York, NY 10001', phone: '(212) 555-0100', timezone: 'America/New_York', status: 'active' },
  { id: 2, name: 'Brooklyn Branch', address: '456 Atlantic Ave, Brooklyn, NY 11201', phone: '(718) 555-0200', timezone: 'America/New_York', status: 'active' },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview');
  const [locations, setLocations] = useState(initialLocations);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [locationForm, setLocationForm] = useState({ name: '', address: '', phone: '', timezone: 'America/New_York', status: 'active' });
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'locations', label: 'Locations', icon: Building2 },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'providers', label: 'Providers', icon: Users },
    { id: 'services', label: 'Services', icon: Plus },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'loyalty', label: 'Loyalty', icon: TrendingUp },
    { id: 'communications', label: 'Communications', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
  
  const stats = [
    { label: 'Total Revenue', value: '$12,845', change: '+12%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Appointments', value: '156', change: '+8%', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Customers', value: '89', change: '+15%', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Avg. Rating', value: '4.8', change: '+0.2', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];
  
  // Location management functions
  const handleAddLocation = () => {
    setEditingLocation(null);
    setLocationForm({ name: '', address: '', phone: '', timezone: 'America/New_York', status: 'active' });
    setShowLocationModal(true);
  };
  
  const handleEditLocation = (location) => {
    setEditingLocation(location);
    setLocationForm(location);
    setShowLocationModal(true);
  };
  
  const handleDeleteLocation = (id) => {
    if (confirm('Are you sure you want to delete this location?')) {
      setLocations(locations.filter(l => l.id !== id));
    }
  };
  
  const handleLocationSubmit = (e) => {
    e.preventDefault();
    if (editingLocation) {
      setLocations(locations.map(l => 
        l.id === editingLocation.id ? { ...locationForm, id: editingLocation.id } : l
      ));
    } else {
      setLocations([...locations, { ...locationForm, id: Date.now() }]);
    }
    setShowLocationModal(false);
  };
  
  const recentAppointments = [
    { id: 1, customer: 'John Smith', service: 'Full Balayage', provider: 'Emma Wilson', time: '10:00 AM', status: 'confirmed' },
    { id: 2, customer: 'Sarah Johnson', service: "Women's Haircut", provider: 'James Brown', time: '11:00 AM', status: 'confirmed' },
    { id: 3, customer: 'Michael Davis', service: 'Keratin Treatment', provider: 'Sofia Garcia', time: '2:00 PM', status: 'completed' },
    { id: 4, customer: 'Emily Rodriguez', service: 'Blowout', provider: 'Michael Chen', time: '9:00 AM', status: 'confirmed' },
  ];
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your salon operations</p>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-gray-100 rounded-lg overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>
      
      {/* Overview Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="card">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <p className="text-sm text-green-600 mt-1">{stat.change} from last week</p>
                    </div>
                    <div className={`p-2 rounded-lg ${stat.bg}`}>
                      <Icon size={20} className={stat.color} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Recent Appointments */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Recent Appointments</h2>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Service</th>
                    <th className="pb-3 font-medium">Provider</th>
                    <th className="pb-3 font-medium">Time</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentAppointments.map((apt) => (
                    <tr key={apt.id} className="text-sm">
                      <td className="py-3 font-medium text-gray-900">{apt.customer}</td>
                      <td className="py-3 text-gray-600">{apt.service}</td>
                      <td className="py-3 text-gray-600">{apt.provider}</td>
                      <td className="py-3 text-gray-600">{apt.time}</td>
                      <td className="py-3">
                        <span className={`badge ${
                          apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          apt.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Check size={16} className="text-green-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <X size={16} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Locations Tab */}
      {activeTab === 'locations' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Manage Locations</h2>
              <p className="text-sm text-gray-500">Add, edit, or delete salon locations</p>
            </div>
            <button 
              onClick={handleAddLocation}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              Add Location
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((location) => (
              <div key={location.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <MapPin size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{location.name}</h3>
                      <span className={`badge ${
                        location.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {location.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleEditLocation(location)}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteLocation(location.id)}
                      className="p-1.5 hover:bg-red-50 rounded text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={14} />
                    {location.address}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={14} />
                    {location.phone}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={14} />
                    {location.timezone}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {locations.length === 0 && (
            <div className="card text-center py-12">
              <MapPin size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No locations yet</p>
              <button 
                onClick={handleAddLocation}
                className="btn-primary mt-4"
              >
                Add Your First Location
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Placeholder for other tabs */}
      {activeTab !== 'overview' && activeTab !== 'locations' && (
        <div className="card text-center py-12">
          <p className="text-gray-500">
            {tabs.find(t => t.id === activeTab)?.label} section - Coming soon
          </p>
        </div>
      )}
      
      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingLocation ? 'Edit Location' : 'Add New Location'}
              </h2>
              <button 
                onClick={() => setShowLocationModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleLocationSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location Name
                </label>
                <input
                  type="text"
                  value={locationForm.name}
                  onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Downtown Salon"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={locationForm.address}
                  onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Main St, City, State ZIP"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={locationForm.phone}
                  onChange={(e) => setLocationForm({ ...locationForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(212) 555-0100"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <select
                  value={locationForm.timezone}
                  onChange={(e) => setLocationForm({ ...locationForm, timezone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={locationForm.status}
                  onChange={(e) => setLocationForm({ ...locationForm, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowLocationModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingLocation ? 'Save Changes' : 'Add Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
