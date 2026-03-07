import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, DollarSign, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const BookingPolicies = () => {
  const [policies, setPolicies] = useState({
    cancellation: {
      noticeHours: 24,
      refundPercentage: 100,
      policy: 'free_cancellation'
    },
    rescheduling: {
      allowed: true,
      noticeHours: 2,
      fee: 0
    },
    deposits: {
      required: false,
      amount: 50,
      services: []
    },
    noShow: {
      policy: 'warning',
      threshold: 2,
      banDays: 7
    },
    lateArrival: {
      gracePeriod: 10,
      penalty: null
    },
    bookingWindow: {
      minAdvance: 1,
      maxAdvance: 30
    },
    emergency: {
      allowed: true,
      fee: 25
    }
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('cancellation');

  const handlePolicyUpdate = (category, field, value) => {
    setPolicies(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const savePolicies = async () => {
    setLoading(true);
    try {
      // Save to API
      const response = await fetch('/api/booking-policies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policies)
      });
      
      if (response.ok) {
        alert('Booking policies saved successfully!');
      }
    } catch (error) {
      console.error('Error saving policies:', error);
      alert('Error saving policies');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'cancellation', label: 'Cancellation', icon: AlertTriangle },
    { id: 'rescheduling', label: 'Rescheduling', icon: RefreshCw },
    { id: 'deposits', label: 'Deposits', icon: DollarSign },
    { id: 'noShow', label: 'No-Show', icon: AlertTriangle },
    { id: 'lateArrival', label: 'Late Arrival', icon: Clock }
  ];

  const renderCancellationTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Cancellation Policy</label>
        <select
          value={policies.cancellation.policy}
          onChange={e => handlePolicyUpdate('cancellation', 'policy', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="free_cancellation">Free Cancellation</option>
          <option value="partial_refund">Partial Refund</option>
          <option value="no_refund">No Refund</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Notice Required (hours)</label>
        <input
          type="number"
          value={policies.cancellation.noticeHours}
          onChange={e => handlePolicyUpdate('cancellation', 'noticeHours', parseInt(e.target.value))}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Refund Percentage</label>
        <input
          type="number"
          value={policies.cancellation.refundPercentage}
          onChange={e => handlePolicyUpdate('cancellation', 'refundPercentage', parseInt(e.target.value))}
          className="w-full px-3 py-2 border rounded-lg"
          min="0"
          max="100"
        />
      </div>
    </div>
  );

  const renderReschedulingTab = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={policies.rescheduling.allowed}
          onChange={e => handlePolicyUpdate('rescheduling', 'allowed', e.target.checked)}
          className="rounded"
        />
        <label className="text-sm font-medium">Allow Rescheduling</label>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Notice Required (hours)</label>
        <input
          type="number"
          value={policies.rescheduling.noticeHours}
          onChange={e => handlePolicyUpdate('rescheduling', 'noticeHours', parseInt(e.target.value))}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Rescheduling Fee ($)</label>
        <input
          type="number"
          value={policies.rescheduling.fee}
          onChange={e => handlePolicyUpdate('rescheduling', 'fee', parseFloat(e.target.value))}
          className="w-full px-3 py-2 border rounded-lg"
          step="0.01"
        />
      </div>
    </div>
  );

  const renderDepositsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={policies.deposits.required}
          onChange={e => handlePolicyUpdate('deposits', 'required', e.target.checked)}
          className="rounded"
        />
        <label className="text-sm font-medium">Require Deposits</label>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Deposit Amount ($)</label>
        <input
          type="number"
          value={policies.deposits.amount}
          onChange={e => handlePolicyUpdate('deposits', 'amount', parseFloat(e.target.value))}
          className="w-full px-3 py-2 border rounded-lg"
          step="0.01"
        />
      </div>
    </div>
  );

  const renderNoShowTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">No-Show Policy</label>
        <select
          value={policies.noShow.policy}
          onChange={e => handlePolicyUpdate('noShow', 'policy', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="warning">Warning Only</option>
          <option value="fee">Charge Fee</option>
          <option value="ban">Temporary Ban</option>
          <option value="both">Fee + Ban</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Ban Threshold (occurrences)</label>
        <input
          type="number"
          value={policies.noShow.threshold}
          onChange={e => handlePolicyUpdate('noShow', 'threshold', parseInt(e.target.value))}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Ban Duration (days)</label>
        <input
          type="number"
          value={policies.noShow.banDays}
          onChange={e => handlePolicyUpdate('noShow', 'banDays', parseInt(e.target.value))}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
    </div>
  );

  const renderLateArrivalTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Grace Period (minutes)</label>
        <input
          type="number"
          value={policies.lateArrival.gracePeriod}
          onChange={e => handlePolicyUpdate('lateArrival', 'gracePeriod', parseInt(e.target.value))}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'cancellation': return renderCancellationTab();
      case 'rescheduling': return renderReschedulingTab();
      case 'deposits': return renderDepositsTab();
      case 'noShow': return renderNoShowTab();
      case 'lateArrival': return renderLateArrivalTab();
      default: return renderCancellationTab();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Booking Policies</h3>
        <button
          onClick={savePolicies}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save size={16} />
          {loading ? 'Saving...' : 'Save Policies'}
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default BookingPolicies;