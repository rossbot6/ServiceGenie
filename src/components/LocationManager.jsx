import React, { useState } from 'react';
import { Building2, MapPin, Users, Calendar, DollarSign, TrendingUp, Plus, Search, Filter, Eye, Edit, Trash2, Star, Clock, CheckCircle, AlertCircle, BarChart3, Settings, Phone, Mail } from 'lucide-react';

const LocationManager = () => {
  const [locations] = useState([
    {
      id: 'loc_001',
      name: 'Downtown Location',
      address: '123 Main Street, Downtown District, NY 10001',
      phone: '(555) 123-4567',
      email: 'downtown@servicgenie.com',
      manager: 'David Lee',
      managerEmail: 'david.lee@servicgenie.com',
      managerPhone: '(555) 123-4501',
      status: 'active',
      openDate: '2023-06-15',
      totalChairs: 8,
      availableChairs: 2,
      providers: 12,
      capacity: 95,
      monthlyRevenue: 47500.00,
      lastMonthRevenue: 45200.00,
      customerRating: 4.8,
      totalReviews: 247,
      weeklyAppointments: 145,
      averageServiceTime: 85,
      peakHours: ['9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM'],
      amenities: ['WiFi', 'Refreshments', 'Free Parking', 'Climate Controlled', 'Music System'],
      specialties: ['Hair Color', 'Balayage', 'Precision Cuts', 'Specialty Treatments'],
      maintenanceStatus: 'excellent',
      lastMaintenanceDate: '2026-03-01',
      nextMaintenanceDate: '2026-04-01',
      equipmentCount: 45,
      cleaningProducts: 'Stocked',
      inventoryLevel: 85,
      safetyRating: 5,
      complianceStatus: 'compliant',
      insuranceExpiry: '2026-12-31',
      licenses: ['Cosmetology License', 'Business License', 'Safety Certification'],
      parkingSpaces: 12,
      publicTransport: ['Subway: 15 min walk', 'Bus: Route 23'],
      nearbyLandmarks: ['Empire State Building', 'Madison Square Park'],
      googleMapsUrl: 'https://maps.google.com/123mainstreet',
      socialMedia: {
        instagram: '@servicgenie_downtown',
        facebook: 'ServiceGenie Downtown',
        google: 'ServiceGenie Downtown Location'
      },
      businessHours: {
        monday: '9:00 AM - 7:00 PM',
        tuesday: '9:00 AM - 7:00 PM',
        wednesday: '9:00 AM - 7:00 PM',
        thursday: '9:00 AM - 8:00 PM',
        friday: '8:00 AM - 8:00 PM',
        saturday: '8:00 AM - 6:00 PM',
        sunday: '10:00 AM - 5:00 PM'
      },
      revenueBreakdown: {
        hairServices: 28500.00,
        treatments: 12000.00,
        retail: 4500.00,
        addOns: 2500.00
      },
      topProviders: [
        { id: 'prov_001', name: 'Emma Wilson', services: 89, revenue: 18750.00, rating: 4.9 },
        { id: 'prov_003', name: 'James Brown', services: 76, revenue: 15400.00, rating: 4.8 }
      ],
      customerDemographics: {
        ageGroups: {
          '18-25': 15,
          '26-35': 35,
          '36-45': 30,
          '46-55': 15,
          '55+': 5
        },
        repeatCustomers: 68,
        newCustomers: 32
      }
    },
    {
      id: 'loc_002',
      name: 'Brooklyn Branch',
      address: '456 Bedford Avenue, Williamsburg, Brooklyn, NY 11211',
      phone: '(555) 987-6543',
      email: 'brooklyn@servicgenie.com',
      manager: 'Carlos Mendez',
      managerEmail: 'carlos.mendez@servicgenie.com',
      managerPhone: '(555) 987-4502',
      status: 'active',
      openDate: '2023-09-10',
      totalChairs: 6,
      availableChairs: 1,
      providers: 8,
      capacity: 88,
      monthlyRevenue: 32800.00,
      lastMonthRevenue: 31500.00,
      customerRating: 4.7,
      totalReviews: 156,
      weeklyAppointments: 98,
      averageServiceTime: 80,
      peakHours: ['10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM'],
      amenities: ['WiFi', 'Coffee Bar', 'Urban Location'],
      specialties: ['Modern Cuts', 'Color Work', 'Men\'s Grooming'],
      maintenanceStatus: 'good',
      lastMaintenanceDate: '2026-02-28',
      nextMaintenanceDate: '2026-03-30',
      equipmentCount: 32,
      cleaningProducts: 'Low Stock',
      inventoryLevel: 65,
      safetyRating: 4,
      complianceStatus: 'compliant',
      insuranceExpiry: '2026-12-31',
      licenses: ['Cosmetology License', 'Business License'],
      parkingSpaces: 6,
      publicTransport: ['Subway: L train, Bedford Ave', 'Bus: Route 8'],
      nearbyLandmarks: ['Williamsburg Bridge', 'McCarren Park'],
      googleMapsUrl: 'https://maps.google.com/456bedfordavenue',
      socialMedia: {
        instagram: '@servicgenie_brooklyn',
        facebook: 'ServiceGenie Brooklyn',
        google: 'ServiceGenie Brooklyn Branch'
      },
      businessHours: {
        monday: 'Closed',
        tuesday: '10:00 AM - 7:00 PM',
        wednesday: '10:00 AM - 7:00 PM',
        thursday: '10:00 AM - 8:00 PM',
        friday: '9:00 AM - 8:00 PM',
        saturday: '9:00 AM - 6:00 PM',
        sunday: '11:00 AM - 4:00 PM'
      },
      revenueBreakdown: {
        hairServices: 19700.00,
        treatments: 8900.00,
        retail: 2800.00,
        addOns: 1400.00
      },
      topProviders: [
        { id: 'prov_002', name: 'Michael Chen', services: 72, revenue: 15200.00, rating: 4.9 },
        { id: 'prov_004', name: 'Sofia Garcia', services: 65, revenue: 13800.00, rating: 4.7 }
      ],
      customerDemographics: {
        ageGroups: {
          '18-25': 25,
          '26-35': 40,
          '36-45': 25,
          '46-55': 8,
          '55+': 2
        },
        repeatCustomers: 62,
        newCustomers: 38
      }
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showLocationDetails, setShowLocationDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-300';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'renovation': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'closed': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getMaintenanceColor = (status) => {
    switch(status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'needs_attention': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getMaintenanceIcon = (status) => {
    switch(status) {
      case 'excellent': return <CheckCircle size={16} className="text-green-600" />;
      case 'good': return <CheckCircle size={16} className="text-blue-600" />;
      case 'needs_attention': return <AlertCircle size={16} className="text-yellow-600" />;
      case 'critical': return <AlertCircle size={16} className="text-red-600" />;
      default: return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  const filteredLocations = locations.filter(location => {
    return (
      (!searchQuery || 
       location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
       location.manager.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!statusFilter || location.status === statusFilter)
    );
  });

  const locationStats = {
    totalLocations: locations.length,
    activeLocations: locations.filter(l => l.status === 'active').length,
    totalRevenue: locations.reduce((sum, l) => sum + l.monthlyRevenue, 0),
    averageRating: locations.length > 0 ? (locations.reduce((sum, l) => sum + l.customerRating, 0) / locations.length) : 0,
    totalProviders: locations.reduce((sum, l) => sum + l.providers, 0),
    totalChairs: locations.reduce((sum, l) => sum + l.totalChairs, 0),
    averageCapacity: locations.length > 0 ? (locations.reduce((sum, l) => sum + l.capacity, 0) / locations.length) : 0,
    monthlyGrowth: locations.length > 0 ? (
      locations.reduce((sum, l) => sum + ((l.monthlyRevenue - l.lastMonthRevenue) / l.lastMonthRevenue * 100), 0) / locations.length
    ) : 0
  };

  const handleViewLocation = (location) => {
    setSelectedLocation(location);
    setShowLocationDetails(true);
  };

  const LocationRow = ({ location }) => (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Building2 className="text-gray-400" size={16} />
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{location.name}</div>
            <div className="text-sm text-gray-500">{location.address.substring(0, 30)}...</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{location.manager}</div>
        <div className="text-sm text-gray-500">{location.managerEmail}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-lg font-bold text-gray-900">${location.monthlyRevenue.toLocaleString()}</div>
        <div className={`text-sm ${location.monthlyRevenue >= location.lastMonthRevenue ? 'text-green-600' : 'text-red-600'}`}>
          {location.monthlyRevenue >= location.lastMonthRevenue ? '+' : ''}
          ${(location.monthlyRevenue - location.lastMonthRevenue).toLocaleString()}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <span className="text-sm text-gray-900">{location.providers}/{location.totalChairs}</span>
          <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{width: `${(location.providers/location.totalChairs)*100}%`}}
            ></div>
          </div>
        </div>
        <div className="text-sm text-gray-500">{location.capacity}% capacity</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {getMaintenanceIcon(location.maintenanceStatus)}
          <span className={`ml-2 text-sm font-medium ${getMaintenanceColor(location.maintenanceStatus)}`}>
            {location.maintenanceStatus}
          </span>
        </div>
        <div className="text-sm text-gray-500">Next: {location.nextMaintenanceDate}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Star className="text-yellow-400" size={16} fill="currentColor" />
          <span className="ml-1 text-sm font-medium text-gray-900">{location.customerRating}</span>
        </div>
        <div className="text-sm text-gray-500">{location.totalReviews} reviews</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(location.status)}`}>
          {location.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
        <button
          onClick={() => handleViewLocation(location)}
          className="text-blue-600 hover:text-blue-900"
          title="View Details"
        >
          <Eye size={16} />
        </button>
        <button
          className="text-green-600 hover:text-green-900"
          title="Edit Location"
        >
          <Edit size={16} />
        </button>
        <button
          className="text-gray-600 hover:text-gray-900"
          title="Settings"
        >
          <Settings size={16} />
        </button>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Location Manager</h3>
          <p className="text-sm text-gray-600">Manage salon locations, staff assignments, and location performance</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddLocation(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} />
            Add Location
          </button>
        </div>
      </div>

      {/* Location Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Total Locations</p>
              <p className="text-2xl font-bold text-blue-700">{locationStats.totalLocations}</p>
            </div>
            <Building2 className="text-blue-600" size={24} />
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Active Locations</p>
              <p className="text-2xl font-bold text-green-700">{locationStats.activeLocations}</p>
            </div>
            <CheckCircle className="text-green-600" size={24} />
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-purple-700">${locationStats.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="text-purple-600" size={24} />
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Avg Rating</p>
              <p className="text-2xl font-bold text-yellow-700">{locationStats.averageRating.toFixed(1)}</p>
            </div>
            <Star className="text-yellow-600" size={24} fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Providers</p>
              <p className="text-2xl font-bold text-gray-700">{locationStats.totalProviders}</p>
            </div>
            <Users className="text-gray-600" size={24} />
          </div>
        </div>
        
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-indigo-600">Total Chairs</p>
              <p className="text-2xl font-bold text-indigo-700">{locationStats.totalChairs}</p>
            </div>
            <Calendar className="text-indigo-600" size={24} />
          </div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600">Avg Capacity</p>
              <p className="text-2xl font-bold text-orange-700">{locationStats.averageCapacity.toFixed(0)}%</p>
            </div>
            <BarChart3 className="text-orange-600" size={24} />
          </div>
        </div>
        
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600">Monthly Growth</p>
              <p className={`text-2xl font-bold ${locationStats.monthlyGrowth >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {locationStats.monthlyGrowth >= 0 ? '+' : ''}{locationStats.monthlyGrowth.toFixed(1)}%
              </p>
            </div>
            <TrendingUp className={locationStats.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'} size={24} />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search locations by name, address, or manager..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="renovation">Renovation</option>
            <option value="closed">Closed</option>
          </select>

          <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={16} />
            Advanced Filters
          </button>

          <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
            <BarChart3 size={16} />
            Performance Report
          </button>

          <button className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
            <MapPin size={16} />
            Map View
          </button>
        </div>
      </div>

      {/* Locations Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Manager
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff/Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Maintenance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLocations.map((location) => (
                <LocationRow key={location.id} location={location} />
              ))}
            </tbody>
          </table>
        </div>

        {filteredLocations.length === 0 && (
          <div className="text-center py-12">
            <Building2 size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No locations found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || statusFilter 
                ? 'Try adjusting your search or filter criteria' 
                : 'No salon locations have been added yet'}
            </p>
          </div>
        )}
      </div>

      {/* Location Details Modal */}
      {showLocationDetails && selectedLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-6xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Location Details - {selectedLocation.name}</h3>
              <button
                onClick={() => setShowLocationDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 border-b">
              {['overview', 'staff', 'performance', 'facilities'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium capitalize ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Location Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{selectedLocation.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Address:</span>
                        <span className="font-medium">{selectedLocation.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{selectedLocation.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedLocation.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Open Date:</span>
                        <span className="font-medium">{selectedLocation.openDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedLocation.status)}`}>
                          {selectedLocation.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Manager Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{selectedLocation.manager}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedLocation.managerEmail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{selectedLocation.managerPhone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Business Hours</h4>
                    <div className="space-y-1">
                      {Object.entries(selectedLocation.businessHours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between text-sm">
                          <span className="text-gray-600 capitalize">{day}:</span>
                          <span className="font-medium">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Capacity & Services</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Chairs:</span>
                        <span className="font-medium">{selectedLocation.totalChairs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Providers:</span>
                        <span className="font-medium">{selectedLocation.providers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Available Chairs:</span>
                        <span className="font-medium">{selectedLocation.availableChairs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Peak Capacity:</span>
                        <span className="font-medium">{selectedLocation.capacity}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weekly Appointments:</span>
                        <span className="font-medium">{selectedLocation.weeklyAppointments}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Avg Service Time:</span>
                        <span className="font-medium">{selectedLocation.averageServiceTime} min</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Revenue Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hair Services:</span>
                        <span className="font-medium">${selectedLocation.revenueBreakdown.hairServices.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Treatments:</span>
                        <span className="font-medium">${selectedLocation.revenueBreakdown.treatments.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Retail:</span>
                        <span className="font-medium">${selectedLocation.revenueBreakdown.retail.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Add-ons:</span>
                        <span className="font-medium">${selectedLocation.revenueBreakdown.addOns.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-900 font-medium">Total:</span>
                        <span className="font-bold text-lg">${selectedLocation.monthlyRevenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'staff' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Top Providers</h4>
                    <div className="space-y-3">
                      {selectedLocation.topProviders.map((provider) => (
                        <div key={provider.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium">{provider.name}</h5>
                            <div className="flex items-center">
                              <Star className="text-yellow-400" size={14} fill="currentColor" />
                              <span className="text-sm ml-1">{provider.rating}</span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            <div>Services: {provider.services}</div>
                            <div>Revenue: ${provider.revenue.toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedLocation.specialties.map((specialty, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Customer Demographics</h4>
                    <div className="space-y-2">
                      {Object.entries(selectedLocation.customerDemographics.ageGroups).map(([ageGroup, percentage]) => (
                        <div key={ageGroup} className="flex justify-between">
                          <span className="text-gray-600">{ageGroup}:</span>
                          <span className="font-medium">{percentage}%</span>
                        </div>
                      ))}
                      <div className="border-t pt-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Repeat Customers:</span>
                          <span className="font-medium">{selectedLocation.customerDemographics.repeatCustomers}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">New Customers:</span>
                          <span className="font-medium">{selectedLocation.customerDemographics.newCustomers}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Peak Hours</h4>
                    <div className="space-y-1">
                      {selectedLocation.peakHours.map((hour, index) => (
                        <div key={index} className="px-3 py-2 bg-orange-100 text-orange-800 rounded-lg text-center">
                          {hour}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'facilities' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Equipment & Maintenance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Equipment Count:</span>
                        <span className="font-medium">{selectedLocation.equipmentCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Inventory Level:</span>
                        <span className="font-medium">{selectedLocation.inventoryLevel}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cleaning Products:</span>
                        <span className="font-medium">{selectedLocation.cleaningProducts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Maintenance Status:</span>
                        <span className={`font-medium ${getMaintenanceColor(selectedLocation.maintenanceStatus)}`}>
                          {selectedLocation.maintenanceStatus}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Next Maintenance:</span>
                        <span className="font-medium">{selectedLocation.nextMaintenanceDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Amenities</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedLocation.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle size={16} className="text-green-600 mr-2" />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowLocationDetails(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Edit Location
              </button>
              <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationManager;