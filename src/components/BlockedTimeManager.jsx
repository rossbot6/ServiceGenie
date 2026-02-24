import { useState, useEffect } from 'react';
import { Plus, X, Calendar, Clock, AlertCircle } from 'lucide-react';

const API_BASE = 'http://localhost:3001';

export default function BlockedTimeManager({ providerId, onSave }) {
  const [blockedTimes, setBlockedTimes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newBlock, setNewBlock] = useState({
    title: '',
    startTime: '',
    endTime: '',
    reason: '',
    type: 'break' // break, vacation, training, personal
  });

  // Load existing blocked times on mount
  useEffect(() => {
    loadBlockedTimes();
  }, [providerId]);

  async function loadBlockedTimes() {
    try {
      const response = await fetch(`${API_BASE}/api/providers/${providerId}/blocked-times`);
      if (response.ok) {
        const data = await response.json();
        setBlockedTimes(data);
      }
    } catch (error) {
      console.error('Failed to load blocked times:', error);
    }
  }

  const blockTypes = [
    { value: 'break', label: 'Break', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { value: 'vacation', label: 'Vacation', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'training', label: 'Training', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { value: 'personal', label: 'Personal', color: 'bg-gray-100 text-gray-800 border-gray-200' }
  ];

  const handleAddBlockedTime = async () => {
    if (!newBlock.title || !newBlock.startTime || !newBlock.endTime) return;
    
    setIsLoading(true);
    try {
      const block = {
        id: Date.now(),
        ...newBlock,
        startDateTime: new Date(`2026-02-23 ${newBlock.startTime}:00`),
        endDateTime: new Date(`2026-02-23 ${newBlock.endTime}:00`)
      };
      
      const updated = [...blockedTimes, block];
      
      // Save to API
      const response = await fetch(`${API_BASE}/api/providers/${providerId}/blocked-times`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      
      if (response.ok) {
        setBlockedTimes(updated);
        setNewBlock({ title: '', startTime: '', endTime: '', reason: '', type: 'break' });
        setShowForm(false);
        onSave && onSave(updated);
        console.log('Blocked time added and saved');
      } else {
        console.error('Failed to save blocked time');
      }
    } catch (error) {
      console.error('Error adding blocked time:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBlock = async (blockId) => {
    setIsLoading(true);
    try {
      const updated = blockedTimes.filter(block => block.id !== blockId);
      
      // Save to API
      const response = await fetch(`${API_BASE}/api/providers/${providerId}/blocked-times`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      
      if (response.ok) {
        setBlockedTimes(updated);
        onSave && onSave(updated);
        console.log('Blocked time deleted and saved');
      } else {
        console.error('Failed to save after deletion');
      }
    } catch (error) {
      console.error('Error deleting blocked time:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeInfo = (type) => blockTypes.find(t => t.value === type) || blockTypes[0];

  // Generate time slots for the day
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute of [0, 30]) {
        slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
    }
    return slots;
  };

  const getBlocksForDay = () => {
    return blockedTimes.filter(block => {
      const today = new Date('2026-02-23');
      return block.startDateTime.toDateString() === today.toDateString();
    });
  };

  const dayBlocks = getBlocksForDay();

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Blocked Time Management</h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Blocked Time
          </button>
        </div>

        {/* Add Blocked Time Form */}
        {showForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Add Blocked Time</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newBlock.title}
                  onChange={(e) => setNewBlock({ ...newBlock, title: e.target.value })}
                  placeholder="e.g., Lunch Break, Meeting"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={newBlock.type}
                  onChange={(e) => setNewBlock({ ...newBlock, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {blockTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={newBlock.startTime}
                  onChange={(e) => setNewBlock({ ...newBlock, startTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={newBlock.endTime}
                  onChange={(e) => setNewBlock({ ...newBlock, endTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason (Optional)
                </label>
                <textarea
                  value={newBlock.reason}
                  onChange={(e) => setNewBlock({ ...newBlock, reason: e.target.value })}
                  placeholder="Additional details..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAddBlockedTime}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Today's Blocked Times */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Today's Blocked Times</h4>
          
          {dayBlocks.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No blocked times scheduled for today</p>
            </div>
          ) : (
            dayBlocks.map(block => {
              const typeInfo = getTypeInfo(block.type);
              return (
                <div key={block.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded border text-xs font-medium ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{block.title}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {block.startTime} - {block.endTime}
                        {block.reason && <span className="text-gray-400">• {block.reason}</span>}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteBlock(block.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Time Slots Preview */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <h4 className="font-medium text-gray-900 mb-3">Daily Schedule Preview</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between p-2 bg-red-50 border border-red-200 rounded">
              <span>8:00-8:30 AM</span>
              <span className="text-red-600">Lunch Block</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 border border-gray-200 rounded">
              <span>8:30-9:00 AM</span>
              <span>Available</span>
            </div>
            {/* More time slots would be generated programmatically */}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            This preview shows how blocked times will appear in your schedule
          </p>
        </div>
      </div>
    </div>
  );
}