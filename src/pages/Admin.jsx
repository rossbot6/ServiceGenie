import { useState, useEffect } from 'react';
import { 
  Users, Calendar, DollarSign, Settings, 
  TrendingUp, Clock, Check, X, Plus, Search,
  BarChart3, Mail, MessageSquare, CreditCard,
  MapPin, Edit, Trash2, Building2, Phone,
  Star, Mail as MailIcon, Award, CalendarCheck,
  User, Tag, Heart, MessageCircle, Scissors,
  Timer, Package, Download
} from 'lucide-react';

// Sample locations data
const initialLocations = [
  { id: 1, name: 'Downtown Salon', address: '123 Main St, New York, NY 10001', phone: '(212) 555-0100', timezone: 'America/New_York', status: 'active' },
  { id: 2, name: 'Brooklyn Branch', address: '456 Atlantic Ave, Brooklyn, NY 11201', phone: '(718) 555-0200', timezone: 'America/New_York', status: 'active' },
];

// Sample providers data
const initialProviders = [
  { id: 1, name: 'Emma Wilson', email: 'emma@servicegenie.com', phone: '(212) 555-0101', locationId: 1, specialty: 'Colorist', status: 'active', rating: 4.9, appointments: 156, revenue: 24500 },
  { id: 2, name: 'James Brown', email: 'james@servicegenie.com', phone: '(212) 555-0102', locationId: 1, specialty: 'Stylist', status: 'active', rating: 4.7, appointments: 134, revenue: 18900 },
  { id: 3, name: 'Sofia Garcia', email: 'sofia@servicegenie.com', phone: '(718) 555-0201', locationId: 2, specialty: 'Senior Stylist', status: 'active', rating: 4.8, appointments: 178, revenue: 31200 },
  { id: 4, name: 'Michael Chen', email: 'michael@servicegenie.com', phone: '(718) 555-0202', locationId: 2, specialty: 'Stylist', status: 'active', rating: 4.6, appointments: 112, revenue: 15600 },
];

// Sample customers data
const initialCustomers = [
  { id: 1, name: 'John Smith', email: 'john@email.com', phone: '(212) 555-1001', visits: 12, totalSpent: 2450, tags: ['VIP', 'Regular'], notes: 'Prefers Emma for color', preferredProvider: 'Emma Wilson', lastVisit: '2026-02-08' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah@email.com', phone: '(212) 555-1002', visits: 8, totalSpent: 1890, tags: ['Regular'], notes: 'Allergic to sulfates', preferredProvider: 'James Brown', lastVisit: '2026-02-05' },
  { id: 3, name: 'Michael Davis', email: 'michael@email.com', phone: '(718) 555-2001', visits: 5, totalSpent: 3200, tags: ['VIP'], notes: '', preferredProvider: 'Sofia Garcia', lastVisit: '2026-02-10' },
  { id: 4, name: 'Emily Rodriguez', email: 'emily@email.com', phone: '(718) 555-2002', visits: 3, totalSpent: 520, tags: ['New'], notes: 'First time balayage', preferredProvider: 'Michael Chen', lastVisit: '2026-02-01' },
  { id: 5, name: 'David Lee', email: 'david@email.com', phone: '(212) 555-1003', visits: 15, totalSpent: 4100, tags: ['VIP', 'Regular'], notes: 'Always requests afternoon slots', preferredProvider: 'Emma Wilson', lastVisit: '2026-02-09' },
];

// Sample services data
const initialServices = [
  { id: 1, name: "Women's Haircut", category: 'Cut', price: 85, duration: 60, description: 'Professional haircut styled to perfection' },
  { id: 2, name: "Men's Haircut", category: 'Cut', price: 45, duration: 30, description: "Clean and modern men's styling" },
  { id: 3, name: 'Full Balayage', category: 'Color', price: 180, duration: 180, description: 'Hand-painted highlights for natural look' },
  { id: 4, name: 'Partial Highlights', category: 'Color', price: 120, duration: 120, description: 'Partial head highlights and toning' },
  { id: 5, name: 'Keratin Treatment', category: 'Treatment', price: 250, duration: 120, description: 'Smoothing keratin blowout' },
  { id: 6, name: 'Blowout', category: 'Style', price: 55, duration: 45, description: 'Voluminous blowout styling' },
  { id: 7, name: 'Updo', category: 'Style', price: 150, duration: 90, description: 'Elegant updo for special occasions' },
  { id: 8, name: 'Scalp Treatment', category: 'Treatment', price: 75, duration: 45, description: 'Rejuvenating scalp massage and treatment' },
];

// Sample appointments data
const initialAppointments = [
  { id: 1, customer: 'John Smith', service: 'Full Balayage', provider: 'Emma Wilson', date: '2026-02-11', time: '10:00 AM', status: 'confirmed', price: 180 },
  { id: 2, customer: 'Sarah Johnson', service: "Women's Haircut", provider: 'James Brown', date: '2026-02-11', time: '11:00 AM', status: 'confirmed', price: 85 },
  { id: 3, customer: 'Michael Davis', service: 'Keratin Treatment', provider: 'Sofia Garcia', date: '2026-02-11', time: '2:00 PM', status: 'completed', price: 250 },
  { id: 4, customer: 'Emily Rodriguez', service: 'Blowout', provider: 'Michael Chen', date: '2026-02-11', time: '9:00 AM', status: 'confirmed', price: 55 },
  { id: 5, customer: 'David Lee', service: 'Full Balayage', provider: 'Emma Wilson', date: '2026-02-12', time: '3:00 PM', status: 'pending', price: 180 },
  { id: 6, customer: 'Lisa Wang', service: "Women's Haircut", provider: 'James Brown', date: '2026-02-12', time: '10:00 AM', status: 'confirmed', price: 85 },
  { id: 7, customer: 'Robert Taylor', service: 'Scalp Treatment', provider: 'Sofia Garcia', date: '2026-02-12', time: '1:00 PM', status: 'pending', price: 75 },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview');
  const [locations, setLocations] = useState(initialLocations);
  const [providers, setProviders] = useState(initialProviders);
  const [customers, setCustomers] = useState(initialCustomers);
  const [services, setServices] = useState(initialServices);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [editingProvider, setEditingProvider] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [locationForm, setLocationForm] = useState({ name: '', address: '', phone: '', timezone: 'America/New_York', status: 'active' });
  const [providerForm, setProviderForm] = useState({ name: '', email: '', phone: '', locationId: 1, specialty: '', status: 'active' });
  
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
  
  // Provider management functions
  const handleAddProvider = () => {
    setEditingProvider(null);
    setProviderForm({ name: '', email: '', phone: '', locationId: locations[0]?.id || 1, specialty: '', status: 'active' });
    setShowProviderModal(true);
  };
  
  const handleEditProvider = (provider) => {
    setEditingProvider(provider);
    setProviderForm(provider);
    setShowProviderModal(true);
  };
  
  const handleDeleteProvider = (id) => {
    if (confirm('Are you sure you want to delete this provider?')) {
      setProviders(providers.filter(p => p.id !== id));
    }
  };
  
  const handleProviderSubmit = (e) => {
    e.preventDefault();
    if (editingProvider) {
      setProviders(providers.map(p => 
        p.id === editingProvider.id ? { ...providerForm, id: editingProvider.id } : p
      ));
    } else {
      setProviders([...providers, { ...providerForm, id: Date.now(), rating: 0, appointments: 0, revenue: 0 }]);
    }
    setShowProviderModal(false);
  };
  
  // Customer management functions
  const [customerForm, setCustomerForm] = useState({ name: '', email: '', phone: '', tags: [], notes: '', preferredProvider: '' });
  const [editingCustomer, setEditingCustomer] = useState(null);
  
  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setCustomerForm({ name: '', email: '', phone: '', tags: [], notes: '', preferredProvider: '' });
    setShowCustomerModal(true);
  };
  
  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setCustomerForm(customer);
    setShowCustomerModal(true);
  };
  
  const handleDeleteCustomer = (id) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };
  
  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    if (editingCustomer) {
      setCustomers(customers.map(c => 
        c.id === editingCustomer.id ? { ...customerForm, id: editingCustomer.id } : c
      ));
    } else {
      setCustomers([...customers, { ...customerForm, id: Date.now(), visits: 0, totalSpent: 0, lastVisit: null }]);
    }
    setShowCustomerModal(false);
  };
  
  const toggleCustomerTag = (tag) => {
    if (customerForm.tags.includes(tag)) {
      setCustomerForm({ ...customerForm, tags: customerForm.tags.filter(t => t !== tag) });
    } else {
      setCustomerForm({ ...customerForm, tags: [...customerForm.tags, tag] });
    }
  };
  
  const handleCustomerExport = () => {
    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'Visits', 'Total Spent', 'Tags', 'Preferred Provider', 'Last Visit'];
    const rows = customers.map(c => [
      c.name,
      c.email,
      c.phone || '',
      c.visits,
      c.totalSpent,
      c.tags.join(', '),
      c.preferredProvider || '',
      c.lastVisit || 'N/A'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `customers_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };
  
  // Service management functions
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({ name: '', category: 'Cut', price: 0, duration: 30, description: '' });
  
  const handleAddService = () => {
    setEditingService(null);
    setServiceForm({ name: '', category: 'Cut', price: 0, duration: 30, description: '' });
    setShowServiceModal(true);
  };
  
  const handleEditService = (service) => {
    setEditingService(service);
    setServiceForm(service);
    setShowServiceModal(true);
  };
  
  const handleDeleteService = (id) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };
  
  const handleServiceSubmit = (e) => {
    e.preventDefault();
    if (editingService) {
      setServices(services.map(s => 
        s.id === editingService.id ? { ...serviceForm, id: editingService.id } : s
      ));
    } else {
      setServices([...services, { ...serviceForm, id: Date.now() }]);
    }
    setShowServiceModal(false);
  };
  
  // Appointment management functions
  const [appointmentForm, setAppointmentForm] = useState({ 
    customer: '', service: '', provider: '', date: '', time: '', status: 'pending' 
  });
  
  const handleAddAppointment = () => {
    setEditingAppointment(null);
    setAppointmentForm({ customer: '', service: '', provider: '', date: '', time: '', status: 'pending' });
    setShowAppointmentModal(true);
  };
  
  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setAppointmentForm(appointment);
    setShowAppointmentModal(true);
  };
  
  const handleDeleteAppointment = (id) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      setAppointments(appointments.filter(a => a.id !== id));
    }
  };
  
  const handleAppointmentSubmit = (e) => {
    e.preventDefault();
    const service = services.find(s => s.name === appointmentForm.service);
    const price = service?.price || 0;
    if (editingAppointment) {
      setAppointments(appointments.map(a => 
        a.id === editingAppointment.id ? { ...appointmentForm, price, id: editingAppointment.id } : a
      ));
    } else {
      setAppointments([...appointments, { ...appointmentForm, price, id: Date.now() }]);
    }
    setShowAppointmentModal(false);
  };
  
  const handleConfirmAppointment = (id) => {
    setAppointments(appointments.map(a => 
      a.id === id ? { ...a, status: 'confirmed' } : a
    ));
  };
  
  const handleCompleteAppointment = (id) => {
    setAppointments(appointments.map(a => 
      a.id === id ? { ...a, status: 'completed' } : a
    ));
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
      
      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Appointments Dashboard</h2>
              <p className="text-sm text-gray-500">Manage all appointments and scheduling</p>
            </div>
            <button 
              onClick={handleAddAppointment}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              New Appointment
            </button>
          </div>
          
          {/* Appointment Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="card">
              <p className="text-sm text-gray-500">Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(a => a.date === '2026-02-11').length}
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">
                {appointments.filter(a => a.status === 'confirmed').length}
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-amber-600">
                {appointments.filter(a => a.status === 'pending').length}
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-blue-600">
                {appointments.filter(a => a.status === 'completed').length}
              </p>
            </div>
          </div>
          
          {/* Calendar View */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Calendar - February 2026</h3>
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
              {/* Calendar days */}
              {[...Array(28)].map((_, i) => {
                const day = i + 1;
                const dayAppointments = appointments.filter(a => {
                  const aptDate = new Date(a.date);
                  return aptDate.getDate() === day && aptDate.getMonth() === 1;
                });
                const isToday = day === 11;
                return (
                  <div 
                    key={day}
                    className={`min-h-20 p-2 border rounded-lg ${
                      isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                      {day}
                    </div>
                    <div className="mt-1 space-y-1">
                      {dayAppointments.slice(0, 2).map(apt => (
                        <div 
                          key={apt.id}
                          className={`text-xs p-1 rounded ${
                            apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            apt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {apt.time} - {apt.customer.split(' ')[0]}
                        </div>
                      ))}
                      {dayAppointments.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayAppointments.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* All Appointments List */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">All Appointments</h3>
              <div className="flex items-center gap-2">
                <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm">
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Time</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Service</th>
                    <th className="px-4 py-3 font-medium">Provider</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="text-sm">
                      <td className="px-4 py-3 text-gray-900">{apt.date}</td>
                      <td className="px-4 py-3 text-gray-600">{apt.time}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{apt.customer}</td>
                      <td className="px-4 py-3 text-gray-600">{apt.service}</td>
                      <td className="px-4 py-3 text-gray-600">{apt.provider}</td>
                      <td className="px-4 py-3 text-green-600 font-medium">${apt.price}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${
                          apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          apt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                          apt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {apt.status === 'pending' && (
                            <button 
                              onClick={() => handleConfirmAppointment(apt.id)}
                              className="p-1.5 hover:bg-green-50 rounded text-green-600"
                              title="Confirm"
                            >
                              <Check size={14} />
                            </button>
                          )}
                          {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                            <button 
                              onClick={() => handleCompleteAppointment(apt.id)}
                              className="p-1.5 hover:bg-blue-50 rounded text-blue-600"
                              title="Complete"
                            >
                              <CalendarCheck size={14} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleEditAppointment(apt)}
                            className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteAppointment(apt.id)}
                            className="p-1.5 hover:bg-red-50 rounded text-red-600"
                            title="Cancel"
                          >
                            <X size={14} />
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
      
      {/* Providers Tab */}
      {activeTab === 'providers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Manage Providers</h2>
              <p className="text-sm text-gray-500">Add, edit, or manage stylist accounts</p>
            </div>
            <button 
              onClick={handleAddProvider}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              Add Provider
            </button>
          </div>
          
          {/* Provider Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="card">
              <p className="text-sm text-gray-500">Total Providers</p>
              <p className="text-2xl font-bold text-gray-900">{providers.length}</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-green-600">{providers.filter(p => p.status === 'active').length}</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">Avg Rating</p>
              <p className="text-2xl font-bold text-amber-600">
                {(providers.reduce((acc, p) => acc + p.rating, 0) / providers.length).toFixed(1)}
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                ${providers.reduce((acc, p) => acc + p.revenue, 0).toLocaleString()}
              </p>
            </div>
          </div>
          
          {/* Provider Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map((provider) => {
              const location = locations.find(l => l.id === provider.locationId);
              return (
                <div key={provider.id} className="card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-lg">
                          {provider.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{provider.name}</h3>
                        <p className="text-sm text-gray-500">{provider.specialty}</p>
                      </div>
                    </div>
                    <span className={`badge ${
                      provider.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {provider.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MailIcon size={14} />
                      {provider.email}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={14} />
                      {provider.phone}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={14} />
                      {location?.name || 'Unassigned'}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-amber-500 fill-amber-500" />
                        <span className="font-medium">{provider.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarCheck size={14} className="text-blue-500" />
                        <span>{provider.appointments}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} className="text-green-500" />
                        <span>${provider.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleEditProvider(provider)}
                        className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProvider(provider.id)}
                        className="p-1.5 hover:bg-red-50 rounded text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {providers.length === 0 && (
            <div className="card text-center py-12">
              <Users size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No providers yet</p>
              <button 
                onClick={handleAddProvider}
                className="btn-primary mt-4"
              >
                Add Your First Provider
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Placeholder for unimplemented tabs */}
      {!['overview', 'locations', 'appointments', 'customers', 'providers', 'services', 'payments', 'loyalty'].includes(activeTab) && (
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
      
      {/* Provider Modal */}
      {showProviderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingProvider ? 'Edit Provider' : 'Add New Provider'}
              </h2>
              <button 
                onClick={() => setShowProviderModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleProviderSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={providerForm.name}
                  onChange={(e) => setProviderForm({ ...providerForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Emma Wilson"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={providerForm.email}
                  onChange={(e) => setProviderForm({ ...providerForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="emma@servicegenie.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={providerForm.phone}
                  onChange={(e) => setProviderForm({ ...providerForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(212) 555-0100"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  value={providerForm.locationId}
                  onChange={(e) => setProviderForm({ ...providerForm, locationId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>{location.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialty
                </label>
                <input
                  type="text"
                  value={providerForm.specialty}
                  onChange={(e) => setProviderForm({ ...providerForm, specialty: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Colorist, Senior Stylist"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={providerForm.status}
                  onChange={(e) => setProviderForm({ ...providerForm, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProviderModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingProvider ? 'Save Changes' : 'Add Provider'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Customers Tab */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Manage Customers</h2>
              <p className="text-sm text-gray-500">View and manage customer profiles</p>
            </div>
            <button 
              onClick={handleAddCustomer}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              Add Customer
            </button>
          </div>
          
          {/* Customer Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="card">
              <p className="text-sm text-gray-500">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">VIP Customers</p>
              <p className="text-2xl font-bold text-amber-600">{customers.filter(c => c.tags.includes('VIP')).length}</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">Total Visits</p>
              <p className="text-2xl font-bold text-blue-600">{customers.reduce((acc, c) => acc + c.visits, 0)}</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                ${customers.reduce((acc, c) => acc + c.totalSpent, 0).toLocaleString()}
              </p>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Customer Table */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
              <span className="text-sm font-medium text-gray-700">Customers ({customers.length})</span>
              <button
                onClick={handleCustomerExport}
                className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
              >
                <Download size={16} />
                Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Contact</th>
                    <th className="px-4 py-3 font-medium">Visits</th>
                    <th className="px-4 py-3 font-medium">Total Spent</th>
                    <th className="px-4 py-3 font-medium">Tags</th>
                    <th className="px-4 py-3 font-medium">Preferred Provider</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="text-sm">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <User size={14} className="text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{customer.name}</p>
                            <p className="text-xs text-gray-500">Last: {customer.lastVisit || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <p>{customer.email}</p>
                        <p className="text-xs">{customer.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-900 font-medium">{customer.visits}</td>
                      <td className="px-4 py-3 text-green-600 font-medium">${customer.totalSpent.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {customer.tags.map(tag => (
                            <span key={tag} className={`badge ${
                              tag === 'VIP' ? 'bg-amber-100 text-amber-700' :
                              tag === 'Regular' ? 'bg-green-100 text-green-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{customer.preferredProvider}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button 
                            onClick={() => handleEditCustomer(customer)}
                            className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="p-1.5 hover:bg-red-50 rounded text-red-600"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {customers.length === 0 && (
            <div className="card text-center py-12">
              <User size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No customers yet</p>
              <button 
                onClick={handleAddCustomer}
                className="btn-primary mt-4"
              >
                Add Your First Customer
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Customer Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
              </h2>
              <button 
                onClick={() => setShowCustomerModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleCustomerSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., John Smith"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={customerForm.email}
                  onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(212) 555-0100"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Provider
                </label>
                <select
                  value={customerForm.preferredProvider}
                  onChange={(e) => setCustomerForm({ ...customerForm, preferredProvider: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None</option>
                  {providers.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {['VIP', 'Regular', 'New'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleCustomerTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        customerForm.tags.includes(tag)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={customerForm.notes}
                  onChange={(e) => setCustomerForm({ ...customerForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Any special notes about this customer..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCustomerModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingCustomer ? 'Save Changes' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Manage Services</h2>
              <p className="text-sm text-gray-500">Add, edit, or manage salon services</p>
            </div>
            <button 
              onClick={handleAddService}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={18} />
              Add Service
            </button>
          </div>
          
          {/* Service Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="card">
              <p className="text-sm text-gray-500">Total Services</p>
              <p className="text-2xl font-bold text-gray-900">{services.length}</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">Categories</p>
              <p className="text-2xl font-bold text-blue-600">
                {new Set(services.map(s => s.category)).size}
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">Avg Price</p>
              <p className="text-2xl font-bold text-green-600">
                ${Math.round(services.reduce((acc, s) => acc + s.price, 0) / services.length)}
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">Avg Duration</p>
              <p className="text-2xl font-bold text-amber-600">
                {Math.round(services.reduce((acc, s) => acc + s.duration, 0) / services.length)}min
              </p>
            </div>
          </div>
          
          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div key={service.id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      service.category === 'Cut' ? 'bg-blue-50' :
                      service.category === 'Color' ? 'bg-purple-50' :
                      service.category === 'Style' ? 'bg-pink-50' :
                      'bg-green-50'
                    }`}>
                      <Scissors size={20} className={
                        service.category === 'Cut' ? 'text-blue-600' :
                        service.category === 'Color' ? 'text-purple-600' :
                        service.category === 'Style' ? 'text-pink-600' :
                        'text-green-600'
                      } />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{service.name}</h3>
                      <span className="badge bg-gray-100 text-gray-700">{service.category}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleEditService(service)}
                      className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteService(service.id)}
                      className="p-1.5 hover:bg-red-50 rounded text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <DollarSign size={14} className="text-green-600" />
                      <span className="font-medium">${service.price}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Timer size={14} className="text-amber-600" />
                      <span>{service.duration}min</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {services.length === 0 && (
            <div className="card text-center py-12">
              <Package size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No services yet</p>
              <button 
                onClick={handleAddService}
                className="btn-primary mt-4"
              >
                Add Your First Service
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Service Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button 
                onClick={() => setShowServiceModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleServiceSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Women's Haircut"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={serviceForm.category}
                  onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Cut">Cut</option>
                  <option value="Color">Color</option>
                  <option value="Style">Style</option>
                  <option value="Treatment">Treatment</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={serviceForm.price}
                  onChange={(e) => setServiceForm({ ...serviceForm, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="85"
                  min="0"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={serviceForm.duration}
                  onChange={(e) => setServiceForm({ ...serviceForm, duration: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="60"
                  min="5"
                  step="5"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Brief description of the service..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowServiceModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingService ? 'Save Changes' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Appointment Modal */}
      {showAppointmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingAppointment ? 'Edit Appointment' : 'New Appointment'}
              </h2>
              <button 
                onClick={() => setShowAppointmentModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleAppointmentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer
                </label>
                <select
                  value={appointmentForm.customer}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, customer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select customer</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service
                </label>
                <select
                  value={appointmentForm.service}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, service: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select service</option>
                  {services.map(s => (
                    <option key={s.id} value={s.name}>{s.name} - ${s.price}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider
                </label>
                <select
                  value={appointmentForm.provider}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, provider: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select provider</option>
                  {providers.map(p => (
                    <option key={p.id} value={p.name}>{p.name} - {p.specialty}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={appointmentForm.date}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <select
                    value={appointmentForm.time}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select time</option>
                    {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'].map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={appointmentForm.status}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAppointmentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingAppointment ? 'Save Changes' : 'Create Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Payments & Revenue</h2>
            <p className="text-sm text-gray-500">Track revenue and provider payouts</p>
          </div>
          
          {/* Revenue Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="card">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                ${appointments.reduce((acc, a) => acc + a.price, 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">All time</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">This Week</p>
              <p className="text-2xl font-bold text-blue-600">$2,450</p>
              <p className="text-xs text-green-600 mt-1">+15% vs last week</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">Pending Payments</p>
              <p className="text-2xl font-bold text-amber-600">
                ${appointments.filter(a => a.status === 'pending').reduce((acc, a) => acc + a.price, 0)}
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">Completed Payments</p>
              <p className="text-2xl font-bold text-green-600">
                ${appointments.filter(a => a.status === 'completed').reduce((acc, a) => acc + a.price, 0)}
              </p>
            </div>
          </div>
          
          {/* Provider Compensation */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Provider Payouts (Commission 60%)</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                    <th className="px-4 py-3 font-medium">Provider</th>
                    <th className="px-4 py-3 font-medium">Appointments</th>
                    <th className="px-4 py-3 font-medium">Revenue</th>
                    <th className="px-4 py-3 font-medium">Commission (60%)</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {providers.map(provider => {
                    const providerAppointments = appointments.filter(a => a.provider === provider.name && a.status === 'completed');
                    const revenue = providerAppointments.reduce((acc, a) => acc + a.price, 0);
                    const commission = revenue * 0.6;
                    return (
                      <tr key={provider.id} className="text-sm">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium text-sm">
                                {provider.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{provider.name}</p>
                              <p className="text-xs text-gray-500">{provider.specialty}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{providerAppointments.length}</td>
                        <td className="px-4 py-3 text-green-600 font-medium">${revenue.toLocaleString()}</td>
                        <td className="px-4 py-3 text-blue-600 font-medium">${commission.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className="badge bg-green-100 text-green-700">Ready to Pay</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Recent Transactions */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {appointments.filter(a => a.status === 'completed' || a.status === 'confirmed').slice(0, 5).map(apt => (
                <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign size={18} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{apt.customer}</p>
                      <p className="text-sm text-gray-500">{apt.service} - {apt.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">${apt.price}</p>
                    <span className={`badge ${
                      apt.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
