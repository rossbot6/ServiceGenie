import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Users, Calendar, Clock, Star, Plus, X, Edit3, RefreshCw, BarChart3 } from 'lucide-react';

const DashboardWidgets = () => {
  const [widgets, setWidgets] = useState([
    { id: 'revenue', type: 'metric', title: 'Today\'s Revenue', value: '$2,450', change: '+12%', icon: DollarSign, color: 'green' },
    { id: 'appointments', type: 'metric', title: 'Total Appointments', value: '24', change: '+8%', icon: Calendar, color: 'blue' },
    { id: 'customers', type: 'metric', title: 'New Customers', value: '3', change: '-5%', icon: Users, color: 'purple' },
    { id: 'rating', type: 'metric', title: 'Average Rating', value: '4.8', change: '+0.2', icon: Star, color: 'yellow' },
    { id: 'performance', type: 'chart', title: 'Weekly Performance', data: [180, 200, 190, 220, 245, 230, 250], color: 'indigo' },
    { id: 'schedule', type: 'list', title: 'Today\'s Schedule', items: [
      { time: '09:00 AM', name: 'Emma Wilson', service: 'Full Balayage', status: 'confirmed' },
      { time: '11:00 AM', name: 'James Brown', service: 'Men\'s Cut', status: 'pending' },
      { time: '02:00 PM', name: 'Sofia Garcia', service: 'Color Touch-up', status: 'confirmed' }
    ], color: 'gray' }
  ]);

  const [availableWidgets] = useState([
    { id: 'revenue', name: 'Revenue Metric', description: 'Display daily/weekly revenue' },
    { id: 'appointments', name: 'Appointments', description: 'Show appointment counts' },
    { id: 'customers', name: 'Customer Metrics', description: 'New and returning customers' },
    { id: 'rating', name: 'Average Rating', description: 'Customer satisfaction scores' },
    { id: 'performance', name: 'Performance Chart', description: 'Weekly performance trends' },
    { id: 'schedule', name: 'Schedule List', description: 'Today\'s appointments' },
    { id: 'upcoming', name: 'Upcoming Appointments', description: 'Next scheduled appointments' },
    { id: 'staff-status', name: 'Staff Status', description: 'Current staff availability' }
  ]);

  const [showAddWidget, setShowAddWidget] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const getColorClasses = (color) => {
    const colorMap = {
      green: 'bg-green-100 text-green-800 border-green-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200', 
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colorMap[color] || colorMap.gray;
  };

  const getIconColorClasses = (color) => {
    const colorMap = {
      green: 'text-green-600',
      blue: 'text-blue-600', 
      purple: 'text-purple-600',
      yellow: 'text-yellow-600',
      indigo: 'text-indigo-600',
      gray: 'text-gray-600'
    };
    return colorMap[color] || colorMap.gray;
  };

  const addWidget = (widgetType) => {
    const widgetTemplate = availableWidgets.find(w => w.id === widgetType);
    if (widgetTemplate) {
      const newWidget = {
        ...widgetTemplate,
        type: widgetType.includes('chart') ? 'chart' : 'metric',
        title: widgetTemplate.name,
        value: widgetType === 'upcoming' ? '5 upcoming' : widgetType === 'staff-status' ? '8/10 available' : '0',
        icon: getIconForWidget(widgetType),
        color: getRandomColor()
      };
      setWidgets(prev => [...prev, newWidget]);
    }
    setShowAddWidget(false);
  };

  const removeWidget = (widgetId) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId));
  };

  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
    // Simulate data refresh
    setWidgets(prev => prev.map(widget => {
      if (widget.type === 'metric') {
        const newValue = generateRandomMetric(widget.id);
        return { ...widget, value: newValue };
      }
      return widget;
    }));
  };

  const getIconForWidget = (widgetType) => {
    const iconMap = {
      revenue: DollarSign,
      appointments: Calendar,
      customers: Users,
      rating: Star,
      performance: BarChart3,
      schedule: Clock,
      upcoming: Calendar,
      'staff-status': Clock
    };
    return iconMap[widgetType] || BarChart3;
  };

  const getRandomColor = () => {
    const colors = ['green', 'blue', 'purple', 'yellow', 'indigo', 'gray'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const generateRandomMetric = (widgetType) => {
    switch (widgetType) {
      case 'revenue': return `$${Math.floor(Math.random() * 3000 + 1000)}`;
      case 'appointments': return `${Math.floor(Math.random() * 20 + 15)}`;
      case 'customers': return `${Math.floor(Math.random() * 8 + 2)}`;
      case 'rating': return (4 + Math.random() * 0.8).toFixed(1);
      default: return '0';
    }
  };

  const renderMetricWidget = (widget) => {
    const Icon = widget.icon;
    return (
      <div className={`p-6 rounded-lg border-2 ${getColorClasses(widget.color)}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-70">{widget.title}</p>
            <p className="text-2xl font-bold">{widget.value}</p>
            <p className="text-xs opacity-60">{widget.change}</p>
          </div>
          <div className={`p-3 rounded-full bg-white/50`}>
            <Icon size={24} className={getIconColorClasses(widget.color)} />
          </div>
        </div>
      </div>
    );
  };

  const renderChartWidget = (widget) => {
    return (
      <div className={`p-6 rounded-lg border-2 ${getColorClasses(widget.color)}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium opacity-70">{widget.title}</h3>
          <BarChart3 size={16} className={getIconColorClasses(widget.color)} />
        </div>
        <div className="h-32 flex items-end justify-between space-x-1">
          {widget.data.map((value, index) => (
            <div
              key={index}
              className={`flex-1 rounded-t ${getIconColorClasses(widget.color).replace('text-', 'bg-').replace('-600', '-400')} opacity-60`}
              style={{ height: `${(value / Math.max(...widget.data)) * 100}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs mt-2 opacity-60">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>
    );
  };

  const renderListWidget = (widget) => {
    return (
      <div className={`p-6 rounded-lg border-2 ${getColorClasses(widget.color)}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium opacity-70">{widget.title}</h3>
          <Clock size={16} className={getIconColorClasses(widget.color)} />
        </div>
        <div className="space-y-3">
          {widget.items.slice(0, 5).map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-medium opacity-60">{item.time}</span>
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs opacity-70">{item.service}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                item.status === 'confirmed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderWidget = (widget) => {
    return (
      <div key={widget.id} className="relative">
        <div className="absolute top-2 right-2 z-10 flex space-x-2">
          <button
            onClick={() => removeWidget(widget.id)}
            className="p-1 rounded-lg bg-white/80 hover:bg-white text-gray-600 hover:text-red-600 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
        {widget.type === 'metric' && renderMetricWidget(widget)}
        {widget.type === 'chart' && renderChartWidget(widget)}
        {widget.type === 'list' && renderListWidget(widget)}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Dashboard Widgets</h3>
          <p className="text-sm text-gray-600">Customizable metrics and insights</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={refreshData}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border hover:bg-gray-50"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
          <button
            onClick={() => setShowAddWidget(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={14} />
            Add Widget
          </button>
        </div>
      </div>

      {/* Add Widget Modal */}
      {showAddWidget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Widget</h3>
              <button
                onClick={() => setShowAddWidget(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              {availableWidgets.map((widget) => (
                <button
                  key={widget.id}
                  onClick={() => addWidget(widget.id)}
                  className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h4 className="font-medium">{widget.name}</h4>
                  <p className="text-sm text-gray-600">{widget.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets.map(renderWidget)}
      </div>

      {/* Add empty state if no widgets */}
      {widgets.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No widgets configured</h3>
          <p className="text-gray-600 mb-4">Add widgets to display your key metrics and insights</p>
          <button
            onClick={() => setShowAddWidget(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add First Widget
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardWidgets;