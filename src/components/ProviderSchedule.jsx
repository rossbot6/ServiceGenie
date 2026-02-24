import { useState, useEffect } from 'react';
import { 
  Clock, Calendar, Plus, X, ChevronLeft, ChevronRight,
  User, Settings, Trash2, Edit, Check, X as XIcon,
  AlertCircle, Coffee, Sun, Moon, Timer, Zap, Save
} from 'lucide-react';

const API_BASE = 'http://localhost:3001';

const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00'
];

export default function ProviderSchedule({ provider, onSave, onCancel }) {
  const [availability, setAvailability] = useState({
    Sunday: Array(16).fill(false),
    Monday: Array(16).fill(true),
    Tuesday: Array(16).fill(true),
    Wednesday: Array(16).fill(true),
    Thursday: Array(16).fill(true),
    Friday: Array(16).fill(true),
    Saturday: Array(16).fill(false)
  });
  
  const [blockedTimes, setBlockedTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const providerId = provider?.id || 1;

  // API functions for data persistence
  useEffect(() => {
    loadScheduleData();
  }, [providerId]);

  async function loadScheduleData() {
    setIsLoading(true);
    try {
      // Load schedule
      const scheduleResponse = await fetch(`${API_BASE}/api/providers/${providerId}/schedule`);
      if (scheduleResponse.ok) {
        const scheduleData = await scheduleResponse.json();
        setAvailability(prev => ({ ...prev, ...scheduleData }));
      }

      // Load blocked times
      const blockedResponse = await fetch(`${API_BASE}/api/providers/${providerId}/blocked-times`);
      if (blockedResponse.ok) {
        const blockedData = await blockedResponse.json();
        setBlockedTimes(blockedData);
      }

      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to load schedule data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveScheduleData() {
    setIsLoading(true);
    try {
      // Save schedule
      const scheduleResponse = await fetch(`${API_BASE}/api/providers/${providerId}/schedule`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(availability)
      });

      // Save blocked times
      const blockedResponse = await fetch(`${API_BASE}/api/providers/${providerId}/blocked-times`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blockedTimes)
      });

      if (scheduleResponse.ok && blockedResponse.ok) {
        setHasUnsavedChanges(false);
        setLastSaved(new Date());
        onSave && onSave({ availability, blockedTimes });
        console.log('Schedule saved successfully');
        return true;
      } else {
        console.error('Failed to save schedule');
        return false;
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  // Update availability and mark as changed
  const updateAvailability = (day, slotIndex, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: prev[day].map((isAvailable, index) => 
        index === slotIndex ? value : isAvailable
      )
    }));
    setHasUnsavedChanges(true);
  };

  // Bulk update availability
  const updateBulkAvailability = (day, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: prev[day].map(() => value)
    }));
    setHasUnsavedChanges(true);
  };

  // Calculate stats
  const stats = {
    totalSlots: Object.values(availability).reduce((total, dayArray) => total + dayArray.length, 0),
    availableSlots: Object.values(availability).reduce((total, dayArray) => 
      total + dayArray.filter(Boolean).length, 0),
  };
  stats.percentage = stats.totalSlots > 0 ? Math.round((stats.availableSlots / stats.totalSlots) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Calendar size={24} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Weekly Schedule</h1>
            <p className="text-gray-500">Manage your availability</p>
          </div>
        </div>
        
        {hasUnsavedChanges && (
          <div className="flex items-center gap-2 text-orange-600">
            <AlertCircle size={16} />
            <span className="text-sm font-medium">Unsaved changes</span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-sm text-gray-500">Availability</p>
              <p className="text-xl font-bold text-gray-900">{stats.percentage}%</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Available Slots</p>
              <p className="text-xl font-bold text-gray-900">{stats.availableSlots}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Total Slots</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalSlots}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Builder */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-lg font-medium text-gray-900">Weekly Availability</h4>
            <p className="text-sm text-gray-500">Set your available hours for each day</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                Object.keys(availability).forEach(day => {
                  updateBulkAvailability(day, true);
                });
              }}
              className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
              All Days
            </button>
            <button 
              onClick={() => {
                Object.keys(availability).forEach(day => {
                  updateBulkAvailability(day, false);
                });
              }}
              className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              None
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {DAYS_OF_WEEK.map((day) => {
            const isWorkingDay = availability[day]?.some(slot => slot);
            return (
              <div key={day} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h5 className="font-medium text-gray-900">{day}</h5>
                    <div className={`w-2 h-2 rounded-full ${isWorkingDay ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className={`text-xs px-2 py-1 rounded ${isWorkingDay ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {availability[day]?.filter(Boolean).length || 0} hours
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateBulkAvailability(day, true)}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      All
                    </button>
                    <button
                      onClick={() => updateBulkAvailability(day, false)}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      None
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-8 gap-2">
                  {TIME_SLOTS.map((time, slotIndex) => (
                    <button
                      key={time}
                      onClick={() => updateAvailability(day, slotIndex, !availability[day][slotIndex])}
                      className={`p-2 text-xs rounded border transition-colors ${
                        availability[day][slotIndex]
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Blocked Times Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-medium text-gray-900">Blocked Times</h4>
            <p className="text-sm text-gray-500">Time off, breaks, or unavailable periods</p>
          </div>
        </div>
        
        {blockedTimes.length > 0 ? (
          <div className="space-y-2">
            {blockedTimes.map((block) => (
              <div key={block.id} className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                <div className="flex items-center gap-3">
                  <Coffee className="w-4 h-4 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-800">{block.title}</p>
                    <p className="text-xs text-red-600">
                      {new Date(block.startDateTime).toLocaleString()} - {new Date(block.endDateTime).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const updated = blockedTimes.filter(b => b.id !== block.id);
                    setBlockedTimes(updated);
                    setHasUnsavedChanges(true);
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Timer className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No blocked times scheduled</p>
          </div>
        )}
      </div>

      {/* Save/Cancel Actions */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <div className="flex items-center gap-2 text-orange-600">
                <AlertCircle size={16} />
                <span className="text-sm font-medium">Unsaved changes</span>
              </div>
            )}
            {lastSaved && (
              <div className="text-sm text-gray-500">
                Last saved: {lastSaved.toLocaleTimeString()}
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                const success = await saveScheduleData();
                if (success && onSave) {
                  onSave({ availability, blockedTimes });
                  onCancel();
                }
              }}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {isLoading ? 'Saving...' : 'Save Schedule'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}