import React, { useState } from 'react';
import { AlertTriangle, DollarSign, Clock, Shield, CreditCard, Ban } from 'lucide-react';

const BookingPoliciesSection = ({ locationId, locationData, onSave }) => {
  const [policies, setPolicies] = useState({
    cancellationPolicy: {
      advanceNoticeHours: 24, // Hours before appointment
      cancellationFeePercent: 50, // Percentage of service price
      cancellationFeeFixed: 25, // Fixed fee in dollars
      cancellationTypes: {
        'no-charge': 24, // Free cancellation before this many hours
        'partial-charge': 12, // Partial charge between these hours
        'full-charge': 0, // Full charge within this window
      },
      emergencyExemptions: true, // True emergencies waive cancellation fees
    },
    depositPolicy: {
      requireDeposit: false,
      depositPercent: 25, // Percentage of service price for deposit
      depositFixed: 50, // Fixed minimum deposit amount
      depositServices: [], // Services that require deposits (all if empty)
      depositRefundable: true, // Refundable if cancelled within policy
      autoCancelUnpaid: true, // Cancel appointments if deposit not paid
      autoCancelHours: 24, // Hours before appointment to auto-cancel for unpaid deposits
    },
    noShowPolicy: {
      noShowFee: 25, // Fixed fee for no-shows
      noShowFeePercent: 100, // Percentage of service price (if both set, max is used)
      noShowBanThreshold: 3, // Number of no-shows before banning
      noShowBanHours: 24, // Hours to ban for (0 = permanent ban)
      chargeNoShowFee: true, // Whether to charge no-show fee
      warnBeforeBan: true, // Send warning before banning
    },
    reschedulingPolicy: {
      allowRescheduling: true,
      rescheduleHoursLimit: 2, // Hours before appointment when rescheduling allowed
      rescheduleLimit: 2, // Number of times appointment can be rescheduled
      rescheduleFee: 10, // Fee for rescheduling
      rescheduleFeePercent: 0, // Percentage fee (if both set, max is used)
      advanceRescheduleHours: 24, // Hours before when rescheduling is free
    },
    paymentRequirements: {
      requireFullPayment: false, // Require full payment upfront
      acceptCreditCard: true,
      acceptCash: true,
      acceptDebitCard: true,
      acceptDigitalPayments: false, // Apple Pay, Google Pay, etc.
      paymentAtArrival: true, // Allow payment when customer arrives
      paymentOnline: true, // Allow online payment
      minimumServiceAmount: 0, // Minimum amount for bookings
    },
    customerAccountRules: {
      requireAccountForBooking: false,
      requirePhoneVerification: false,
      requireEmailVerification: false,
      trackCustomerHistory: true,
      allowWalkIns: true,
      membershipRequired: false, // Require membership for booking
      loyaltyPointsEnabled: true,
    }
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const updatePolicy = (section, key, value) => {
    setPolicies(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const updateNestedPolicy = (section, subsection, key, value) => {
    setPolicies(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [key]: value
        }
      }
    }));
  };

  const savePolicies = async () => {
    try {
      setLoading(true);
      setError(null);
      
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
      } else {
        setError('Failed to save policies');
      }
    } catch (error) {
      console.error('Error saving policies:', error);
      setError('Failed to save policies');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-indigo-500" />
              Booking Policies & Rules
            </h2>
            <p className="text-gray-600 mt-1">
              Configure cancellation rules, deposits, and customer account requirements
            </p>
          </div>
          
          <button
            onClick={savePolicies}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Policies'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
      </div>

      {/* Cancellation Policy */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
          Cancellation Policy
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Advance Notice Required (hours)
              </label>
              <input
                type="number"
                min="0"
                max="168"
                value={policies.cancellationPolicy.advanceNoticeHours}
                onChange={(e) => updatePolicy('cancellationPolicy', 'advanceNoticeHours', parseInt(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Customers must cancel at least this many hours in advance
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Exemptions
              </label>
              <select
                value={policies.cancellationPolicy.emergencyExemptions.toString()}
                onChange={(e) => updatePolicy('cancellationPolicy', 'emergencyExemptions', e.target.value === 'true')}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              >
                <option value="true">Allow emergency exemptions</option>
                <option value="false">No exemptions</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cancellation Fee (Fixed $)
              </label>
              <input
                type="number"
                min="0"
                max="1000"
                step="0.01"
                value={policies.cancellationPolicy.cancellationFeeFixed}
                onChange={(e) => updatePolicy('cancellationPolicy', 'cancellationFeeFixed', parseFloat(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cancellation Fee (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={policies.cancellationPolicy.cancellationFeePercent}
                onChange={(e) => updatePolicy('cancellationPolicy', 'cancellationFeePercent', parseFloat(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Percentage of service price (higher of fixed fee or % will be charged)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Policy */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-green-500" />
          Deposit Policy
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="require-deposit"
              type="checkbox"
              checked={policies.depositPolicy.requireDeposit}
              onChange={(e) => updatePolicy('depositPolicy', 'requireDeposit', e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="require-deposit" className="ml-3 text-sm text-gray-700">
              Require deposit for bookings
            </label>
          </div>

          {policies.depositPolicy.requireDeposit && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deposit Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={policies.depositPolicy.depositPercent}
                    onChange={(e) => updatePolicy('depositPolicy', 'depositPercent', parseFloat(e.target.value))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Deposit Amount ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    step="0.01"
                    value={policies.depositPolicy.depositFixed}
                    onChange={(e) => updatePolicy('depositPolicy', 'depositFixed', parseFloat(e.target.value))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={policies.depositPolicy.depositRefundable}
                    onChange={(e) => updatePolicy('depositPolicy', 'depositRefundable', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Refundable if cancelled within policy
                  </span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={policies.depositPolicy.autoCancelUnpaid}
                    onChange={(e) => updatePolicy('depositPolicy', 'autoCancelUnpaid', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Auto-cancel unpaid deposits
                  </span>
                </label>
              </div>

              {policies.depositPolicy.autoCancelUnpaid && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auto-cancel Hours Before Appointment
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="168"
                    value={policies.depositPolicy.autoCancelHours}
                    onChange={(e) => updatePolicy('depositPolicy', 'autoCancelHours', parseInt(e.target.value))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* No-Show Policy */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Ban className="h-5 w-5 mr-2 text-red-500" />
          No-Show Policy
        </h3>
        
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={policies.noShowPolicy.chargeNoShowFee}
              onChange={(e) => updatePolicy('noShowPolicy', 'chargeNoShowFee', e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm text-gray-700">
              Charge no-show fee
            </span>
          </label>

          {policies.noShowPolicy.chargeNoShowFee && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No-Show Fee (Fixed $)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    step="0.01"
                    value={policies.noShowPolicy.noShowFee}
                    onChange={(e) => updatePolicy('noShowPolicy', 'noShowFee', parseFloat(e.target.value))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    No-Show Fee (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={policies.noShowPolicy.noShowFeePercent}
                    onChange={(e) => updatePolicy('noShowPolicy', 'noShowFeePercent', parseFloat(e.target.value))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
              </div>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ban After No-Shows
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={policies.noShowPolicy.noShowBanThreshold}
                onChange={(e) => updatePolicy('noShowPolicy', 'noShowBanThreshold', parseInt(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Number of no-shows before banning (0 = never ban)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ban Duration (hours)
              </label>
              <input
                type="number"
                min="0"
                max="8760"
                value={policies.noShowPolicy.noShowBanHours}
                onChange={(e) => updatePolicy('noShowPolicy', 'noShowBanHours', parseInt(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                0 = permanent ban, >0 = temporary ban duration
              </p>
            </div>
          </div>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={policies.noShowPolicy.warnBeforeBan}
              onChange={(e) => updatePolicy('noShowPolicy', 'warnBeforeBan', e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm text-gray-700">
              Send warning before banning
            </span>
          </label>
        </div>
      </div>

      {/* Rescheduling Policy */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-blue-500" />
          Rescheduling Policy
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="allow-reschedule"
              type="checkbox"
              checked={policies.reschedulingPolicy.allowRescheduling}
              onChange={(e) => updatePolicy('reschedulingPolicy', 'allowRescheduling', e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="allow-reschedule" className="ml-3 text-sm text-gray-700">
              Allow appointment rescheduling
            </label>
          </div>

          {policies.reschedulingPolicy.allowRescheduling && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Advance Notice (hours)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="168"
                    value={policies.reschedulingPolicy.rescheduleHoursLimit}
                    onChange={(e) => updatePolicy('reschedulingPolicy', 'rescheduleHoursLimit', parseInt(e.target.value))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Reschedules
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={policies.reschedulingPolicy.rescheduleLimit}
                    onChange={(e) => updatePolicy('reschedulingPolicy', 'rescheduleLimit', parseInt(e.target.value))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Free Rescheduling Advance Notice (hours)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="168"
                    value={policies.reschedulingPolicy.advanceRescheduleHours}
                    onChange={(e) => updatePolicy('reschedulingPolicy', 'advanceRescheduleHours', parseInt(e.target.value))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reschedule Fee (Fixed $)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={policies.reschedulingPolicy.rescheduleFee}
                    onChange={(e) => updatePolicy('reschedulingPolicy', 'rescheduleFee', parseFloat(e.target.value))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reschedule Fee (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={policies.reschedulingPolicy.rescheduleFeePercent}
                    onChange={(e) => updatePolicy('reschedulingPolicy', 'rescheduleFeePercent', parseFloat(e.target.value))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPoliciesSection;