import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Calendar, DollarSign, Star, TrendingUp, Clock, Award } from 'lucide-react';

const ProviderPerformanceMetrics = ({ providerId, dateRange = 30 }) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(dateRange);

  // Mock performance data (in real implementation, this would come from the API)
  const mockMetrics = {
    overview: {
      total_appointments: 145,
      completed_appointments: 142,
      total_revenue: 15890,
      average_rating: 4.8,
      client_retention_rate: 85,
      utilization_rate: 92
    },
    performance_by_service: [
      { service: 'Full Balayage', appointments: 45, revenue: 8100, avg_duration: 180 },
      { service: 'Women\'s Haircut', appointments: 38, revenue: 3230, avg_duration: 60 },
      { service: 'Root Touch-up', appointments: 32, revenue: 3040, avg_duration: 90 },
      { service: 'Blowout', appointments: 30, revenue: 1650, avg_duration: 45 }
    ],
    weekly_trends: [
      { week: 'Week 1', appointments: 35, revenue: 3820, rating: 4.7 },
      { week: 'Week 2', appointments: 38, revenue: 4210, rating: 4.8 },
      { week: 'Week 3', appointments: 33, revenue: 3650, rating: 4.9 },
      { week: 'Week 4', appointments: 39, revenue: 4210, rating: 4.8 }
    ],
    client_satisfaction: {
      total_reviews: 87,
      five_star: 45,
      four_star: 35,
      three_star: 6,
      two_star: 1,
      one_star: 0,
      recent_reviews: [
        {
          id: 1,
          client_name: 'Sarah M.',
          rating: 5,
          review: 'Amazing balayage! Exactly what I wanted.',
          date: '2026-02-24',
          service: 'Full Balayage'
        },
        {
          id: 2,
          client_name: 'Jessica L.',
          rating: 5,
          review: 'Professional service, beautiful results!',
          date: '2026-02-23',
          service: 'Haircut & Style'
        },
        {
          id: 3,
          client_name: 'Mike D.',
          rating: 4,
          review: 'Great experience, will definitely book again.',
          date: '2026-02-22',
          service: 'Men\'s Cut'
        }
      ]
    },
    time_analysis: {
      average_appointment_duration: 87,
      on_time_percentage: 94,
      busiest_days: ['Saturday', 'Friday', 'Thursday'],
      peak_hours: ['10 AM - 12 PM', '2 PM - 4 PM'],
      most_popular_service_time: '11:00 AM'
    }
  };

  const loadMetrics = async (periodDays) => {
    try {
      setLoading(true);
      
      // In real implementation, fetch from API:
      // const response = await fetch(`/api/provider-metrics/${providerId}?period=${periodDays}`);
      // const data = await response.json();
      
      // For demo, use mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMetrics(mockMetrics);
      
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics(selectedPeriod);
  }, [selectedPeriod]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
        <p className="text-gray-500">Unable to load performance metrics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="h-6 w-6 mr-3 text-indigo-500" />
              Performance Dashboard
            </h2>
            <p className="text-gray-600 mt-1">Last {selectedPeriod} days performance overview</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.overview.total_appointments}</p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                {metrics.overview.completed_appointments} completed
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${metrics.overview.total_revenue.toLocaleString()}</p>
              <p className="text-sm text-green-600">
                ${Math.round(metrics.overview.total_revenue / metrics.overview.total_appointments)} avg/appointment
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rating</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.overview.average_rating}</p>
              <p className="text-sm text-gray-600 flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                {metrics.client_satisfaction.total_reviews} reviews
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Utilization</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.overview.utilization_rate}%</p>
              <p className="text-sm text-green-600">
                {metrics.overview.client_retention_rate}% retention rate
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance by Service */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2 text-indigo-500" />
            Performance by Service
          </h3>
          
          <div className="space-y-4">
            {metrics.performance_by_service.map((service, index) => (
              <div key={service.service} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{service.service}</h4>
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    #{index + 1}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Appointments</p>
                    <p className="font-semibold text-gray-900">{service.appointments}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Revenue</p>
                    <p className="font-semibold text-gray-900">${service.revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Avg Duration</p>
                    <p className="font-semibold text-gray-900">{service.avg_duration} min</p>
                  </div>
                </div>
                
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${(service.appointments / metrics.performance_by_service[0].appointments) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client Satisfaction */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-green-500" />
            Client Satisfaction
          </h3>
          
          <div className="space-y-4">
            {/* Rating Distribution */}
            <div className="space-y-2">
              {[
                { stars: 5, count: metrics.client_satisfaction.five_star, color: 'bg-green-500' },
                { stars: 4, count: metrics.client_satisfaction.four_star, color: 'bg-blue-500' },
                { stars: 3, count: metrics.client_satisfaction.three_star, color: 'bg-yellow-500' },
                { stars: 2, count: metrics.client_satisfaction.two_star, color: 'bg-orange-500' },
                { stars: 1, count: metrics.client_satisfaction.one_star, color: 'bg-red-500' }
              ].map(({ stars, count, color }) => {
                const percentage = (count / metrics.client_satisfaction.total_reviews) * 100;
                return (
                  <div key={stars} className="flex items-center space-x-3">
                    <div className="flex items-center w-16">
                      <span className="text-sm text-gray-600">{stars}</span>
                      <Star className="h-3 w-3 text-yellow-400 fill-current ml-1" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${color}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                );
              })}
            </div>

            {/* Recent Reviews */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Reviews</h4>
              <div className="space-y-3">
                {metrics.client_satisfaction.recent_reviews.map((review) => (
                  <div key={review.id} className="border-l-4 border-indigo-500 pl-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{review.client_name}</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{review.review}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{review.service}</span>
                      <span>{review.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time Analysis */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-purple-500" />
          Time Analysis
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{metrics.time_analysis.average_appointment_duration} min</div>
            <div className="text-sm text-gray-600">Average Duration</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{metrics.time_analysis.on_time_percentage}%</div>
            <div className="text-sm text-gray-600">On-time Rate</div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-700">Peak Hours</div>
            <div className="text-lg font-semibold text-gray-900 mt-1">
              {metrics.time_analysis.peak_hours[0]}
            </div>
            <div className="text-sm text-gray-600">
              {metrics.time_analysis.peak_hours[1]}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-700">Busiest Day</div>
            <div className="text-lg font-semibold text-gray-900 mt-1">
              {metrics.time_analysis.busiest_days[0]}
            </div>
            <div className="text-sm text-gray-600">
              {metrics.time_analysis.busiest_days.slice(1).join(', ')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderPerformanceMetrics;