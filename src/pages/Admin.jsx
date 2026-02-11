import { useState } from 'react';
import { 
  Users, Calendar, DollarSign, Settings, 
  TrendingUp, Clock, Check, X, Plus, Search,
  BarChart3, Mail, MessageSquare, CreditCard
} from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
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
      
      {/* Placeholder for other tabs */}
      {activeTab !== 'overview' && (
        <div className="card text-center py-12">
          <p className="text-gray-500">
            {tabs.find(t => t.id === activeTab)?.label} section - Coming soon
          </p>
        </div>
      )}
    </div>
  );
}
