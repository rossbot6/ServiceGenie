import React, { useState, useEffect } from 'react';
import { Save, Phone, Mail, MessageSquare, Clock, Bell, Shield } from 'lucide-react';

const CustomerCommunicationPreferences = ({ customerId, onSave }) => {
  const [preferences, setPreferences] = useState({
    customerTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    preferredCommunicationMethod: 'email',
    smsOptIn: true,
    emailOptIn: true,
    marketingOptIn: false,
    appointmentReminders: true,
    confirmationMessages: true,
    followUpMessages: false,
    specialOffers: false,
    birthdayMessages: true,
    loyaltyUpdates: false,
    feedbackRequests: true,
    emergencyNotifications: true,
    preferredReminderTime: '24', // hours before appointment
    communicationFrequency: 'as_needed' // as_needed, weekly, monthly
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  // Load customer preferences
  const loadPreferences = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/customer-preferences?customer_id=${customerId}`);
      const data = await response.json();
      
      if (response.ok) {
        setPreferences(prev => ({
          ...prev,
          customerTimezone: data.customer_timezone || prev.customerTimezone,
          preferredCommunicationMethod: data.preferred_communication_method || prev.preferredCommunicationMethod,
          preferredReminderTime: data.preferred_reminder_hours || prev.preferredReminderTime
        }));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      setError('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  // Save preferences
  const savePreferences = async () => {
    try {
      setSaving(true);
      setError(null);
      setSaved(false);
      
      const response = await fetch('http://localhost:3001/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key: `customer-preferences-${customerId}`,
          data: preferences
        })
      });
      
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        
        if (onSave) {
          onSave(preferences);
        }
      } else {
        setError('Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      setError('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  // Get available timezones
  const getTimezones = () => {
    return [
      'America/New_York',
      'America/Chicago', 
      'America/Denver',
      'America/Los_Angeles',
      'America/Phoenix',
      'America/Anchorage',
      'Pacific/Honolulu'
    ];
  };

  // Get reminder time options
  const getReminderTimeOptions = () => {
    return [
      { value: '24', label: '24 hours before' },
      { value: '12', label: '12 hours before' },
      { value: '6', label: '6 hours before' },
      { value: '2', label: '2 hours before' },
      { value: '1', label: '1 hour before' }
    ];
  };

  const updatePreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  useEffect(() => {
    if (customerId) {
      loadPreferences();
    }
  }, [customerId]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
            <Bell className="h-5 w-5 mr-2 text-indigo-500" />
            Communication Preferences
          </h2>
          <p className="text-gray-600 mt-1">
            Manage how and when you receive notifications and updates
          </p>
        </div>
        
        <button
          onClick={savePreferences}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {saved && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">Preferences saved successfully!</p>
        </div>
      )}

      <div className="space-y-8">
        {/* Timezone & Location */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-green-500" />
            Timezone & Location
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Timezone
              </label>
              <select
                value={preferences.customerTimezone}
                onChange={(e) => updatePreference('customerTimezone', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              >
                {getTimezones().map(timezone => (
                  <option key={timezone} value={timezone}>
                    {timezone}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                All appointment times will be shown in your local timezone
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder Timing
              </label>
              <select
                value={preferences.preferredReminderTime}
                onChange={(e) => updatePreference('preferredReminderTime', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              >
                {getReminderTimeOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                How far in advance you want appointment reminders
              </p>
            </div>
          </div>
        </div>

        {/* Communication Channels */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
            Communication Channels
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preferred Communication Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className={`relative block p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50
                  ${preferences.preferredCommunicationMethod === 'email' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}
                `}>
                  <input
                    type="radio"
                    value="email"
                    checked={preferences.preferredCommunicationMethod === 'email'}
                    onChange={(e) => updatePreference('preferredCommunicationMethod', e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="font-medium text-gray-900">Email</span>
                  </div>
                  <span className="text-sm text-gray-600 mt-1 block">Best for detailed info</span>
                </label>
                
                <label className={`relative block p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50
                  ${preferences.preferredCommunicationMethod === 'sms' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}
                `}>
                  <input
                    type="radio"
                    value="sms"
                    checked={preferences.preferredCommunicationMethod === 'sms'}
                    onChange={(e) => updatePreference('preferredCommunicationMethod', e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="font-medium text-gray-900">SMS</span>
                  </div>
                  <span className="text-sm text-gray-600 mt-1 block">Quick notifications</span>
                </label>
                
                <label className={`relative block p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50
                  ${preferences.preferredCommunicationMethod === 'both' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}
                `}>
                  <input
                    type="radio"
                    value="both"
                    checked={preferences.preferredCommunicationMethod === 'both'}
                    onChange={(e) => updatePreference('preferredCommunicationMethod', e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="font-medium text-gray-900">Both</span>
                  </div>
                  <span className="text-sm text-gray-600 mt-1 block">Email + SMS</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Types */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-purple-500" />
            Notification Types
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.appointmentReminders}
                  onChange={(e) => updatePreference('appointmentReminders', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <span className="ml-3 text-sm text-gray-700">Appointment Reminders</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.confirmationMessages}
                  onChange={(e) => updatePreference('confirmationMessages', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <span className="ml-3 text-sm text-gray-700">Booking Confirmations</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.followUpMessages}
                  onChange={(e) => updatePreference('followUpMessages', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <span className="ml-3 text-sm text-gray-700">Follow-up Messages</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.feedbackRequests}
                  onChange={(e) => updatePreference('feedbackRequests', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <span className="ml-3 text-sm text-gray-700">Feedback Requests</span>
              </label>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.birthdayMessages}
                  onChange={(e) => updatePreference('birthdayMessages', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <span className="ml-3 text-sm text-gray-700">Birthday Messages</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.specialOffers}
                  onChange={(e) => updatePreference('specialOffers', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <span className="ml-3 text-sm text-gray-700">Special Offers</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.loyaltyUpdates}
                  onChange={(e) => updatePreference('loyaltyUpdates', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <span className="ml-3 text-sm text-gray-700">Loyalty Updates</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.emergencyNotifications}
                  onChange={(e) => updatePreference('emergencyNotifications', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Emergency Changes
                  <span className="text-red-500 ml-1">*</span>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Marketing Preferences */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-orange-500" />
            Marketing & Promotional Messages
          </h3>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={preferences.marketingOptIn}
                onChange={(e) => updatePreference('marketingOptIn', e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">
                Receive promotional messages and offers
              </span>
            </label>
            
            {preferences.marketingOptIn && (
              <div className="mt-4 ml-7">
                <label className="block text-sm text-gray-600 mb-2">
                  Marketing communication frequency:
                </label>
                <select
                  value={preferences.communicationFrequency}
                  onChange={(e) => updatePreference('communicationFrequency', e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                >
                  <option value="as_needed">As needed</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-2">Important Note</h4>
          <p className="text-sm text-yellow-700">
            You will always receive emergency notifications about appointment changes or cancellations, 
            regardless of your preference settings. These ensure your safety and service continuity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerCommunicationPreferences;