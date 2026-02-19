import { useState } from 'react';
import { DollarSign, TrendingUp, Clock, Check, Download } from 'lucide-react';

export default function Payouts() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'providers', label: 'Providers' },
    { id: 'payouts', label: 'Payouts' },
    { id: 'settings', label: 'Settings' },
  ];
  
  const providers = [
    { id: 1, name: 'Emma Wilson', specialty: 'Color Specialist', commissionRate: 40, baseSalary: 2000, revenue: 8750, commission: 3500, paid: 2800, pending: 700 },
    { id: 2, name: 'James Brown', specialty: 'Senior Stylist', commissionRate: 45, baseSalary: 2200, revenue: 9200, commission: 4140, paid: 3312, pending: 828 },
    { id: 3, name: 'Sofia Garcia', specialty: 'Texture Expert', commissionRate: 35, baseSalary: 1800, revenue: 5890, commission: 2061.50, paid: 1649.20, pending: 412.30 },
    { id: 4, name: 'Michael Chen', specialty: 'Master Stylist', commissionRate: 38, baseSalary: 1900, revenue: 7420, commission: 2819.60, paid: 2255.68, pending: 563.92 },
    { id: 5, name: 'Aisha Patel', specialty: 'Extensions Specialist', commissionRate: 42, baseSalary: 2100, revenue: 5800, commission: 2436, paid: 1948.80, pending: 487.20 },
  ];
  
  const stats = [
    { label: 'Total Revenue', value: '$37,060', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Commission', value: '$15,857.10', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Paid Out', value: '$11,965.68', icon: Check, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Pending', value: '$2,991.42', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Provider Payouts</h1>
        <p className="text-gray-600">Track commissions and manage payouts</p>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-gray-100 rounded-lg overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="card">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${stat.bg}`}>
                      <Icon size={20} className={stat.color} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Provider Breakdown */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Provider Breakdown</h2>
              <button className="btn btn-secondary flex items-center gap-2 text-sm">
                <Download size={16} />
                Export
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Provider</th>
                    <th className="pb-3 font-medium">Specialty</th>
                    <th className="pb-3 font-medium">Revenue</th>
                    <th className="pb-3 font-medium">Commission</th>
                    <th className="pb-3 font-medium">Paid</th>
                    <th className="pb-3 font-medium">Pending</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {providers.map((provider) => (
                    <tr key={provider.id} className="text-sm">
                      <td className="py-3 font-medium text-gray-900">{provider.name}</td>
                      <td className="py-3 text-gray-600">{provider.specialty}</td>
                      <td className="py-3 text-gray-900">${provider.revenue.toLocaleString()}</td>
                      <td className="py-3 text-gray-600">{provider.commissionRate}% = ${provider.commission.toLocaleString()}</td>
                      <td className="py-3 text-green-600">${provider.paid.toLocaleString()}</td>
                      <td className="py-3 text-amber-600">${provider.pending.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Other tabs placeholder */}
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
