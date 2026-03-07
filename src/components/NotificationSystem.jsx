import React, { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, Send, Clock, Users, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const NotificationSystem = () => {
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Appointment Reminder',
      type: 'reminder',
      channel: 'both',
      message: 'Hi {customer_name}, this is a reminder about your appointment with {provider_name} on {appointment_time}. Reply STOP to opt out.',
      active: true
    },
    {
      id: 2,
      name: 'Confirmation',
      type: 'confirmation',
      channel: 'email',
      message: 'Hi {customer_name}, your appointment with {provider_name} on {appointment_time} has been confirmed. Looking forward to seeing you!',
      active: true
    },
    {
      id: 3,
      name: 'Follow-up',
      type: 'followup',
      channel: 'sms',
      message: 'Hi {customer_name}, thank you for visiting {provider_name}! We\'d love to hear your feedback about your experience.',
      active: true
    }
  ]);

  const [schedule, setSchedule] = useState({
    reminder24h: true,
    reminder2h: true,
    confirmation: true,
    followup24h: true,
    customTime: 1
  });

  const [analytics, setAnalytics] = useState({
    sent: 45,
    delivered: 43,
    failed: 2,
    responseRate: 23
  });

  const handleTemplateUpdate = (id, field, value) => {
    setTemplates(prev => prev.map(template => 
      template.id === id ? { ...template, [field]: value } : template
    ));
  };

  const handleScheduleUpdate = (field, value) => {
    setSchedule(prev => ({ ...prev, [field]: value }));
  };

  const saveTemplates = async () => {
    try {
      const response = await fetch('/api/notification-templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templates)
      });
      
      if (response.ok) {
        setAnalytics(prev => ({ ...prev, sent: prev.sent + (templates.length * 2) }));
        alert('Templates saved successfully!');
      }
    } catch (error) {
      console.error('Error saving templates:', error);
      alert('Error saving templates');
    }
  };

  const sendTestNotification = async (templateId, channel) => {
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          channel,
          testMode: true,
          customerData: {
            name: 'Test Customer',
            phone: '+1234567890',
            email: 'test@example.com'
          }
        })
      });

      if (response.ok) {
        alert(`Test notification sent via ${channel}!`);
      } else {
        alert('Failed to send test notification');
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      alert('Failed to send test notification');
    }
  };

  const TemplateVariables = ({ template }) => (
    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
      <div className="text-sm font-medium text-gray-700 mb-2">Available variables:</div>
      <div className="flex flex-wrap gap-2">
        {['customer_name', 'provider_name', 'appointment_time', 'service_name', 'location_name', 'phone', 'email'].map(variable => (
          <code key={variable} className="px-2 py-1 bg-white rounded text-xs border">
            {`{${variable}}`}
          </code>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Notification System</h3>
        <button
          onClick={saveTemplates}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Send size={16} />
          Save & Send Test
        </button>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Send className="text-blue-600" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold">{analytics.sent}</div>
              <div className="text-sm text-gray-600">Messages Sent</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold">{analytics.delivered}</div>
              <div className="text-sm text-gray-600">Delivered</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="text-red-600" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold">{analytics.failed}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="text-purple-600" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold">{analytics.responseRate}%</div>
              <div className="text-sm text-gray-600">Response Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Scheduling */}
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="text-md font-semibold mb-4">Automated Scheduling</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={schedule.reminder24h}
                onChange={e => handleScheduleUpdate('reminder24h', e.target.checked)}
                className="rounded"
              />
              <label className="text-sm">24-hour reminder</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={schedule.reminder2h}
                onChange={e => handleScheduleUpdate('reminder2h', e.target.checked)}
                className="rounded"
              />
              <label className="text-sm">2-hour reminder</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={schedule.confirmation}
                onChange={e => handleScheduleUpdate('confirmation', e.target.checked)}
                className="rounded"
              />
              <label className="text-sm">Booking confirmation</label>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={schedule.followup24h}
                onChange={e => handleScheduleUpdate('followup24h', e.target.checked)}
                className="rounded"
              />
              <label className="text-sm">24-hour follow-up</label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Custom reminder time</label>
              <input
                type="number"
                value={schedule.customTime}
                onChange={e => handleScheduleUpdate('customTime', parseInt(e.target.value))}
                className="w-20 px-3 py-2 border rounded-lg"
                min="1"
                max="168"
              />
              <span className="text-sm text-gray-600 ml-2">hours before</span>
            </div>
          </div>
        </div>
      </div>

      {/* Message Templates */}
      <div className="space-y-6">
        <h4 className="text-md font-semibold">Message Templates</h4>
        
        {templates.map(template => (
          <div key={template.id} className="bg-white p-6 rounded-lg border">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={template.name}
                  onChange={e => handleTemplateUpdate(template.id, 'name', e.target.value)}
                  className="text-lg font-medium border-none p-0 focus:ring-0"
                />
                <select
                  value={template.type}
                  onChange={e => handleTemplateUpdate(template.id, 'type', e.target.value)}
                  className="px-3 py-1 text-sm border rounded"
                >
                  <option value="reminder">Reminder</option>
                  <option value="confirmation">Confirmation</option>
                  <option value="followup">Follow-up</option>
                  <option value="birthday">Birthday</option>
                </select>
                <select
                  value={template.channel}
                  onChange={e => handleTemplateUpdate(template.id, 'channel', e.target.value)}
                  className="px-3 py-1 text-sm border rounded"
                >
                  <option value="sms">SMS</option>
                  <option value="email">Email</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={template.active}
                    onChange={e => handleTemplateUpdate(template.id, 'active', e.target.checked)}
                    className="rounded"
                  />
                  <label className="text-sm text-gray-600">Active</label>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => sendTestNotification(template.id, 'sms')}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Test SMS
                  </button>
                  <button
                    onClick={() => sendTestNotification(template.id, 'email')}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Test Email
                  </button>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <textarea
                value={template.message}
                onChange={e => handleTemplateUpdate(template.id, 'message', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                rows="3"
                placeholder="Enter your message template..."
              />
              <TemplateVariables template={template} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSystem;