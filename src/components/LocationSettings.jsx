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
    
    // No-show Policy
    no_show_fee: location?.no_show_fee || 25,
    no_show_ban_threshold: location?.no_show_ban_threshold || 3,
    
    // Business Hours
    opening_time: location?.opening_time || '08:00',
    closing_time: location?.closing_time || '20:00',
    
    // Advanced Settings
    advance_booking_days: 30,
    rush_booking_fee: 25,
    rescheduling_allowed: true,
    max_concurrent_appointments: 2,
    waitlist_enabled: true,
    
    // Notification Settings
    reminder_hours_before: 24,
    confirmation_required: true,
    sms_notifications_enabled: true,
    email_notifications_enabled: true
  });

  const [errors, setErrors] = useState({});

  const handleSave = () => {
    // Validate form
    const newErrors = {};
    
    if (formData.min_lead_hours < 1) {
      newErrors.min_lead_hours = 'Minimum lead time must be at least 1 hour';
    }
    
    if (formData.buffer_minutes < 0 || formData.buffer_minutes > 60) {
      newErrors.buffer_minutes = 'Buffer time must be between 0 and 60 minutes';
    }
    
    if (formData.cancellation_fee_percent < 0 || formData.cancellation_fee_percent > 100) {
      newErrors.cancellation_fee_percent = 'Cancellation fee must be between 0 and 100%';
    }
    
    if (formData.deposit_amount < 0) {
      newErrors.deposit_amount = 'Deposit amount cannot be negative';
    }
    
    if (formData.no_show_fee < 0) {
      newErrors.no_show_fee = 'No-show fee cannot be negative';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSave(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Location Settings</h3>
          <p className="text-sm text-gray-500">
            Configure booking policies and operational settings for {location?.name || 'this location'}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="btn btn-secondary flex items-center gap-2"
          >
            <X size={16} />
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary flex items-center gap-2"
          >
            <Save size={16} />
            Save Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Booking Settings */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary-600" />
            <h4 className="font-medium text-gray-900">Basic Booking Settings</h4>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Lead Time (hours)
              </label>
              <input
                type="number"
                value={formData.min_lead_hours}
                onChange={(e) => handleInputChange('min_lead_hours', parseInt(e.target.value))}
                className="form-input"
                min="1"
                max="168"
              />
              {errors.min_lead_hours && (
                <p className="text-sm text-red-600 mt-1">{errors.min_lead_hours}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                How far in advance customers must book appointments
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buffer Time (minutes)
              </label>
              <input
                type="number"
                value={formData.buffer_minutes}
                onChange={(e) => handleInputChange('buffer_minutes', parseInt(e.target.value))}
                className="form-input"
                min="0"
                max="60"
              />
              {errors.buffer_minutes && (
                <p className="text-sm text-red-600 mt-1">{errors.buffer_minutes}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Time between appointments for cleanup/setup
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Appointment Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.default_duration}
                onChange={(e) => handleInputChange('default_duration', parseInt(e.target.value))}
                className="form-input"
                min="15"
                max="480"
              />
              <p className="text-xs text-gray-500 mt-1">
                Default duration for new services
              </p>
            </div>
          </div>
        </div>

        {/* Cancellation & Deposit Policy */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h4 className="font-medium text-gray-900">Cancellation & Deposit Policy</h4>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cancellation Window (hours)
              </label>
              <input
                type="number"
                value={formData.cancellation_window_hours}
                onChange={(e) => handleInputChange('cancellation_window_hours', parseInt(e.target.value))}
                className="form-input"
                min="1"
                max="168"
              />
              <p className="text-xs text-gray-500 mt-1">
                How many hours before appointment customers must cancel to avoid fees
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cancellation Fee (%)
              </label>
              <input
                type="number"
                value={formData.cancellation_fee_percent}
                onChange={(e) => handleInputChange('cancellation_fee_percent', parseInt(e.target.value))}
                className="form-input"
                min="0"
                max="100"
              />
              {errors.cancellation_fee_percent && (
                <p className="text-sm text-red-600 mt-1">{errors.cancellation_fee_percent}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Require Deposit</label>
                <p className="text-xs text-gray-500">Customers must pay deposit to book</p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.require_deposit}
                  onChange={(e) => handleInputChange('require_deposit', e.target.checked)}
                  className="toggle"
                />
              </div>
            </div>

            {formData.require_deposit && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deposit Amount ($)
                </label>
                <input
                  type="number"
                  value={formData.deposit_amount}
                  onChange={(e) => handleInputChange('deposit_amount', parseFloat(e.target.value))}
                  className="form-input"
                  step="0.01"
                  min="0"
                />
                {errors.deposit_amount && (
                  <p className="text-sm text-red-600 mt-1">{errors.deposit_amount}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* No-Show Policy */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-red-600" />
            <h4 className="font-medium text-gray-900">No-Show Policy</h4>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No-Show Fee ($)
              </label>
              <input
                type="number"
                value={formData.no_show_fee}
                onChange={(e) => handleInputChange('no_show_fee', parseFloat(e.target.value))}
                className="form-input"
                step="0.01"
                min="0"
              />
              {errors.no_show_fee && (
                <p className="text-sm text-red-600 mt-1">{errors.no_show_fee}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ban Threshold (no-shows)
              </label>
              <input
                type="number"
                value={formData.no_show_ban_threshold}
                onChange={(e) => handleInputChange('no_show_ban_threshold', parseInt(e.target.value))}
                className="form-input"
                min="1"
                max="10"
              />
              <p className="text-xs text-gray-500 mt-1">
                Number of no-shows before customer is banned
              </p>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Timer className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium text-gray-900">Business Hours</h4>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opening Time
                </label>
                <input
                  type="time"
                  value={formData.opening_time}
                  onChange={(e) => handleInputChange('opening_time', e.target.value)}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Closing Time
                </label>
                <input
                  type="time"
                  value={formData.closing_time}
                  onChange={(e) => handleInputChange('closing_time', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-purple-600" />
            <h4 className="font-medium text-gray-900">Advanced Settings</h4>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Advance Booking Limit (days)
              </label>
              <input
                type="number"
                value={formData.advance_booking_days}
                onChange={(e) => handleInputChange('advance_booking_days', parseInt(e.target.value))}
                className="form-input"
                min="1"
                max="365"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum days customers can book in advance
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rush Booking Fee ($)
              </label>
              <input
                type="number"
                value={formData.rush_booking_fee}
                onChange={(e) => handleInputChange('rush_booking_fee', parseFloat(e.target.value))}
                className="form-input"
                step="0.01"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Additional fee for short-notice bookings
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Allow Rescheduling</label>
                  <p className="text-xs text-gray-500">Customers can change their appointment time</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.rescheduling_allowed}
                  onChange={(e) => handleInputChange('rescheduling_allowed', e.target.checked)}
                  className="toggle"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Enable Waitlist</label>
                  <p className="text-xs text-gray-500">Allow customers to join waitlist for cancelled slots</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.waitlist_enabled}
                  onChange={(e) => handleInputChange('waitlist_enabled', e.target.checked)}
                  className="toggle"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-green-600" />
            <h4 className="font-medium text-gray-900">Notification Settings</h4>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reminder Hours Before Appointment
              </label>
              <input
                type="number"
                value={formData.reminder_hours_before}
                onChange={(e) => handleInputChange('reminder_hours_before', parseInt(e.target.value))}
                className="form-input"
                min="1"
                max="72"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">Require Confirmation</label>
                  <p className="text-xs text-gray-500">Customers must confirm appointments</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.confirmation_required}
                  onChange={(e) => handleInputChange('confirmation_required', e.target.checked)}
                  className="toggle"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">SMS Notifications</label>
                  <p className="text-xs text-gray-500">Send appointment updates via SMS</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.sms_notifications_enabled}
                  onChange={(e) => handleInputChange('sms_notifications_enabled', e.target.checked)}
                  className="toggle"
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
                  className="toggle"
                />
              </div>
            </div>
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
          onClick={async () => {
            setIsLoading(true);
            try {
              // Save to API
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
          }}
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
  );
}