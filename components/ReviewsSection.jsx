import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Calendar, User, Filter, Search } from 'lucide-react';

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    rating: 'all', // all, 5, 4, 3, 2, 1
    provider: 'all',
    service: 'all',
    dateRange: '30', // days
    searchText: ''
  });
  const [selectedReview, setSelectedReview] = useState(null);

  // Mock review data (in real implementation, would come from API)
  const mockReviews = [
    {
      id: 1,
      customer_name: 'Sarah M.',
      customer_email: 'sarah.m@email.com',
      provider: 'Alex Chen',
      service: 'Full Balayage',
      rating: 5,
      title: 'Absolutely amazing results!',
      comment: 'Alex did an incredible job with my balayage. The color is exactly what I wanted and the technique was flawless. I get compliments everywhere I go!',
      date: '2026-02-24',
      time: '14:30',
      helpful_votes: 12,
      not_helpful_votes: 0,
      status: 'published',
      response: 'Thank you so much Sarah! We\'re thrilled you love the results. Looking forward to seeing you again soon!',
      response_date: '2026-02-24T15:00:00Z'
    },
    {
      id: 2,
      customer_name: 'Jessica L.',
      customer_email: 'jessica.l@email.com',
      provider: 'Maria Rodriguez',
      service: 'Haircut & Style',
      rating: 5,
      title: 'Professional and talented',
      comment: 'Maria really listened to what I wanted and delivered exactly that. The haircut is perfect and she gave me great styling tips for home.',
      date: '2026-02-23',
      time: '11:15',
      helpful_votes: 8,
      not_helpful_votes: 1,
      status: 'published',
      response: null,
      response_date: null
    },
    {
      id: 3,
      customer_name: 'Mike D.',
      customer_email: 'mike.d@email.com',
      provider: 'James Wilson',
      service: 'Men\'s Cut',
      rating: 4,
      title: 'Great cut, friendly service',
      comment: 'Good experience overall. James was friendly and the haircut was solid. Only reason for 4 stars is it took a bit longer than expected.',
      date: '2026-02-22',
      time: '16:45',
      helpful_votes: 5,
      not_helpful_votes: 0,
      status: 'published',
      response: 'Thanks for the feedback Mike! We\'ll work on keeping appointments on schedule.',
      response_date: '2026-02-22T17:00:00Z'
    },
    {
      id: 4,
      customer_name: 'Emma K.',
      customer_email: 'emma.k@email.com',
      provider: 'Alex Chen',
      service: 'Root Touch-up',
      rating: 5,
      title: 'Perfect color match',
      comment: 'The root touch-up was seamless and beautiful. Alex matched my previous color perfectly and it looks like it was just done originally.',
      date: '2026-02-21',
      time: '13:00',
      helpful_votes: 15,
      not_helpful_votes: 0,
      status: 'published',
      response: 'Emma, we appreciate your kind words! See you for your next touch-up.',
      response_date: '2026-02-21T13:30:00Z'
    },
    {
      id: 5,
      customer_name: 'Lisa S.',
      customer_email: 'lisa.s@email.com',
      provider: 'Maria Rodriguez',
      service: 'Blowout',
      rating: 3,
      title: 'Good but expensive',
      comment: 'The blowout was nice but I thought it was a bit overpriced for the service. The stylist was professional though.',
      date: '2026-02-20',
      time: '10:30',
      helpful_votes: 2,
      not_helpful_votes: 3,
      status: 'published',
      response: 'Thank you for your feedback Lisa. We appreciate all input to help improve our services.',
      response_date: '2026-02-20T11:00:00Z'
    }
  ];

  const loadReviews = async () => {
    try {
      setLoading(true);
      
      // In real implementation, would fetch from API with filters:
      // const params = new URLSearchParams(filter);
      // const response = await fetch(`/api/reviews?${params}`);
      // const data = await response.json();
      
      // For demo, use mock data with basic filtering
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredReviews = mockReviews;
      
      // Apply filters
      if (filter.rating !== 'all') {
        filteredReviews = filteredReviews.filter(review => review.rating === parseInt(filter.rating));
      }
      
      if (filter.searchText) {
        const searchLower = filter.searchText.toLowerCase();
        filteredReviews = filteredReviews.filter(review => 
          review.comment.toLowerCase().includes(searchLower) ||
          review.title.toLowerCase().includes(searchLower) ||
          review.customer_name.toLowerCase().includes(searchLower) ||
          review.service.toLowerCase().includes(searchLower)
        );
      }
      
      // Filter by date range
      const daysBack = parseInt(filter.dateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysBack);
      filteredReviews = filteredReviews.filter(review => 
        new Date(review.date) >= cutoffDate
      );
      
      setReviews(filteredReviews);
      
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    setFilter(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= rating;
      const isHalfFilled = !isFilled && starValue === Math.ceil(rating) && rating % 1 !== 0;
      
      return (
        <Star
          key={index}
          className={`h-5 w-5 ${
            isFilled 
              ? 'text-yellow-400 fill-current' 
              : isHalfFilled 
                ? 'text-yellow-300 fill-current' 
                : 'text-gray-300'
          } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
          onClick={interactive && onRatingChange ? () => onRatingChange(starValue) : undefined}
        />
      );
    });
  };

  const handleResponseSubmit = async (reviewId, response) => {
    try {
      // In real implementation, would POST to API:
      // await fetch(`/api/reviews/${reviewId}/response`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ response })
      // });
      
      // Update local state
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, response, response_date: new Date().toISOString() }
          : review
      ));
      
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [filter]);

  // Get unique providers and services for filter dropdowns
  const providers = [...new Set(mockReviews.map(review => review.provider))];
  const services = [...new Set(mockReviews.map(review => review.service))];

  // Calculate summary stats
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => 
    reviews.filter(review => review.rating === rating).length
  );

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Dashboard */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Star className="h-5 w-5 mr-2 text-yellow-500" />
          Customer Reviews & Ratings
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{avgRating}</div>
            <div className="flex justify-center mt-2">
              {renderStars(avgRating)}
            </div>
            <div className="text-sm text-gray-600 mt-1">{reviews.length} reviews</div>
          </div>
          
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = reviews.filter(r => r.rating === rating).length;
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={rating} className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 w-4">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 w-8">{count}</span>
                </div>
              );
            })}
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">
              {reviews.filter(r => r.rating >= 4).length}
            </div>
            <div className="text-sm text-gray-600">Positive Reviews</div>
            <div className="text-xs text-gray-500 mt-1">
              {reviews.length > 0 ? Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100) : 0}% positive
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">
              {reviews.filter(r => r.response).length}
            </div>
            <div className="text-sm text-gray-600">Responded</div>
            <div className="text-xs text-gray-500 mt-1">
              {reviews.length > 0 ? Math.round((reviews.filter(r => r.response).length / reviews.length) * 100) : 0}% response rate
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={filter.searchText}
                onChange={(e) => updateFilter('searchText', e.target.value)}
                className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                placeholder="Search reviews..."
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <select
              value={filter.rating}
              onChange={(e) => updateFilter('rating', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provider
            </label>
            <select
              value={filter.provider}
              onChange={(e) => updateFilter('provider', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            >
              <option value="all">All Providers</option>
              {providers.map(provider => (
                <option key={provider} value={provider}>{provider}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service
            </label>
            <select
              value={filter.service}
              onChange={(e) => updateFilter('service', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            >
              <option value="all">All Services</option>
              {services.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={filter.dateRange}
              onChange={(e) => updateFilter('dateRange', e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id} 
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-full">
                  <User className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{review.customer_name}</h3>
                  <p className="text-sm text-gray-600">{review.service} with {review.provider}</p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {review.date} at {review.time}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  {renderStars(review.rating)}
                  <span className="font-semibold text-gray-900">{review.rating}</span>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                  review.rating >= 4 
                    ? 'bg-green-100 text-green-800' 
                    : review.rating >= 3
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {review.rating >= 4 ? 'Positive' : review.rating >= 3 ? 'Neutral' : 'Negative'}
                </span>
              </div>
            </div>
            
            {review.title && (
              <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
            )}
            
            <p className="text-gray-700 mb-4">{review.comment}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{review.helpful_votes}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600">
                    <ThumbsDown className="h-4 w-4" />
                    <span>{review.not_helpful_votes}</span>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {!review.response && (
                  <button 
                    onClick={() => setSelectedReview(review.id)}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Respond
                  </button>
                )}
              </div>
            </div>
            
            {review.response && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-indigo-500">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Provider Response</span>
                  <span className="text-xs text-gray-500">
                    {review.response_date && new Date(review.response_date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{review.response}</p>
              </div>
            )}
            
            {selectedReview === review.id && (
              <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Add Response</h4>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  placeholder="Write your response to this review..."
                />
                <div className="flex justify-end space-x-2 mt-3">
                  <button 
                    onClick={() => setSelectedReview(null)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      const textarea = document.querySelector(`textarea[data-review="${review.id}"]`);
                      if (textarea?.value.trim()) {
                        handleResponseSubmit(review.id, textarea.value.trim());
                        setSelectedReview(null);
                      }
                    }}
                    className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Submit Response
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {reviews.length === 0 && (
          <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No reviews found matching your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;