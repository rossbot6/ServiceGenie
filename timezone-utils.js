// Timezone utilities for ServiceGenie
// Supports multi-location and multi-timezone salon management

/**
 * Get supported timezones for salon locations
 */
export const SALON_TIMEZONES = {
  'America/New_York': 'Eastern Time',
  'America/Chicago': 'Central Time', 
  'America/Denver': 'Mountain Time',
  'America/Los_Angeles': 'Pacific Time',
  'America/Phoenix': 'Mountain Standard Time',
  'America/Anchorage': 'Alaska Time',
  'Pacific/Honolulu': 'Hawaii Time'
};

/**
 * Get user's local timezone
 */
export function getUserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Convert time from one timezone to another
 */
export function convertTime(fromTime, fromTimezone, toTimezone) {
  try {
    // Parse the input time (assumes format 'HH:MM')
    const [hours, minutes] = fromTime.split(':').map(Number);
    
    // Get current date in the source timezone
    const now = new Date();
    const sourceDate = new Date();
    
    // Set time in source timezone
    sourceDate.setHours(hours, minutes, 0, 0);
    
    // Convert using Intl.DateTimeFormat
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: toTimezone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
    
    const parts = formatter.formatToParts(sourceDate);
    const hour = parseInt(parts.find(p => p.type === 'hour').value);
    const minute = parseInt(parts.find(p => p.type === 'minute').value);
    
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  } catch (error) {
    console.error('Timezone conversion error:', error);
    return fromTime; // Return original time if conversion fails
  }
}

/**
 * Convert appointment time from provider timezone to customer timezone
 */
export function convertAppointmentTime(appointmentTime, providerTimezone, customerTimezone) {
  if (providerTimezone === customerTimezone) {
    return appointmentTime; // No conversion needed
  }
  return convertTime(appointmentTime, providerTimezone, customerTimezone);
}

/**
 * Get timezone offset in minutes
 */
export function getTimezoneOffset(timezone) {
  try {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'shortOffset'
    });
    
    const parts = formatter.formatToParts(date);
    const offsetPart = parts.find(p => p.type === 'timeZoneName');
    
    if (offsetPart && offsetPart.value) {
      // Extract offset like "GMT-5" or "GMT+5"
      const offset = offsetPart.value.replace('GMT', '');
      return parseInt(offset) * 60; // Convert hours to minutes
    }
    
    return 0; // Default to UTC
  } catch (error) {
    console.error('Error getting timezone offset:', error);
    return 0;
  }
}

/**
 * Get localized time display for UI
 */
export function getLocalizedTime(timeString, timezone, format = '12-hour') {
  try {
    // Parse time string (HH:MM)
    const [hours, minutes] = timeString.split(':').map(Number);
    
    // Create a date object
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
    console.error('Error formatting localized time:', error);
    return timeString; // Return original if formatting fails
  }
}

/**
 * Calculate schedule times in different timezones
 */
export function calculateScheduleInTimezone(schedule, providerTimezone, targetTimezone) {
  if (providerTimezone === targetTimezone) {
    return schedule; // No conversion needed
  }
  
  const convertedSchedule = {};
  
  Object.keys(schedule).forEach(day => {
    convertedSchedule[day] = schedule[day].map(slot => {
      if (slot.start && slot.end) {
        return {
          ...slot,
          start: convertTime(slot.start, providerTimezone, targetTimezone),
          end: convertTime(slot.end, providerTimezone, targetTimezone)
        };
      }
      return slot;
    });
  });
  
  return convertedSchedule;
}

/**
 * Convert date to a specific timezone
 */
export function convertDateToTimezone(date, timezone) {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    return formatter.format(date);
  } catch (error) {
    console.error('Error converting date to timezone:', error);
    return date.toISOString().split('T')[0]; // Fallback to YYYY-MM-DD
  }
}

/**
 * Get timezone-aware appointment time range
 */
export function getTimezoneAwareAppointmentRange(appointment, providerTimezone, customerTimezone) {
  const startTime = convertTime(appointment.start_time, providerTimezone, customerTimezone);
  const endTime = convertTime(appointment.end_time, providerTimezone, customerTimezone);
  const date = convertDateToTimezone(new Date(appointment.date), customerTimezone);
  
  return {
    date,
    start_time: startTime,
    end_time: endTime,
    customer_timezone: customerTimezone,
    provider_timezone: providerTimezone
  };
}

/**
 * Format appointment time for customer display
 */
export function formatAppointmentForDisplay(appointment, customerTimezone, providerTimezone) {
  const range = getTimezoneAwareAppointmentRange(appointment, providerTimezone, customerTimezone);
  
  return {
    ...range,
    display_time: `${getLocalizedTime(range.start_time, customerTimezone)} - ${getLocalizedTime(range.end_time, customerTimezone)}`,
    display_date: new Intl.DateTimeFormat('en-US', {
      timeZone: customerTimezone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(range.date))
  };
}

/**
 * Validate timezone string
 */
export function isValidTimezone(timezone) {
  try {
    Intl.DateTimeFormat('en-US', { timeZone: timezone });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get list of valid timezones
 */
export function getValidTimezones() {
  return Object.keys(SALON_TIMEZONES).filter(timezone => isValidTimezone(timezone));
}

/**
 * Get timezone display name
 */
export function getTimezoneDisplayName(timezone) {
  return SALON_TIMEZONES[timezone] || 'UTC';
}

/**
 * Calculate the timezone difference in hours
 */
export function getTimezoneDifferenceMinutes(sourceTimezone, targetTimezone) {
  return getTimezoneOffset(targetTimezone) - getTimezoneOffset(sourceTimezone);
}

/**
 * Get appropriate greeting based on timezone
 */
export function getTimezoneGreeting(timezone) {
  const now = new Date();
  
  // Get hour in the target timezone
  const hour = parseInt(
    new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      hour12: false
    }).format(now)
  );
  
  if (hour >= 5 && hour < 12) {
    return 'Good morning';
  } else if (hour >= 12 && hour < 18) {
    return 'Good afternoon';
  } else if (hour >= 18 && hour < 22) {
    return 'Good evening';
  } else {
    return 'Welcome'; // Late night/early morning
  }
}