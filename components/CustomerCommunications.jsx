import React, { useState, useEffect } from 'react';
import { Send, Phone, Mail, MessageSquare, Clock, User, MessageCircle } from 'lucide-react';

const CustomerCommunications = ({ customerId, customerData }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({
    type: 'email', // email, sms
    subject: '',
    message: '',
    scheduledDate: '',
    priority: 'normal' // normal, high, urgent
  });
  
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  
  // Mock message history (in real implementation, would come from API)
  const mockMessages = [
    {
      id: 1,
      type: 'email',
      subject: 'Appointment Reminder',
      message: 'This is a reminder about your appointment tomorrow at 2:00 PM',
      timestamp: '2026-02-25 14:30:00',
      status: 'sent',
      priority: 'normal'
    },
    {
      id: 2,
      type: 'sms',
      message: 'Your appointment has been confirmed for 2:00 PM tomorrow',
      timestamp: '2026-02-25 09:15:00',
      status: 'delivered',
      priority: 'normal'
    },
    {
      id: 3,
      type: 'email',
      subject: 'Special Offer',
      message: 'Get 20% off your next visit with our new color service!',
      timestamp: '2026-02-24 16:45:00',
      status: 'delivered',
      priority: 'low'
    }
  ];

  // Quick message templates
  const messageTemplates = [
    {
      id: 'reminder',
      name: 'Appointment Reminder',
      type: 'email',
      subject: 'Upcoming Appointment Reminder',
      message: 'Hello {customer_name}, this is a friendly reminder about your appointment for {service_name} on {date} at {time}. Please reply if you have any questions.'
    },
    {
      id: 'confirmation',
      name: 'Booking Confirmation',
      type: 'email', 
      subject: 'Appointment Confirmed',
      message: 'Your appointment has been confirmed for {date} at {time} for {service_name}. We look forward to seeing you!'
    },
    {
      id: 'followup',
      name: 'Follow-up',
      type: 'email',
      subject: 'How was your visit?',
      message: 'Hi {customer_name}, thank you for visiting us! We hope you love your {service_name}. Please take a moment to rate your experience with us.'
    },
    {
      id: 'birthday',
      name: 'Birthday Message',
      type: 'email',
      subject: 'Happy Birthday!',
      message: 'Happy Birthday {customer_name}! 🎉 Come celebrate with us and enjoy a special birthday discount on any service.'
    }
  ];

  const loadMessages = async () => {
    try {
      setLoading(true);
      
      // In real implementation, would fetch from API:
      // const response = await fetch(`/api/customer-messages/${customerId}`);
      // const data = await response.json();
      
      // For demo, use mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessages(mockMessages);
      
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    try {
      setSending(true);
      setError(null);
      
      // Validate message
      if (!newMessage.message.trim()) {
        setError('Message content is required');
        return;
      }
      
      // Add template variables if present
      let processedMessage = newMessage.message;
      if (customerData) {
        processedMessage = processedMessage
          .replace(/{customer_name}/g, customerData.name || 'valued customer')
          .replace(/{service_name}/g, 'your service')
          .replace(/{date}/g, 'your appointment date')
          .replace(/{time}/g, 'your appointment time');
      }
      
      const messageData = {
        customerId,
        ...newMessage,
        message: processedMessage,
        timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
        status: 'sent'
      };
      
      // In real implementation, would POST to API:
      // const response = await fetch('/api/send-message', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(messageData)
      // });
      
      // For demo, add to local state
      const newMessageObj = {
        id: Date.now(),
        ...messageData
      };
      setMessages(prev => [newMessageObj, ...prev]);
      
      // Reset form
      setNewMessage({
        type: 'email',
        subject: '',
        message: '',
        scheduledDate: '',
        priority: 'normal'
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const applyTemplate = (template) => {
    setNewMessage(prev => ({
      ...prev,
      type: template.type,
      subject: template.subject || prev.subject,
      message: template.message
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <Send className="h-3 w-3 text-blue-500" />;
      case 'delivered':
        return <MessageCircle className="h-3 w-3 text-green-500" />;
      case 'failed':
        return <Phone className="h-3 w-3 text-red-500" />;
      default:
        return <MessageSquare className="h-3 w-3 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    loadMessages();
  }, [customerId]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Message Templates */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <MessageCircle className="h-5 w-5 mr-2 text-indigo-500" />
          Customer Communications
        </h2>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Templates</h3>
          <div className="flex flex-wrap gap-2">
            {messageTemplates.map(template => (
              <button
                key={template.id}
                onClick={() => applyTemplate(template)}
                className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {template.type === 'email' ? <Mail className="h-3 w-3 mr-1" /> : <MessageSquare className="h-3 w-3 mr-1" />}
                {template.name}
              </button>
            ))}
          </div>
        </div>

        {/* New Message Form */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Send New Message</h3>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Type
                </label>
                <select
                  value={newMessage.type}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={newMessage.priority}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule For
                </label>
                <input
                  type="datetime-local"
                  value={newMessage.scheduledDate}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to send immediately</p>
              </div>
            </div>
            
            {newMessage.type === 'email' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  placeholder="Email subject"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={newMessage.message}
                onChange={(e) => setNewMessage(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                placeholder="Enter your message here. Use {customer_name}, {service_name}, {date}, {time} for template variables."
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setNewMessage({
                  type: 'email',
                  subject: '',
                  message: '',
                  scheduledDate: '',
                  priority: 'normal'
                })}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear
              </button>
              <button
                onClick={sendMessage}
                disabled={sending || !newMessage.message.trim()}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4 mr-2" />
                {sending ? 'Sending...' : `Send ${newMessage.type === 'email' ? 'Email' : 'SMS'}`}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Message History */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-gray-500" />
          Message History
        </h3>
        
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`p-1 rounded-full ${
                    message.type === 'email' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {message.type === 'email' ? 
                      <Mail className="h-3 w-3 text-blue-600" /> :
                      <MessageSquare className="h-3 w-3 text-green-600" />
                    }
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {message.type.toUpperCase()}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                      {message.priority}
                    </span>
                    <div className="flex items-center">
                      {getStatusIcon(message.status)}
                      <span className="text-xs text-gray-500 ml-1">{message.status}</span>
                    </div>
                  </div>
                </div>
                
                <span className="text-xs text-gray-500">
                  {formatDate(message.timestamp)}
                </span>
              </div>
              
              {message.subject && (
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  {message.subject}
                </h4>
              )}
              
              <p className="text-sm text-gray-700 mb-2">
                {message.message}
              </p>
              
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center text-xs text-gray-500">
                  <User className="h-3 w-3 mr-1" />
                  Sent by {customerData?.name || 'System'} • {customerData?.email || customerData?.phone || 'Unknown contact'}
                </div>
                
                <button className="text-xs text-indigo-600 hover:text-indigo-800 focus:outline-none">
                  Resend
                </button>
              </div>
            </div>
          ))}
          
          {messages.length === 0 && (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No messages sent yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerCommunications;