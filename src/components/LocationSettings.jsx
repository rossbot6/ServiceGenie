import { useState } from 'react';
import { 
  Clock, DollarSign, Calendar, AlertTriangle, 
  Save, X, Settings, Timer, CreditCard,
  Shield, Bell, Zap, Target
} from 'lucide-react';

const API_BASE = 'http://localhost:3001';

export default function LocationSettings({ location, onSave, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const locationId = location?.id || 1;
  
  const [formData, setFormData] = useState({
    // Basic Settings
    min_lead_hours: location?.min_lead_hours || 24,
    buffer_minutes: location?.buffer_minutes || 15,
    default_duration: location?.default_duration || 60,
    
    // Booking Policies
    cancellation_window_hours: location?.cancellation_window_hours || 24,
    cancellation_fee_percent: location?.cancellation_fee_percent || 50,
    require_deposit: location?.require_deposit || false,
    deposit_amount: location?.deposit_amount || 0,
    
    // No-Show Policy
    max_no_shows: location?.max_no_shows || 3,
    ban_threshold: location?.ban_threshold || 3,
    
    // Business Hours
    monday_open: location?.monday_open || '09:00',
    monday_close: location?.monday_close || '18:00',
    tuesday_open: location?.tuesday_open || '09:00',
    tuesday_close: location?.tuesday_close || '18:00',
    wednesday_open: location?.wednesday_open || '09:00',
    wednesday_close: location?.wednesday_close || '18:00',
    thursday_open: location?.thursday_open || '09:00',
    thursday_close: location?.thursday_close || '18:00',
    friday_open: location?.friday_open || '09:00',
    friday_close: location?.friday_close || '18:00',
    saturday_open: location?.saturday_open || '10:00',
    saturday_close: location?.saturday_close || '16:00',
    sunday_open: location?.sunday_open || '',
    sunday_close: location?.sunday_close || '',
    
    // Notification Preferences
    sms_notifications_enabled: location?.sms_notifications_enabled || true,
    email_notifications_enabled: location?.email_notifications_enabled || true,
    
    // Advanced Settings
    rush_booking_allowed: location?.rush_booking_allowed || false,
    waitlist_enabled: location?.waitlist_enabled || true,
    double_booking_allowed: location?.double_booking_allowed || false
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/locations/${locationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setLastSaved(new Date());
        onSave && onSave(formData);
        console.log('Location settings saved successfully');
      } else {
        console.error('Failed to save location settings');
      }
    } catch (error) {
      console.error('Error saving location settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-gray-700" />
        <div>
          <h2 className="text-xl font-bold text-gray-900">Location Settings</h2>
          <p className="text-gray-600">Configure booking policies and business settings</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Basic Booking Settings */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">Basic Booking Settings</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Lead Time (hours)
              </label>
              <input
                type="number"
                value={formData.min_lead_hours}
                onChange={(e) => handleInputChange('min_lead_hours', parseInt(e.target.value) || 24)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="72"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum time before an appointment</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buffer Time (minutes)
              </label>
              <input
                type="number"
                value={formData.buffer_minutes}
                onChange={(e) => handleInputChange('buffer_minutes', parseInt(e.target.value) || 15)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="60"
              />
              <p className="text-xs text-gray-500 mt-1">Time between appointments</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Duration (minutes)
              </label>
              <select
                value={formData.default_duration}
                onChange={(e) => handleInputChange('default_duration', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cancellation & Deposit Policy */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-medium text-gray-900">Cancellation & Deposit Policy</h3>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cancellation Window (hours)
                </label>
                <input
                  type="number"
                  value={formData.cancellation_window_hours}
                  onChange={(e) => handleInputChange('cancellation_window_hours', parseInt(e.target.value) || 24)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="168"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum notice required for cancellation</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cancellation Fee (%)
                </label>
                <input
                  type="number"
                  value={formData.cancellation_fee_percent}
                  onChange={(e) => handleInputChange('cancellation_fee_percent', parseInt(e.target.value) || 50)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
                />
                <p className="text-xs text-gray-500 mt-1">Percentage of service charge</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.require_deposit}
                  onChange={(e) => handleInputChange('require_deposit', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Require Deposit</span>
              </label>
              
              {formData.require_deposit && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deposit Amount ($)
                  </label>
                  <input
                    type="number"
                    value={formData.deposit_amount}
                    onChange={(e) => handleInputChange('deposit_amount', parseInt(e.target.value) || 0)}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* No-Show Policy */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-medium text-gray-900">No-Show Policy</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum No-Shows Allowed
              </label>
              <input
                type="number"
                value={formData.max_no_shows}
                onChange={(e) => handleInputChange('max_no_shows', parseInt(e.target.value) || 3)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="10"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ban Threshold
              </label>
              <input
                type="number"
                value={formData.ban_threshold}
                onChange={(e) => handleInputChange('ban_threshold', parseInt(e.target.value) || 3)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="10"
              />
              <p className="text-xs text-gray-500 mt-1">No. of no-shows before ban</p>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Timer className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-medium text-gray-900">Business Hours</h3>
          </div>
          
          <div className="space-y-4">
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
              <div key={day} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                <div className="w-24 text-sm font-medium text-gray-700 capitalize">
                  {day}
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={formData[`${day}_open`]}
                    onChange={(e) => handleInputChange(`${day}_open`, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    disabled={day === 'sunday' && !formData[`${day}_open`]}
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="time"
                    value={formData[`${day}_close`]}
                    onChange={(e) => handleInputChange(`${day}_close`, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    disabled={day === 'sunday' && !formData[`${day}_close`]}
                  />
                  
                  {day === 'sunday' && (
                    <label className="flex items-center gap-2 ml-4">
                      <input
                        type="checkbox"
                        checked={!!formData[`${day}_open`]}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleInputChange(`${day}_open`, '10:00');
                            handleInputChange(`${day}_close`, '16:00');
                          } else {
                            handleInputChange(`${day}_open`, '');
                            handleInputChange(`${day}_close`, '');
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Open on Sundays</span>
                    </label>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">SMS Notifications</label>
                <p className="text-xs text-gray-500">Send appointment updates via SMS</p>
              </div>
              <input
                type="checkbox"
                checked={formData.sms_notifications_enabled}
                onChange={(e) => handleInputChange('sms_notifications_enabled', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                <p className="text-xs text-gray-500">Send appointment updates via email</p>
              </div>
              <input
                type="checkbox"
                checked={formData.email_notifications_enabled}
                onChange={(e) => handleInputChange('email_notifications_enabled', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save/Cancel Actions */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={16} />
            {isLoading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
        
        {lastSaved && (
          <p className="text-xs text-gray-500 mt-2 text-right">
            Last saved: {lastSaved.toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  );
}