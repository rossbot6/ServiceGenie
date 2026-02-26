import React, { useState, useEffect } from 'react';
import { Bell, BellRing, MessageSquare, Mail, Phone, Clock, Send, Eye, Check, X } from 'lucide-react';

const NotificationSystem = ({ customerId, providerId, locationId, className = "" }) => {
  const [notifications, setNotifications] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [showCompose, setShowCompose] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [composeData, setComposeData] = useState({
    type: 'appointment_reminder',
    method: 'email',
    content: '',
    recipients: '',
    schedule_time: ''
  });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Load notifications and templates
  useEffect(() => {
    loadNotifications();
    loadTemplates();
  }, [customerId, providerId]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (customerId) query.append('customer_id', customerId);
      if (providerId) query.append('provider_id', providerId);
      if (locationId) query.append('location_id', locationId);

      const response = await fetch(`http://localhost:3001/api/notifications?${query}`);
      const data = await response.json();
      
      if (response.ok) {
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/notification-templates');
      const data = await response.json();
      
      if (response.ok) {
        setTemplates(data);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const defaultTemplates = [
    {
      id: 'appointment_reminder_24h',
      name: '24-Hour Reminder',
      type: 'appointment_reminder',
      template: "Hi {customer_name}, this is a reminder about your appointment with {provider_name} tomorrow at {appointment_time} at {location_name}. Please arrive 10 minutes early. Reply CONFIRM to confirm.",
      variables: ['customer_name', 'provider_name', 'appointment_time', 'location_name'],
      method: 'sms'
    },
    {
      id: 'appointment_reminder_2h',
      name: '2-Hour Reminder',
      type: 'appointment_reminder',
      template: "Your appointment with {provider_name} is in 2 hours at {location_name}. Address: {location_address}. See you soon!",
      variables: ['customer_name', 'provider_name', 'appointment_time', 'location_name', 'location_address'],
      method: 'sms'
    },
    {
      id: 'booking_confirmation',
      name: 'Booking Confirmation',
      type: 'booking_confirmation',
      template: "Thank you for booking with us! Your {service_name} appointment with {provider_name} is confirmed for {appointment_date} at {appointment_time}. Location: {location_name}. For changes, please call {location_phone}.",
      variables: ['customer_name', 'service_name', 'provider_name', 'appointment_date', 'appointment_time', 'location_name', 'location_phone'],
      method: 'email'
    },
    {
      id: 'appointment_cancellation',
      name: 'Appointment Cancellation',
      type: 'cancellation',
      template: "Your appointment with {provider_name} scheduled for {appointment_date} at {appointment_time} has been cancelled. New appointment: {new_appointment_time}. For questions call {location_phone}.",
      variables: ['customer_name', 'provider_name', 'appointment_date', 'appointment_time', 'new_appointment_time', 'location_phone'],
      method: 'sms'
    },
    {
      id: 'birthday_message',
      name: 'Birthday Message',
      type: 'birthday',
      template: "Happy Birthday {customer_name}! 🎂 Treat yourself to a beautiful new look. Book now and mention this message for 20% off any service with {provider_name}.",
      variables: ['customer_name', 'provider_name', 'location_name'],
      method: 'email'
    },
    {
      id: 'follow_up_48h',
      name: '48-Hour Follow-up',
      type: 'follow_up',
      template: "Hi {customer_name}, how did you love your {service_name} with {provider_name}? We'd love to hear about your experience! Please leave us a review: {review_link}",
      variables: ['customer_name', 'service_name', 'provider_name', 'review_link'],
      method: 'email'
    },
    {
      id: 'waitlist_notification',
      name: 'Waitlist Opportunity',
      type: 'waitlist',
      template: "Good news {customer_name}! A spot just opened up with {provider_name} for {service_name} on {requested_date}. Please respond YES within 15 minutes to book.",
      variables: ['customer_name', 'provider_name', 'service_name', 'requested_date'],
      method: 'sms'
    },
    {
      id: 'promotional_offer',
      name: 'Special Offer',
      type: 'promotional',
      template: "Exclusive offer for {customer_name}! Get {discount_percent}% off your next {service_category} service with {provider_name}. Book by {offer_expiry} using code SAVE{discount_percent}. {offer_link}",
      variables: ['customer_name', 'discount_percent', 'service_category', 'provider_name', 'offer_expiry', 'offer_link'],
      method: 'email'
    }
  ];

  const getIcon = (type, isUnread) => {
    const iconClass = isUnread ? 'text-blue-600' : 'text-gray-500';
    
    switch (type) {
      case 'appointment_reminder':
        return <Clock className={`h-5 w-5 ${iconClass}`} />;
      case 'booking_confirmation':
        return <Check className={`h-5 w-5 ${iconClass}`} />;
      case 'cancellation':
        return <X className={`h-5 w-5 ${iconClass}`} />;
      case 'follow_up':
        return <MessageSquare className={`h-5 w-5 ${iconClass}`} />;
      case 'birthday':
        return <Bell className={`h-5 w-5 ${iconClass}`} />;
      case 'promotional':
        return <BellRing className={`h-5 w-5 ${iconClass}`} />;
      default:
        return <Bell className={`h-5 w-5 ${iconClass}`} />;
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'sms':
        return <Phone className="h-4 w-4 text-green-600" />;
      case 'email':
        return <Mail className="h-4 w-4 text-blue-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setComposeData({
      ...composeData,
      type: template.type,
      method: template.method,
      content: template.template
    });
    setShowCompose(true);
  };

  const handleSendNotification = async () => {
    try {
      setSending(true);
      
      const response = await fetch('http://localhost:3001/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...composeData,
          customer_id: customerId,
          provider_id: providerId,
          location_id: locationId,
          variables: {
            customer_name: 'John Doe', // Would be loaded from customer data
            provider_name: 'Emma Wilson',
            location_name: 'Downtown Salon',
            appointment_time: '2:00 PM',
            location_phone: '(555) 100-0001',
            service_name: 'Full Balayage',
            location_address: '123 Main St, New York, NY 10001',
            appointment_date: 'February 26, 2026',
            requested_date: 'March 1, 2026',
            review_link: 'http://localhost:8081/review',
            offer_link: 'http://localhost:8081/book',
            offer_expiry: 'March 15, 2026',
            discount_percent: '20',
            service_category: 'color'
          }
        })
      });

      if (response.ok) {
        setShowCompose(false);
        setComposeData({
          type: 'appointment_reminder',
          method: 'email',
          content: '',
          recipients: '',
          schedule_time: ''
        });
        await loadNotifications();
        
        alert('Notification sent successfully! 🎉');
      } else {
        alert('Failed to send notification. Please try again.');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Error sending notification. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-indigo-500" />
              Notification Center
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Manage appointments, reminders, and customer communications
            </p>
          </div>
          <button
            onClick={() => setShowCompose(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </button>
        </div>
      </div>

      {/* Templates */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Message Templates</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {defaultTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-medium text-gray-900">{template.name}</h5>
                <div className="flex items-center space-x-1">
                  {getMethodIcon(template.method)}
                  <span className="text-xs text-gray-500 capitalize">{template.method}</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">
                {template.template.substring(0, 80)}...
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-900">Recent Notifications</h4>
          <span className="text-sm text-gray-500">{notifications.length} messages</span>
        </div>
        
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p>No notifications yet</p>
              <p className="text-sm">Use the templates above to send your first message</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`border rounded-lg p-4 ${
                  notification.is_read ? 'border-gray-200 bg-white' : 'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getIcon(notification.type, !notification.is_read)}
                    <div className="flex-1">
                      <h5 className="text-sm font-medium text-gray-900">
                        {notification.title || notification.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h5>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.content}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          {getMethodIcon(notification.method)}
                          <span className="text-xs text-gray-500">
                            Via {notification.method}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(notification.created_at).toLocaleString()}
                        </span>
                        {notification.status && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            notification.status === 'sent' ? 'bg-green-100 text-green-800' :
                            notification.status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {notification.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedTemplate ? `Edit Template: ${selectedTemplate.name}` : 'Send New Message'}
                </h3>
                <button
                  onClick={() => {
                    setShowCompose(false);
                    setSelectedTemplate(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Type
                  </label>
                  <select
                    value={composeData.type}
                    onChange={(e) => setComposeData({...composeData, type: e.target.value})}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  >
                    <option value="appointment_reminder">Appointment Reminder</option>
                    <option value="booking_confirmation">Booking Confirmation</option>
                    <option value="cancellation">Cancellation</option>
                    <option value="follow_up">Follow-up</option>
                    <option value="birthday">Birthday Message</option>
                    <option value="promotional">Promotional Offer</option>
                    <option value="waitlist">Waitlist Notification</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Method
                  </label>
                  <select
                    value={composeData.method}
                    onChange={(e) => setComposeData({...composeData, method: e.target.value})}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="both">Both Email & SMS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Content
                </label>
                <textarea
                  value={composeData.content}
                  onChange={(e) => setComposeData({...composeData, content: e.target.value})}
                  rows={6}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  placeholder="Enter your message here..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available variables: {selectedTemplate?.variables?.join(', ') || 'customer_name, provider_name, appointment_time, location_name, etc.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipients
                  </label>
                  <input
                    type="text"
                    value={composeData.recipients}
                    onChange={(e) => setComposeData({...composeData, recipients: e.target.value})}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    placeholder="customer@example.com, +1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schedule Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={composeData.schedule_time}
                    onChange={(e) => setComposeData({...composeData, schedule_time: e.target.value})}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCompose(false);
                  setSelectedTemplate(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSendNotification}
                disabled={sending || !composeData.content}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4 mr-2" />
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;