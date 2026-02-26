import React, { useState, useEffect } from 'react';
import { Save, AlertTriangle, Clock, DollarSign, Shield, X } from 'lucide-react';

const BookingPolicies = ({ locationId, onSave }) => {
  const [policies, setPolicies] = useState({
    cancellationPolicy: {
      enabled: true,
      hoursRequired: 24,
      refundPercentage: 100,
      partialRefundUnder: 24,
      partialRefundPercentage: 50
    },
    depositPolicy: {
      enabled: true,
      servicesRequiringDeposit: ['color', 'treatment'],
      depositPercentage: 25,
      depositTypes: 'percentage', // 'fixed_amount' or 'percentage'
      fixedAmount: 50,
      refundableOnTime: true
    },
    noShowPolicy: {
      enabled: true,
      noShowThreshold: 2,
      actionAfterThreshold: 'suspend', // 'suspend', 'ban', 'require_deposit'
      automaticChargingEnabled: false,
      chargePercentage: 50,
      customerWarning: true,
      warningText: 'Please arrive on time to avoid being marked as no-show'
    },
    reschedulePolicy: {
      allowed: true,
      within24Hours: false,
      maxReschedules: 2,
      reschedulingFee: 0,
      reschedulesWithoutFee: 1
    },
    latePolicy: {
      enabled: true,
      gracePeriod: 15,
      lateFee: 15,
      cancellationIfLate: 30, // minutes after scheduled time
      chargeIfLate: 15 // percentage of service charge
    },
    bookingWindow: {
      maxDaysAhead: 60,
      minDaysAhead: 0,
      maxAppointmentsPerService: 10,
      requirePhoneNumber: true,
      requireEmail: true
    },
    emergencyPolicy: {
      allowCancellations: true,
      emergencyWindowHours: 4,
      noPenaltyEmergency: ['illness', 'emergency', 'death', 'medical'],
      providerInitiatedAllowed: true,
      providerInitiatedFeeWaived: true
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('cancellation');

  // Load existing policies
  const loadPolicies = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/location-policies/${locationId}`);
      const data = await response.json();
      
      if (response.ok && data.policies) {
        setPolicies(prev => ({
          ...prev,
          ...data.policies
        }));
      }
    } catch (error) {
      console.error('Error loading policies:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save policies
  const savePolicies = async () => {
    try {
      setSaving(true);
      setSaved(false);
      
      const response = await fetch('http://localhost:3001/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key: `location-policies-${locationId}`,
          data: policies
        })
      });
      
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        
        if (onSave) {
          onSave(policies);
        }
        
        // Also save to API
        await fetch(`http://localhost:3001/api/location-policies/${locationId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ policies })
        });
      }
    } catch (error) {
      console.error('Error saving policies:', error);
    } finally {
      setSaving(false);
    }
  };

  const updatePolicy = (section, field, value) => {
    setPolicies(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateNestedPolicy = (section, subsection, field, value) => {
    setPolicies(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const toggleServiceInDeposit = (serviceId) => {
    const currentServices = policies.depositPolicy.servicesRequiringDeposit;
    const updated = currentServices.includes(serviceId)
      ? currentServices.filter(s => s !== serviceId)
      : [...currentServices, serviceId];
    
    updatePolicy('depositPolicy', 'servicesRequiringDeposit', updated);
  };

  useEffect(() => {
    if (locationId) {
      loadPolicies();
    }
  }, [locationId]);

  const tabs = [
    { id: 'cancellation', name: 'Cancellation', icon: X },
    { id: 'deposit', name: 'Deposits', icon: DollarSign },
    { id: 'noShow', name: 'No-Show', icon: AlertTriangle },
    { id: 'reschedule', name: 'Rescheduling', icon: Clock },
    { id: 'late', name: 'Late Policy', icon: Clock },
    { id: 'booking', name: 'Booking Rules', icon: Shield }
  ];

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-indigo-500" />
            Booking Policies
          </h2>
          <p className="text-gray-600 mt-1">
            Configure cancellation rules, deposits, and booking policies
          </p>
        </div>
        
        <button
          onClick={savePolicies}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Policies'}
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Cancellation Policy */}
        {activeTab === 'cancellation' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cancellation Policy</h3>
            
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={policies.cancellationPolicy.enabled}
                  onChange={(e) => updatePolicy('cancellationPolicy', 'enabled', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Enable cancellation policy
                </span>
              </label>

              {policies.cancellationPolicy.enabled && (
                <div className="space-y-4 ml-7">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notice required (hours)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="168"
                      value={policies.cancellationPolicy.hoursRequired}
                      onChange={(e) => updateNestedPolicy('cancellationPolicy', null, 'hoursRequired', parseInt(e.target.value))}
                      className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 w-32"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Customer must provide this much notice for full refund
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full refund percentage
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={policies.cancellationPolicy.refundPercentage}
                      onChange={(e) => updateNestedPolicy('cancellationPolicy', null, 'refundPercentage', parseInt(e.target.value))}
                      className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 w-24"
                    />
                    <span className="text-sm text-gray-600 ml-2">% refund</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Deposit Policy */}
        {activeTab === 'deposit' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Deposit System</h3>
            
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={policies.depositPolicy.enabled}
                  onChange={(e) => updatePolicy('depositPolicy', 'enabled', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Require deposits for certain services
                </span>
              </label>

              {policies.depositPolicy.enabled && (
                <div className="space-y-4 ml-7">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Services requiring deposits:
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[
                        { id: 'color', name: 'Color Services' },
                        { id: 'treatment', name: 'Treatments' },
                        { id: 'balayage', name: 'Balayage' },
                        { id: 'highlights', name: 'Highlights' },
                        { id: 'keratin', name: 'Keratin' }
                      ].map((service) => (
                        <label key={service.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={policies.depositPolicy.servicesRequiringDeposit.includes(service.id)}
                            onChange={() => toggleServiceInDeposit(service.id)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                          />
                          <span className="ml-2 text-sm text-gray-700">{service.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deposit amount
                    </label>
                    <div className="flex items-center space-x-4">
                      <select
                        value={policies.depositPolicy.depositTypes}
                        onChange={(e) => updatePolicy('depositPolicy', 'depositTypes', e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                      >
                        <option value="percentage">Percentage of service</option>
                        <option value="fixed_amount">Fixed amount</option>
                      </select>
                      
                      {policies.depositPolicy.depositTypes === 'percentage' ? (
                        <>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={policies.depositPolicy.depositPercentage}
                            onChange={(e) => updateNestedPolicy('depositPolicy', null, 'depositPercentage', parseInt(e.target.value))}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 w-24"
                          />
                          <span className="text-sm text-gray-600">% of service price</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm text-gray-600">$</span>
                          <input
                            type="number"
                            min="1"
                            value={policies.depositPolicy.fixedAmount}
                            onChange={(e) => updateNestedPolicy('depositPolicy', null, 'fixedAmount', parseInt(e.target.value))}
                            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 w-24"
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No-Show Policy */}
        {activeTab === 'noShow' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">No-Show Policy</h3>
            
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={policies.noShowPolicy.enabled}
                  onChange={(e) => updatePolicy('noShowPolicy', 'enabled', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Track and penalize no-shows
                </span>
              </label>

              {policies.noShowPolicy.enabled && (
                <div className="space-y-4 ml-7">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      No-show threshold (occurrences)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={policies.noShowPolicy.noShowThreshold}
                      onChange={(e) => updateNestedPolicy('noShowPolicy', null, 'noShowThreshold', parseInt(e.target.value))}
                      className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 w-20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Action after threshold:
                    </label>
                    <select
                      value={policies.noShowPolicy.actionAfterThreshold}
                      onChange={(e) => updatePolicy('noShowPolicy', 'actionAfterThreshold', e.target.value)}
                      className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    >
                      <option value="suspend">Suspend bookings</option>
                      <option value="ban">Ban from booking</option>
                      <option value="require_deposit">Require deposit for bookings</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPolicies;