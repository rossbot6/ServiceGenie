import { useState, useEffect } from 'react';
import { 
  MessageSquare, Mail, Phone, Send, 
  Users, Filter, Search, Calendar,
  Clock, CheckCircle, XCircle, AlertCircle,
  Plus, Edit, Trash2, Eye, BarChart3,
  Target, Settings, Zap
} from 'lucide-react';

export default function Communications() {
  const [activeTab, setActiveTab] = useState('overview');
  const [communications, setCommunications] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    type: 'all', // 'sms', 'email', 'both', 'all'
    status: 'all', // 'pending', 'sent', 'delivered', 'failed', 'bounced', 'all'
    category: 'all', // 'confirmation', 'reminder', 'cancellation', 'marketing', 'follow_up', 'birthday', 'general', 'all'
    dateRange: '7days' // 'today', '7days', '30days', 'all'
  });
  const [showSendModal, setShowSendModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'templates', label: 'Templates', icon: Mail },
    { id: 'campaigns', label: 'Campaigns', icon: Target },
  ];

  // Sample data for communications
  const mockCommunications = [
    {
      id: '1',
      customer_name: 'John Smith',
      customer_email: 'john@email.com',
      customer_phone: '(555) 123-4567',
      type: 'email',
      category: 'confirmation',
      subject: 'Appointment Confirmed',
      content: 'Your appointment has been confirmed for tomorrow at 2:00 PM',
      status: 'delivered',
      sent_at: '2026-02-23T10:30:00Z',
      delivered_at: '2026-02-23T10:30:05Z',
      template_id: 'email_confirmation',
      metadata: { appointment_id: 'apt-123' }
    },
    {
      id: '2',
      customer_name: 'Sarah Johnson',
      customer_email: 'sarah@email.com',
      customer_phone: '(555) 987-6543',
      type: 'sms',
      category: 'reminder',
      subject: 'Appointment Reminder',
      content: 'Hi Sarah! Reminder: You have an appointment today at 11:00 AM. Reply CANCEL to cancel.',
      status: 'sent',
      sent_at: '2026-02-23T09:00:00Z',
      template_id: 'reminder',
      metadata: { appointment_id: 'apt-124' }
    },
    {
      id: '3',
      customer_name: 'Michael Davis',
      customer_email: 'michael@email.com',
      customer_phone: '(555) 555-0123',
      type: 'both',
      category: 'marketing',
      subject: 'Spring Color Event - 20% Off!',
      content: 'Get 20% off all color services this spring! Book by March 31st.',
      status: 'failed',
      sent_at: '2026-02-23T08:00:00Z',
      error_message: 'Invalid email address',
      metadata: { campaign_id: 'spring-color' }
    },
    {
      id: '4',
      customer_name: 'Emily Rodriguez',
      customer_email: 'emily@email.com',
      customer_phone: '(555) 999-8888',
      type: 'email',
      category: 'follow_up',
      subject: 'How was your service?',
      content: 'Thank you for visiting us! We would love to hear about your experience.',
      status: 'delivered',
      sent_at: '2026-02-22T16:00:00Z',
      delivered_at: '2026-02-22T16:00:03Z',
      metadata: { appointment_id: 'apt-125' }
    }
  ];

  // Sample templates
  const mockTemplates = [
    {
      id: 'confirmation',
      name: 'SMS Confirmation',
      type: 'sms',
      category: 'confirmation',
      content: 'Hi {name}! Your appointment at {location} is confirmed for {date} at {time}. Reply HELP for assistance.',
      is_active: true,
      usage_count: 145
    },
    {
      id: 'email_confirmation',
      name: 'Email Confirmation',
      type: 'email',
      category: 'confirmation',
      content: 'Dear {name},\n\nYour appointment has been confirmed:\n\n📅 Date: {date}\n⏰ Time: {time}\n📍 Location: {location}\n💇 Service: {service}\n\nThank you for choosing ServiceGenie!',
      is_active: true,
      usage_count: 98
    },
    {
      id: 'reminder',
      name: 'SMS Reminder',
      type: 'sms',
      category: 'reminder',
      content: 'Reminder: You have an appointment at {location} tomorrow at {time}. Reply CANCEL to cancel.',
      is_active: true,
      usage_count: 234
    },
    {
      id: 'marketing',
      name: 'Marketing Email',
      type: 'email',
      category: 'marketing',
      content: 'Dear {name},\n\n{content}\n\n---\n\nTo manage your communication preferences, visit your account settings or reply STOP to opt out.',
      is_active: true,
      usage_count: 56
    }
  ];

  // Sample campaigns
  const mockCampaigns = [
    {
      id: '1',
      name: 'Spring Color Event',
      type: 'email',
      status: 'sent',
      content: 'Get 20% off all color services this spring! Book by March 31st.',
      target_segment: 'all_clients',
      recipient_count: 250,
      sent_at: '2026-02-20T10:00:00Z',
      open_rate: 0.34,
      click_rate: 0.12
    },
    {
      id: '2',
      name: 'Loyalty Rewards Reminder',
      type: 'email',
      status: 'scheduled',
      content: 'Your points are expiring soon! Redeem them for discounts on your next visit.',
      target_segment: 'tier_silver',
      recipient_count: 120,
      scheduled_for: '2026-02-25T09:00:00Z',
      open_rate: null,
      click_rate: null
    }
  ];

  useEffect(() => {
    // In a real app, this would fetch from API
    setCommunications(mockCommunications);
    setTemplates(mockTemplates);
    setCampaigns(mockCampaigns);
    
    // Load customers for sending messages
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  const sendMessage = async ({ customerId, type, templateId, customContent }) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/communications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: customerId,
          type,
          template_id: templateId,
          content: customContent
        })
      });
      
      if (response.ok) {
        const newMessage = await response.json();
        setCommunications(prev => [newMessage, ...prev]);
        setShowSendModal(false);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCommunications = () => {
    return communications.filter(comm => {
      if (activeFilters.type !== 'all' && comm.type !== activeFilters.type) return false;
      if (activeFilters.status !== 'all' && comm.status !== activeFilters.status) return false;
      if (activeFilters.category !== 'all' && comm.category !== activeFilters.category) return false;
      return true;
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'sent': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'bounced': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'sms': return <Phone className="w-4 h-4 text-green-600" />;
      case 'email': return <Mail className="w-4 h-4 text-blue-600" />;
      case 'both': return <MessageSquare className="w-4 h-4 text-purple-600" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'confirmation': return 'bg-green-100 text-green-800';
      case 'reminder': return 'bg-blue-100 text-blue-800';
      case 'cancellation': return 'bg-red-100 text-red-800';
      case 'marketing': return 'bg-purple-100 text-purple-800';
      case 'follow_up': return 'bg-amber-100 text-amber-800';
      case 'birthday': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Overview Tab
  if (activeTab === 'overview') {
    const stats = [
      {
        label: 'Total Sent',
        value: communications.length,
        change: '+12%',
        icon: MessageSquare,
        color: 'text-blue-600',
        bg: 'bg-blue-50'
      },
      {
        label: 'Delivered',
        value: communications.filter(c => c.status === 'delivered').length,
        change: '+8%',
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-50'
      },
      {
        label: 'Failed',
        value: communications.filter(c => c.status === 'failed').length,
        change: '-2%',
        icon: XCircle,
        color: 'text-red-600',
        bg: 'bg-red-50'
      },
      {
        label: 'Open Rate',
        value: '78%',
        change: '+5%',
        icon: Eye,
        color: 'text-purple-600',
        bg: 'bg-purple-50'
      }
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Communications Overview</h2>
            <p className="text-sm text-gray-500">Monitor your customer messaging performance</p>
          </div>
          <button
            onClick={() => setShowSendModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Send Message
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.change} this week</p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Messages */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Messages</h3>
            <button
              onClick={() => setActiveTab('messages')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {communications.slice(0, 5).map(message => (
              <div key={message.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(message.status)}
                  <div>
                    <p className="font-medium text-gray-900">{message.customer_name}</p>
                    <p className="text-sm text-gray-500">{message.subject || message.content.substring(0, 50) + '...'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getTypeIcon(message.type)}
                  <span className="text-xs text-gray-400">{new Date(message.sent_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowTemplateModal(true)}
            className="card hover:bg-gray-50 cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Manage Templates</p>
                <p className="text-sm text-gray-500">{templates.length} templates available</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowCampaignModal(true)}
            className="card hover:bg-gray-50 cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Create Campaign</p>
                <p className="text-sm text-gray-500">{campaigns.filter(c => c.status === 'draft').length} draft campaigns</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowSendModal(true)}
            className="card hover:bg-gray-50 cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Send className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Send Individual</p>
                <p className="text-sm text-gray-500">Reach out to specific customers</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Messages Tab
  if (activeTab === 'messages') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Message History</h2>
            <p className="text-sm text-gray-500">Track all sent communications</p>
          </div>
          <button
            onClick={() => setShowSendModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Send Message
          </button>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Filters:</span>
            </div>
            
            <select
              value={activeFilters.type}
              onChange={(e) => setActiveFilters(prev => ({ ...prev, type: e.target.value }))}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="all">All Types</option>
              <option value="sms">SMS</option>
              <option value="email">Email</option>
              <option value="both">Both</option>
            </select>

            <select
              value={activeFilters.status}
              onChange={(e) => setActiveFilters(prev => ({ ...prev, status: e.target.value }))}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="sent">Sent</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
              <option value="bounced">Bounced</option>
            </select>

            <select
              value={activeFilters.category}
              onChange={(e) => setActiveFilters(prev => ({ ...prev, category: e.target.value }))}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="all">All Categories</option>
              <option value="confirmation">Confirmation</option>
              <option value="reminder">Reminder</option>
              <option value="cancellation">Cancellation</option>
              <option value="marketing">Marketing</option>
              <option value="follow_up">Follow-up</option>
              <option value="birthday">Birthday</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>

        {/* Messages List */}
        <div className="space-y-3">
          {getFilteredCommunications().map(message => (
            <div key={message.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getTypeIcon(message.type)}
                    <span className="font-medium text-gray-900">{message.customer_name}</span>
                    <span className={`badge ${getCategoryColor(message.category)}`}>
                      {message.category.replace('_', ' ')}
                    </span>
                    {getStatusIcon(message.status)}
                    <span className="text-sm text-gray-500">
                      {new Date(message.sent_at).toLocaleString()}
                    </span>
                  </div>
                  
                  {message.subject && (
                    <p className="font-medium text-gray-800 mb-1">{message.subject}</p>
                  )}
                  
                  <p className="text-gray-600 text-sm line-clamp-2">{message.content}</p>
                  
                  {message.error_message && (
                    <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {message.error_message}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedMessage(message)}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded" title="Resend">
                    <Send className="w-4 h-4 text-blue-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded" title="Delete">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Templates Tab
  if (activeTab === 'templates') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Message Templates</h2>
            <p className="text-sm text-gray-500">Manage reusable message templates</p>
          </div>
          <button
            onClick={() => setShowTemplateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Template
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map(template => (
            <div key={template.id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getTypeIcon(template.type)}
                  <h3 className="font-medium text-gray-900">{template.name}</h3>
                  <span className={`badge ${template.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {template.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Edit className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">{template.content}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Used {template.usage_count} times</span>
                <div className="flex items-center gap-1">
                  <span className="capitalize">{template.category.replace('_', ' ')}</span>
                  <span>•</span>
                  <span className="uppercase">{template.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Campaigns Tab
  if (activeTab === 'campaigns') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Marketing Campaigns</h2>
            <p className="text-sm text-gray-500">Create and manage targeted campaigns</p>
          </div>
          <button
            onClick={() => setShowCampaignModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
        </div>

        <div className="space-y-4">
          {campaigns.map(campaign => (
            <div key={campaign.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                    <span className={`badge ${
                      campaign.status === 'sent' ? 'bg-green-100 text-green-700' :
                      campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {campaign.status}
                    </span>
                    <span className={`badge ${campaign.type === 'email' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {campaign.type.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{campaign.content}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>{campaign.recipient_count} recipients</span>
                    <span>Target: {campaign.target_segment.replace('_', ' ')}</span>
                    {campaign.sent_at && (
                      <span>Sent: {new Date(campaign.sent_at).toLocaleString()}</span>
                    )}
                    {campaign.open_rate && (
                      <span>Open Rate: {(campaign.open_rate * 100).toFixed(1)}%</span>
                    )}
                    {campaign.click_rate && (
                      <span>Click Rate: {(campaign.click_rate * 100).toFixed(1)}%</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {campaign.status === 'draft' && (
                    <>
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                        Launch
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                    </>
                  )}
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Settings className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Communications</h1>
        <button 
          onClick={() => setShowSendModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Send Message
        </button>
      </div>

      <div className="flex space-x-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-lg flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-lg shadow-sm border">
        {/* Content based on active tab is rendered above */}
      </div>
    </div>
  );
}