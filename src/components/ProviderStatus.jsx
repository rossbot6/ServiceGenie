import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Coffee, Heart } from 'lucide-react';

const API_BASE = 'http://localhost:3001';

export default function ProviderStatus() {
  const [currentStatus, setCurrentStatus] = useState('available');
  const [breakStartTime, setBreakStartTime] = useState(null);
  const [notes, setNotes] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const providerId = 1; // Mock provider ID - in real app this would come from auth
  
  // Status options
  const statusOptions = [
    { 
      value: 'available', 
      label: 'Available', 
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle,
      description: 'Ready to take appointments'
    },
    { 
      value: 'break', 
      label: 'On Break', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Coffee,
      description: 'Temporarily unavailable'
    },
    { 
      value: 'busy', 
      label: 'Busy', 
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      icon: Clock,
      description: 'In session with client'
    },
    { 
      value: 'unavailable', 
      label: 'Unavailable', 
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: XCircle,
      description: 'Not accepting appointments'
    }
  ];

  // Load current status on component mount
  useEffect(() => {
    loadProviderStatus();
  }, []);

  // Update current status tracking
  useEffect(() => {
    if (currentStatus === 'break' && !breakStartTime) {
      setBreakStartTime(new Date());
    } else if (currentStatus !== 'break') {
      setBreakStartTime(null);
    }
  }, [currentStatus, breakStartTime]);

  // API functions
  async function loadProviderStatus() {
    try {
      const response = await fetch(`${API_BASE}/api/providers`);
      const providers = await response.json();
      const current = providers.find(p => p.id === providerId);
      
      if (current) {
        setCurrentStatus(current.status || 'available');
        setNotes(current.status_notes || '');
      }
    } catch (error) {
      console.error('Failed to load provider status:', error);
    }
  }

  async function saveProviderStatus(status, notesText = '') {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/providers/${providerId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: status,
          notes: notesText
        })
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        setLastUpdate(new Date());
        console.log('Status saved successfully:', result);
      } else {
        console.error('Failed to save status:', result);
        alert('Failed to save status. Please try again.');
      }
    } catch (error) {
      console.error('Error saving status:', error);
      alert('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleStatusChange = async (newStatus) => {
    setCurrentStatus(newStatus);
    
    // Automatically save status change
    const finalNotes = newStatus === 'unavailable' ? reason : notes;
    await saveProviderStatus(newStatus, finalNotes);
    
    // Update local tracking
    if (newStatus === 'break') {
      setBreakStartTime(new Date());
    } else {
      setBreakStartTime(null);
      if (newStatus !== 'unavailable') {
        setReason(''); // Clear reason when changing from unavailable
      }
    }
  };

  const formatBreakTime = (startTime) => {
    if (!startTime) return '';
    
    const now = new Date();
    const diff = Math.floor((now - startTime) / 1000 / 60); // minutes
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const currentStatusOption = statusOptions.find(option => option.value === currentStatus);
  const StatusIcon = currentStatusOption?.icon || CheckCircle;

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Status</h3>
          <div className="flex items-center gap-2">
            <StatusIcon className="w-5 h-5" />
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${currentStatusOption?.color}`}>
              {currentStatusOption?.label}
            </span>
          </div>
        </div>

        {/* Current Status Display */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Current Status</span>
            {currentStatus === 'break' && breakStartTime && (
              <span className="text-xs text-gray-500">
                Duration: {formatBreakTime(breakStartTime)}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{currentStatusOption?.description}</p>
        </div>

        {/* Status Selection */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            Change Status
          </label>
          <div className="grid grid-cols-2 gap-3">
            {statusOptions.slice(0, 4).map((option) => {
              const Icon = option.icon;
              const isSelected = currentStatus === option.value;
              
              return (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                  <p className="text-xs text-gray-600">{option.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Last Update Display */}
        {lastUpdate && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              ✅ Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
        )}

        {/* Reason for Status Change */}
        {currentStatus === 'unavailable' && (
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Reason (Required)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Personal emergency, illness, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>
        )}

        {/* Notes */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Status Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about your current availability, specific requests, etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleStatusChange('available')}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              currentStatus === 'available'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Saving...' : 'Make Available'}
          </button>
          <button
            onClick={() => handleStatusChange('break')}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              currentStatus === 'break'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Take Break
          </button>
          <button
            onClick={() => handleStatusChange('busy')}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              currentStatus === 'busy'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Mark Busy
          </button>
        </div>
        
        {/* Manual Save Button */}
        <div className="flex gap-2">
          <button
            onClick={() => saveProviderStatus(currentStatus, notes)}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
          {currentStatus === 'unavailable' && (
            <button
              onClick={() => handleStatusChange('unavailable')}
              disabled={isLoading || !reason.trim()}
              className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Set Unavailable
            </button>
          )}
        </div>
        
        {isLoading && (
          <div className="mt-2 text-sm text-blue-600">
            ⏳ Saving status to database...
          </div>
        )}
      </div>
    </div>
  );
}