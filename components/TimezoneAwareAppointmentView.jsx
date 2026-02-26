import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Users, Calendar } from 'lucide-react';

const TimezoneAwareAppointmentView = ({ 
  appointments = [], 
  userTimezone,
  className = "" 
}) => {
  const [timezoneInfo, setTimezoneInfo] = useState({
    userTimezone: userTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    selectedTimezone: userTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  // Fetch available timezones
  const getAvailableTimezones = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/timezones');
      const timezones = await response.json();
      return Object.keys(timezones);
    } catch (error) {
      console.error('Error fetching timezones:', error);
      return ['America/New_York']; // Fallback
    }
  };

  // Convert appointment time for display
  const convertAppointmentTime = (appointment) => {
    const providerTimezone = appointment.location_timezone || 'America/New_York';
    const customerTimezone = timezoneInfo.selectedTimezone;
    
    const startTime = appointment.start_time;
    const endTime = appointment.end_time;
    
    // Convert times if timezone is different
    if (providerTimezone !== customerTimezone) {
      return convertTimeRange(startTime, endTime, providerTimezone, customerTimezone);
    }
    
    return {
      start: startTime,
      end: endTime,
      date: appointment.date
    };
  };

  // Convert time range between timezones
  async function convertTimeRange(startTime, endTime, fromTimezone, toTimezone) {
    try {
      const startResponse = await fetch('http://localhost:3001/api/timezone-convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          time: startTime,
          from_timezone: fromTimezone,
          to_timezone: toTimezone
        })
      });
      
      const endResponse = await fetch('http://localhost:3001/api/timezone-convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          time: endTime,
          from_timezone: fromTimezone,
          to_timezone: toTimezone
        })
      });
      
      const startData = await startResponse.json();
      const endData = await endResponse.json();
      
      return {
        start: startData.converted_time,
        end: endData.converted_time,
        date: new Date().toISOString().split('T')[0] // Simplified for demo
      };
    } catch (error) {
      console.error('Error converting time:', error);
      return { start: startTime, end: endTime, date: new Date().toISOString().split('T')[0] };
    }
  }

  // Format time display
  const formatTime = (timeString, timezone, format = '12-hour') => {
    try {
      const [hours, minutes] = timeString.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      
      const options = {
        timeZone: timezone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: format === '12-hour'
      };
      
      return new Intl.DateTimeFormat('en-US', options).format(date);
    } catch (error) {
      console.error('Error formatting time:', error);
      return timeString;
    }
  };

  // Get greeting based on timezone
  const getGreeting = () => {
    const now = new Date();
    const hour = parseInt(new Intl.DateTimeFormat('en-US', {
      timeZone: timezoneInfo.selectedTimezone,
      hour: 'numeric',
      hour12: false
    }).format(now));

    if (hour >= 5 && hour < 12) {
      return 'Good morning';
    } else if (hour >= 12 && hour < 18) {
      return 'Good afternoon';
    } else if (hour >= 18 && hour < 22) {
      return 'Good evening';
    } else {
      return 'Welcome';
    }
  };

  // Group appointments by date
  const groupAppointmentsByDate = () => {
    const groups = {};
    appointments.forEach(appointment => {
      const date = appointment.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(appointment);
    });
    
    return groups;
  };

  const appointmentGroups = groupAppointmentsByDate();
  const greeting = getGreeting();

  return (
    <div className={`timezone-aware-appointments ${className}`}>
      {/* Header with timezone selector */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {greeting}! Your Appointments
            </h2>
            <p className="text-gray-600">
              View all your salon appointments across different locations
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Clock className="h-5 w-5 text-gray-400" />
            <select 
              value={timezoneInfo.selectedTimezone}
              onChange={(e) => setTimezoneInfo(prev => ({
                ...prev,
                selectedTimezone: e.target.value
              }))}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            >
              {Object.entries({
                'America/New_York': 'Eastern Time',
                'America/Chicago': 'Central Time', 
                'America/Denver': 'Mountain Time',
                'America/Los_Angeles': 'Pacific Time'
              }).map(([tz, display]) => (
                <option key={tz} value={tz}>
                  {tz} ({display})
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-indigo-500" />
            <span>Showing times in {timezoneInfo.selectedTimezone}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-green-500" />
            <span>{Object.keys(appointmentGroups).length} appointment days</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-blue-500" />
            <span>{appointments.length} total appointments</span>
          </div>
        </div>
      </div>

      {/* Appointments grouped by date */}
      <div className="space-y-6">
        {Object.entries(appointmentGroups).map(([date, dateAppointments]) => (
          <div key={date} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-indigo-500" />
              {new Intl.DateTimeFormat('en-US', {
                timeZone: timezoneInfo.selectedTimezone,
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }).format(new Date(date))}
            </h3>
            
            <div className="space-y-3">
              {dateAppointments.map((appointment) => {
                const convertedTime = convertAppointmentTime(appointment);
                
                return (
                  <div 
                    key={appointment.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Clock className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900">
                            {formatTime(convertedTime.start, timezoneInfo.selectedTimezone)} - {formatTime(convertedTime.end, timezoneInfo.selectedTimezone)}
                          </span>
                          {appointment.location_timezone !== timezoneInfo.selectedTimezone && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Timezone Converted
                            </span>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-indigo-500" />
                            <span>{appointment.customer_name}</span>
                            <span className="mx-2">•</span>
                            <span>{appointment.provider_name}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: '#6366f1' }}></div>
                            <span>{appointment.service_name}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{appointment.location_name}</span>
                            <span className="mx-2">•</span>
                            <span className="text-xs">{appointment.location_timezone}</span>
                          </div>
                        </div>
                        
                        {appointment.notes && (
                          <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-700">
                            <strong>Notes:</strong> {appointment.notes}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                          ${appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : ''}
                          ${appointment.status === 'completed' ? 'bg-gray-100 text-gray-800' : ''}
                          ${appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                          ${appointment.status === 'no_show' ? 'bg-orange-100 text-orange-800' : ''}
                        `}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                        
                        {appointment.price > 0 && (
                          <span className="text-sm font-medium text-gray-900">
                            ${appointment.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        {appointments.length === 0 && (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments scheduled</h3>
            <p className="text-gray-500">
              You don't have any appointments in the selected date range.
            </p>
          </div>
        )}
      </div>
      
      {/* Timezone conversion info */}
      {Object.keys(appointmentGroups).length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
            <div>
              <h4 className="font-medium text-blue-900">Timezone Information</h4>
              <p className="text-sm text-blue-700 mt-1">
                All appointment times are displayed in {timezoneInfo.selectedTimezone}. 
                If your appointments are at a different location, the times have been automatically converted 
                to your local timezone for convenience.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimezoneAwareAppointmentView;