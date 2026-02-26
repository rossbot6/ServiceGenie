import React, { useState, useEffect } from 'react';
import { Users, Clock, Phone, Mail, MessageSquare, CheckCircle, AlertCircle, Plus } from 'lucide-react';

const WaitlistSection = () => {
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWaitlistEntry, setNewWaitlistEntry] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    service_type: '',
    preferred_date: '',
    preferred_time: '',
    notes: '',
    priority: 'normal' // normal, high, urgent
  });

  // Mock waitlist data (in real implementation, would come from API)
  const mockWaitlist = [
    {
      id: 1,
      customer_name: 'Rebecca Johnson',
      customer_phone: '(555) 123-4567',
      customer_email: 'rebecca.j@email.com',
      service_type: 'Full Balayage',
      preferred_date: '2026-03-01',
      preferred_time: '10:00',
      notes: 'Special occasion - wedding hair trial',
      priority: 'urgent',
      status: 'waiting',
      created_at: '2026-02-25T14:30:00Z',
      notified_at: null,
      contacted_at: null
    },
    {
      id: 2,
      customer_name: 'Jessica Kim',
      customer_phone: '(555) 234-5678',
      customer_email: 'jessica.k@email.com',
      service_type: 'Haircut & Style',
      preferred_date: '2026-02-28',
      preferred_time: '14:00',
      notes: 'Prefers morning appointments if possible',
      priority: 'high',
      status: 'waiting',
      created_at: '2026-02-24T16:45:00Z',
      notified_at: null,
      contacted_at: null
    },
    {
      id: 3,
      customer_name: 'Amanda Rodriguez',
      customer_phone: '(555) 345-6789',
      customer_email: 'amanda.r@email.com',
      service_type: 'Root Touch-up',
      preferred_date: '2026-03-05',
      preferred_time: '11:00',
      notes: '',
      priority: 'normal',
      status: 'waiting',
      created_at: '2026-02-23T09:15:00Z',
      notified_at: '2026-02-24T10:00:00Z',
      contacted_at: '2026-02-24T10:15:00Z'
    }
  ];

  const loadWaitlist = async () => {
    try {
      setLoading(true);
      
      // In real implementation, would fetch from API:
      // const response = await fetch('/api/waitlist');
      // const data = await response.json();
      
      // For demo, use mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      setWaitlist(mockWaitlist);
      
    } catch (error) {
      console.error('Error loading waitlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWaitlist = async () => {
    try {
      const waitlistEntry = {
        id: Date.now(),
        ...newWaitlistEntry,
        status: 'waiting',
        created_at: new Date().toISOString(),
        notified_at: null,
        contacted_at: null
      };
      
      // In real implementation, would POST to API:
      // const response = await fetch('/api/waitlist', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(waitlistEntry)
      // });
      
      // For demo, add to local state
      setWaitlist(prev => [waitlistEntry, ...prev]);
      
      // Reset form
      setNewWaitlistEntry({
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        service_type: '',
        preferred_date: '',
        preferred_time: '',
        notes: '',
        priority: 'normal'
      });
      setShowAddForm(false);
      
    } catch (error) {
      console.error('Error adding to waitlist:', error);
    }
  };

  const updateWaitlistStatus = async (id, status) => {
    try {
      // In real implementation, would PUT to API:
      // const response = await fetch(`/api/waitlist/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status })
      // });
      
      // For demo, update local state
      setWaitlist(prev => prev.map(entry => 
        entry.id === id 
          ? { 
              ...entry, 
              status,
              notified_at: status === 'notified' ? new Date().toISOString() : entry.notified_at,
              contacted_at: status === 'contacted' ? new Date().toISOString() : entry.contacted_at
            }
          : entry
      ));
      
    } catch (error) {
      console.error('Error updating waitlist status:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'notified':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'contacted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'booked':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent':
        return <AlertCircle className="h-4 w-4" />;
      case 'high':
        return <Clock className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  // Common services for dropdown
  const serviceTypes = [
    'Full Balayage',
    'Root Touch-up',
    'Haircut & Style',
    'Blowout',
    'Men\'s Cut',
    'Color Correction',
    'Highlights',
    'Deep Conditioning'
  ];

  useEffect(() => {
    loadWaitlist();
  }, []);

  // Sort waitlist by priority and date
  const sortedWaitlist = [...waitlist].sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, normal: 2 };
    const priorityDiff = (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
    
    if (priorityDiff !== 0) return priorityDiff;
    
    // Secondary sort by creation date (newest first)
    return new Date(b.created_at) - new Date(a.created_at);
  });

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2 text-indigo-500" />
              Waitlist Management
            </h2>
            <p className="text-gray-600 mt-1">
              Manage customer waitlist and notify when appointments become available
            </p>
          </div>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add to Waitlist
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Waiting</p>
              <p className="text-2xl font-bold text-gray-900">
                {waitlist.filter(entry => entry.status === 'waiting').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">
                {waitlist.filter(entry => entry.priority === 'urgent' || entry.priority === 'high').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">To Notify</p>
              <p className="text-2xl font-bold text-gray-900">
                {waitlist.filter(entry => entry.status === 'waiting' && entry.priority === 'urgent').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Contacted Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {waitlist.filter(entry => {
                  const today = new Date().toDateString();
                  return entry.contacted_at && new Date(entry.contacted_at).toDateString() === today;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add to Waitlist Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add Customer to Waitlist</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                value={newWaitlistEntry.customer_name}
                onChange={(e) => setNewWaitlistEntry(prev => ({ ...prev, customer_name: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                placeholder="Enter customer name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={newWaitlistEntry.customer_phone}
                onChange={(e) => setNewWaitlistEntry(prev => ({ ...prev, customer_phone: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                placeholder="(555) 123-4567"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={newWaitlistEntry.customer_email}
                onChange={(e) => setNewWaitlistEntry(prev => ({ ...prev, customer_email: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                placeholder="customer@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Type *
              </label>
              <select
                value={newWaitlistEntry.service_type}
                onChange={(e) => setNewWaitlistEntry(prev => ({ ...prev, service_type: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              >
                <option value="">Select service...</option>
                {serviceTypes.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date
              </label>
              <input
                type="date"
                value={newWaitlistEntry.preferred_date}
                onChange={(e) => setNewWaitlistEntry(prev => ({ ...prev, preferred_date: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Time
              </label>
              <input
                type="time"
                value={newWaitlistEntry.preferred_time}
                onChange={(e) => setNewWaitlistEntry(prev => ({ ...prev, preferred_time: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={newWaitlistEntry.priority}
                onChange={(e) => setNewWaitlistEntry(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              >
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={newWaitlistEntry.notes}
                onChange={(e) => setNewWaitlistEntry(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                placeholder="Special requests or notes..."
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              onClick={addToWaitlist}
              disabled={!newWaitlistEntry.customer_name || !newWaitlistEntry.customer_phone || !newWaitlistEntry.service_type}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Waitlist
            </button>
          </div>
        </div>
      )}

      {/* Waitlist Entries */}
      <div className="space-y-4">
        {sortedWaitlist.map((entry) => (
          <div key={entry.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full border-2 ${getPriorityColor(entry.priority)}`}>
                  {getPriorityIcon(entry.priority)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    {entry.customer_name}
                    {entry.priority === 'urgent' && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        URGENT
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">{entry.service_type}</p>
                  
                  {(entry.preferred_date || entry.preferred_time) && (
                    <p className="text-xs text-gray-500">
                      Prefers: {entry.preferred_date} {entry.preferred_time}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(entry.status)}`}>
                  {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                {entry.customer_phone}
              </div>
              
              {entry.customer_email && (
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {entry.customer_email}
                </div>
              )}
              
              <div className="text-sm text-gray-600">
                Added: {new Date(entry.created_at).toLocaleDateString()}
              </div>
            </div>
            
            {entry.notes && (
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">
                  <strong>Notes:</strong> {entry.notes}
                </p>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                {entry.notified_at && (
                  <span>Notified: {new Date(entry.notified_at).toLocaleDateString()}</span>
                )}
                {entry.contacted_at && (
                  <span>Contacted: {new Date(entry.contacted_at).toLocaleDateString()}</span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {entry.status === 'waiting' && (
                  <>
                    <button
                      onClick={() => updateWaitlistStatus(entry.id, 'notified')}
                      className="text-sm text-indigo-600 hover:text-indigo-800 border border-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded-md"
                    >
                      Notify Customer
                    </button>
                    <button
                      onClick={() => updateWaitlistStatus(entry.id, 'contacted')}
                      className="text-sm text-green-600 hover:text-green-800 border border-green-600 hover:bg-green-50 px-3 py-1 rounded-md"
                    >
                      Mark Contacted
                    </button>
                  </>
                )}
                
                {entry.status === 'contacted' && (
                  <button
                    onClick={() => updateWaitlistStatus(entry.id, 'booked')}
                    className="text-sm text-blue-600 hover:text-blue-800 border border-blue-600 hover:bg-blue-50 px-3 py-1 rounded-md"
                  >
                    Book Appointment
                  </button>
                )}
                
                {entry.status !== 'cancelled' && entry.status !== 'booked' && (
                  <button
                    onClick={() => updateWaitlistStatus(entry.id, 'cancelled')}
                    className="text-sm text-red-600 hover:text-red-800 border border-red-600 hover:bg-red-50 px-3 py-1 rounded-md"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {waitlist.length === 0 && (
          <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No customers on the waitlist</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 text-indigo-600 hover:text-indigo-800"
            >
              Add your first customer to the waitlist
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitlistSection;