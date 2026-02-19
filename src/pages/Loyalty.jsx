import { useState } from 'react';
import { Gift, TrendingUp, Star, Award, Search } from 'lucide-react';

export default function Loyalty() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'tiers', label: 'Tiers' },
    { id: 'rewards', label: 'Rewards' },
    { id: 'members', label: 'Members' },
    { id: 'settings', label: 'Settings' },
  ];
  
  const tiers = [
    { name: 'Bronze', minPoints: 0, discount: 0, color: '#cd7f32', members: 45 },
    { name: 'Silver', minPoints: 500, discount: 5, color: '#c0c0c0', members: 28 },
    { name: 'Gold', minPoints: 1500, discount: 10, color: '#ffd700', members: 12 },
    { name: 'Platinum', minPoints: 5000, discount: 15, color: '#e5e4e2', members: 5 },
  ];
  
  const rewards = [
    { id: 1, name: '$10 Off', pointsCost: 100, description: 'Valid on any service' },
    { id: 2, name: '$25 Off', pointsCost: 250, description: 'Valid on any service' },
    { id: 3, name: 'Free Blowout', pointsCost: 500, description: 'Excludes premium services' },
    { id: 4, name: 'Free Haircut', pointsCost: 750, description: 'Up to $85 value' },
  ];
  
  const members = [
    { id: 1, name: 'John Smith', email: 'john@email.com', points: 12500, tier: 'Platinum', visits: 15 },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@email.com', points: 4500, tier: 'Gold', visits: 8 },
    { id: 3, name: 'Michael Davis', email: 'michael@email.com', points: 21000, tier: 'Platinum', visits: 22 },
    { id: 4, name: 'Emily Rodriguez', email: 'emily@email.com', points: 3375, tier: 'Silver', visits: 6 },
    { id: 5, name: 'David Kim', email: 'david@email.com', points: 2250, tier: 'Silver', visits: 4 },
  ];
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Loyalty Program</h1>
        <p className="text-gray-600">Manage rewards, tiers, and member benefits</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="card">
              <p className="text-sm text-gray-500">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">90</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">Points Issued</p>
              <p className="text-2xl font-bold text-gray-900">45,250</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">Points Redeemed</p>
              <p className="text-2xl font-bold text-gray-900">12,800</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-500">Active Rewards</p>
              <p className="text-2xl font-bold text-gray-900">4</p>
            </div>
          </div>
          
          {/* Tier Distribution */}
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-4">Tier Distribution</h2>
            <div className="space-y-3">
              {tiers.map((tier) => (
                <div key={tier.name} className="flex items-center gap-4">
                  <div className="w-24 font-medium text-gray-900">{tier.name}</div>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(tier.members / 90) * 100}%`,
                        backgroundColor: tier.color
                      }}
                    />
                  </div>
                  <div className="w-16 text-right text-sm text-gray-500">{tier.members}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Tiers Tab */}
      {activeTab === 'tiers' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier) => (
            <div key={tier.name} className="card">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: tier.color }}
                />
                <h3 className="font-semibold text-gray-900">{tier.name}</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Min Points</span>
                  <span className="font-medium">{tier.minPoints.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Discount</span>
                  <span className="font-medium">{tier.discount}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Members</span>
                  <span className="font-medium">{tier.members}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Rewards Tab */}
      {activeTab === 'rewards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rewards.map((reward) => (
            <div key={reward.id} className="card">
              <Gift size={24} className="text-primary-600 mb-3" />
              <h3 className="font-semibold text-gray-900">{reward.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{reward.description}</p>
              <div className="flex items-center gap-2">
                <Award size={16} className="text-amber-500" />
                <span className="font-medium text-amber-600">{reward.pointsCost} pts</span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="card">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search members..."
                className="input pl-10"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">Member</th>
                  <th className="pb-3 font-medium">Points</th>
                  <th className="pb-3 font-medium">Tier</th>
                  <th className="pb-3 font-medium">Visits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {members.map((member) => (
                  <tr key={member.id} className="text-sm">
                    <td className="py-3">
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-gray-500">{member.email}</p>
                      </div>
                    </td>
                    <td className="py-3 font-medium text-amber-600">{member.points.toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`badge ${
                        member.tier === 'Platinum' ? 'bg-amber-100 text-amber-700' :
                        member.tier === 'Gold' ? 'bg-yellow-100 text-yellow-700' :
                        member.tier === 'Silver' ? 'bg-gray-200 text-gray-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {member.tier}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">{member.visits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="card max-w-2xl">
          <h2 className="font-semibold text-gray-900 mb-6">Loyalty Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Points per Dollar Spent
              </label>
              <input type="number" defaultValue={10} className="input w-32" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Points Expiry (months)
              </label>
              <input type="number" defaultValue={12} className="input w-32" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Welcome Bonus Points
              </label>
              <input type="number" defaultValue={50} className="input w-32" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Referral Bonus Points
              </label>
              <input type="number" defaultValue={250} className="input w-32" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birthday Bonus Points
              </label>
              <input type="number" defaultValue={200} className="input w-32" />
            </div>
            
            <button className="btn btn-primary mt-4">Save Settings</button>
          </div>
        </div>
      )}
    </div>
  );
}
