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
  const [schedules, setSchedules] = useState([]);
  const [availability, setAvailability] = useState({
    // Weekly availability (true = available, false = not available)
    Sunday: Array(16).fill(true),
    Monday: Array(16).fill(true),
    Tuesday: Array(16).fill(true),
    Wednesday: Array(16).fill(true),
    Thursday: Array(16).fill(true),
    Friday: Array(16).fill(true),
    Saturday: Array(16).fill(true)
  });
  
  const [blockedTimes, setBlockedTimes] = useState([]);
  const [specialDays, setSpecialDays] = useState([]);
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
  const [showDayDetail, setShowDayDetail] = useState('');
  const [newBlockTime, setNewBlockTime] = useState({
    start_date: '',
    end_date: '',
    start_time: '09:00',
    end_time: '17:00',
    reason: '',
    type: 'vacation'
  });
  const [showAddBlock, setShowAddBlock] = useState(false);

  useEffect(() => {
    if (provider?.schedule_settings) {
      // Load existing schedule settings
      setAvailability(provider.schedule_settings.availability || availability);
      setBlockedTimes(provider.schedule_settings.blocked_times || []);
      setSpecialDays(provider.schedule_settings.special_days || []);
    }
  }, [provider]);

  const handleTimeSlotToggle = (day, slotIndex) => {
    setAvailability(prev => ({
      ...prev,
      [day]: prev[day].map((available, index) => 
        index === slotIndex ? !available : available
      )
    }));
  };

  const handleQuickDayToggle = (day, available) => {
    setAvailability(prev => ({
      ...prev,
      [day]: Array(16).fill(available)
    }));
  };

  const handleBulkToggle = (startDay, endDay, timeSlots = null) => {
    setAvailability(prev => {
      const newAvailability = { ...prev };
      const daysToUpdate = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const startIndex = daysToUpdate.indexOf(startDay);
      const endIndex = daysToUpdate.indexOf(endDay);
      
      for (let i = startIndex; i <= endIndex; i++) {
        const day = daysToUpdate[i];
        if (timeSlots && Array.isArray(timeSlots)) {
          // Update specific time slots
          newAvailability[day] = newAvailability[day].map((slot, index) => 
            timeSlots.includes(index) ? !slot : slot
          );
        } else {
          // Toggle entire day
          newAvailability[day] = Array(16).fill(timeSlots !== null ? timeSlots : !newAvailability[day][0]);
        }
      }
      return newAvailability;
    });
  };

  const addBlockedTime = () => {
    if (!newBlockTime.start_date || !newBlockTime.end_date) return;
    
    const blockId = crypto.randomUUID();
    const blockTime = {
      id: blockId,
      ...newBlockTime,
      created_at: new Date().toISOString()
    };
    
    setBlockedTimes(prev => [...prev, blockTime]);
    setNewBlockTime({
      start_date: '',
      end_date: '',
      start_time: '09:00',
      end_time: '17:00',
      reason: '',
      type: 'vacation'
    });
    setShowAddBlock(false);
  };

  const removeBlockedTime = (blockId) => {
    setBlockedTimes(prev => prev.filter(block => block.id !== blockId));
  };

  const getDayTimeZone = (date) => {
    // In a real app, this would handle timezone conversions
    return 'America/New_York';
  };

  const getTimeSlotDisplay = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const saveSchedule = () => {
    const scheduleData = {
      provider_id: provider.id,
      availability,
      blocked_times: blockedTimes,
      special_days: specialDays,
      updated_at: new Date().toISOString()
    };
    
    onSave(scheduleData);
  };

  const renderTimeGrid = (day) => {
    return (
      <div className="grid grid-cols-4 gap-1 text-xs">
        {TIME_SLOTS.map((time, index) => {
          const isAvailable = availability[day]?.[index];
          const timeDisplay = getTimeSlotDisplay(time);
          
          return (
            <button
              key={index}
              onClick={() => handleTimeSlotToggle(day, index)}
              className={`p-2 rounded text-center border transition-colors ${
                isAvailable
                  ? 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100'
                  : 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100'
              }`}
              title={`${timeDisplay} ${isAvailable ? 'Available' : 'Unavailable'}`}
            >
              {timeDisplay}
            </button>
          );
        })}
      </div>
    );
  };

  const getAvailabilityStats = () => {
    const totalSlots = 16 * 7; // 16 time slots × 7 days
    const availableSlots = Object.values(availability).reduce((sum, day) => 
      sum + day.filter(slot => slot).length, 0
    );
    const percentage = Math.round((availableSlots / totalSlots) * 100);
    
    return { availableSlots, totalSlots, percentage };
  };

  const stats = getAvailabilityStats();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Calendar size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Provider Schedule Management</h3>
            <p className="text-sm text-gray-500">
              Configure availability and schedule settings for {provider?.name || 'Unknown Provider'}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="btn btn-secondary flex items-center gap-2">
            <XIcon size={16} />
            Cancel
          </button>
          <button onClick={saveSchedule} className="btn btn-primary flex items-center gap-2">
            <Check size={16} />
            Save Schedule
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule Overview */}
        <div className="lg:col-span-2 space-y-6">
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
                <AlertCircle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-500">Blocked Times</p>
                  <p className="text-xl font-bold text-gray-900">{blockedTimes.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Schedule */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Weekly Availability</h4>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleBulkToggle('Monday', 'Friday', null)}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Weekdays
                </button>
                <button 
                  onClick={() => handleBulkToggle('Saturday', 'Sunday', null)}
                  className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                >
                  Weekend
                </button>
                <button 
                  onClick={() => {
                    Object.keys(availability).forEach(day => {
                      handleQuickDayToggle(day, true);
                    });
                  }}
                  className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                >
                  All Days
                </button>
                <button 
                  onClick={() => {
                    Object.keys(availability).forEach(day => {
                      handleQuickDayToggle(day, false);
                    });
                  }}
                  className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
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
                        <span className={`px-2 py-1 rounded text-xs ${
                          isWorkingDay ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {isWorkingDay ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleQuickDayToggle(day, true)}
                          className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                        >
                          Available
                        </button>
                        <button
                          onClick={() => handleQuickDayToggle(day, false)}
                          className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          Off
                        </button>
                      </div>
                    </div>
                    {isWorkingDay && renderTimeGrid(day)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Blocked Times */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Blocked Times</h4>
              <button
                onClick={() => setShowAddBlock(true)}
                className="btn btn-primary btn-sm flex items-center gap-1"
              >
                <Plus size={14} />
                Add
              </button>
            </div>
            
            <div className="space-y-3">
              {blockedTimes.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No blocked times scheduled
                </p>
              ) : (
                blockedTimes.map((block) => (
                  <div key={block.id} className="p-3 border rounded-lg bg-red-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertCircle size={14} className="text-red-600" />
                          <span className="text-sm font-medium text-red-800">
                            {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{block.reason}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {block.start_date} → {block.end_date}
                        </p>
                        <p className="text-xs text-gray-500">
                          {getTimeSlotDisplay(block.start_time)} - {getTimeSlotDisplay(block.end_time)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeBlockedTime(block.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Settings */}
          <div className="card">
            <h4 className="font-medium text-gray-900 mb-4">Quick Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Max appointments per day</span>
                <input
                  type="number"
                  min="1"
                  max="20"
                  defaultValue="8"
                  className="w-16 text-sm border rounded px-2 py-1"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Buffer time between appointments</span>
                <input
                  type="number"
                  min="0"
                  max="60"
                  defaultValue="15"
                  className="w-16 text-sm border rounded px-2 py-1"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Allow double-booking</span>
                <input type="checkbox" className="toggle" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Auto-accept bookings</span>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
            </div>
          </div>

          {/* Schedule Preview */}
          <div className="card">
            <h4 className="font-medium text-gray-900 mb-4">Today's Schedule</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                <Clock size={14} className="text-green-600" />
                <span className="text-green-700">Available 9:00 AM - 5:00 PM</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                <User size={14} className="text-blue-600" />
                <span className="text-blue-700">Next available slot: 10:00 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Blocked Time Modal */}
      {showAddBlock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Add Blocked Time</h4>
              <button
                onClick={() => setShowAddBlock(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={newBlockTime.type}
                  onChange={(e) => setNewBlockTime(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="vacation">Vacation</option>
                  <option value="training">Training</option>
                  <option value="personal">Personal</option>
                  <option value="break">Break</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={newBlockTime.start_date}
                  onChange={(e) => setNewBlockTime(prev => ({ ...prev, start_date: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={newBlockTime.end_date}
                  onChange={(e) => setNewBlockTime(prev => ({ ...prev, end_date: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newBlockTime.start_time}
                    onChange={(e) => setNewBlockTime(prev => ({ ...prev, start_time: e.target.value }))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newBlockTime.end_time}
                    onChange={(e) => setNewBlockTime(prev => ({ ...prev, end_time: e.target.value }))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <textarea
                  value={newBlockTime.reason}
                  onChange={(e) => setNewBlockTime(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                  rows="2"
                  placeholder="Optional reason..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddBlock(false)}
                className="flex-1 btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={addBlockedTime}
                className="flex-1 btn btn-primary"
                disabled={!newBlockTime.start_date || !newBlockTime.end_date}
              >
                Add Block
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
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
        </div>
      )}
    </div>
  );
}