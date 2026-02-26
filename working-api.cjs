// Working API using Docker exec to bypass networking issues
const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const DOCKER_PATH = "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe";

// Timezone utilities for multi-timezone support
const SALON_TIMEZONES = {
  'America/New_York': 'Eastern Time',
  'America/Chicago': 'Central Time', 
  'America/Denver': 'Mountain Time',
  'America/Los_Angeles': 'Pacific Time',
  'America/Phoenix': 'Mountain Standard Time',
  'America/Anchorage': 'Alaska Time',
  'Pacific/Honolulu': 'Hawaii Time'
};

function getUserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function convertTime(fromTime, fromTimezone, toTimezone) {
  try {
    if (fromTimezone === toTimezone) {
      return fromTime; // No conversion needed
    }
    
    const [hours, minutes] = fromTime.split(':').map(Number);
    const date = new Date();
    const sourceDate = new Date();
    sourceDate.setHours(hours, minutes, 0, 0);
    
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: toTimezone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const parts = formatter.formatToParts(sourceDate);
    const hour = parseInt(parts.find(p => p.type === 'hour').value);
    const minute = parseInt(parts.find(p => p.type === 'minute').value);
    
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  } catch (error) {
    console.error('Timezone conversion error:', error);
    return fromTime;
  }
}

function runDockerExec(query, database = 'postgres', user = 'supabase_admin') {
  return new Promise((resolve, reject) => {
    const args = ['exec', '-i', 'supabase-db', 'psql', '-U', user, '-d', database, '-c', query];
    
    console.log(`🐳 Running: docker ${args.join(' ')}`);
    
    const docker = spawn(DOCKER_PATH, args);
    
    let output = '';
    let errorOutput = '';
    
    docker.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    docker.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    docker.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Docker exec failed (code ${code}): ${errorOutput || output}`));
      }
    });
    
    docker.on('error', (err) => {
      reject(err);
    });
  });
}

async function parsePsqlOutput(output) {
  const lines = output.trim().split('\n');
  const results = [];
  
  // Skip header and separator lines
  const dataLines = lines.filter(line => 
    !line.includes('(') && 
    !line.includes('---') && 
    !line.includes('row)') &&
    !line.includes('rows)') &&
    line.trim() !== ''
  );
  
  for (const line of dataLines) {
    if (line.includes('|') && !line.match(/^[^|]*\|[^|]*\|[^|]*$/)) {
      const parts = line.split('|').map(p => p.trim().replace(/^"|"$/g, ''));
      if (parts.length > 1 && parts[0] !== '') {
        results.push(parts);
      }
    }
  }
  
  return results;
}

async function getProviders() {
  try {
    const query = "SELECT id, name, email, phone, specialty, is_active FROM providers ORDER BY name;";
    const output = await runDockerExec(query);
    console.log('📊 Providers query result:', output);
    
    const results = await parsePsqlOutput(output);
    const providers = results.map(row => ({
      id: row[0],
      name: row[1], 
      email: row[2],
      phone: row[3],
      specialty: row[4],
      is_active: row[5] === 't'
    }));
    
    return providers;
  } catch (error) {
    console.error('❌ Error getting providers:', error.message);
    // Return fallback data
    return [
      {
        id: 'demo-1',
        name: 'Emma Wilson',
        email: 'emma@servicegenie.com',
        phone: '(212) 555-0101',
        specialty: 'Senior Colorist',
        is_active: true
      }
    ];
  }
}

async function getCustomers() {
  try {
    const query = "SELECT id, name, email, phone, notes FROM customers ORDER BY name;";
    const output = await runDockerExec(query);
    
    const results = await parsePsqlOutput(output);
    const customers = results.map(row => ({
      id: row[0],
      name: row[1],
      email: row[2],
      phone: row[3],
      notes: row[4] || ''
    }));
    
    return customers;
  } catch (error) {
    console.error('❌ Error getting customers:', error.message);
    return [];
  }
}

async function getLocations() {
  try {
    const query = "SELECT id, name, address, city, state, zip, phone, timezone, opening_time, closing_time FROM locations ORDER BY name;";
    const output = await runDockerExec(query);
    
    const results = await parsePsqlOutput(output);
    const locations = results.map(row => ({
      id: row[0],
      name: row[1],
      address: row[2],
      city: row[3],
      state: row[4],
      zip: row[5],
      phone: row[6],
      timezone: row[7] || 'America/New_York',
      opening_time: row[8] || '09:00',
      closing_time: row[9] || '20:00'
    }));
    
    return locations;
  } catch (error) {
    console.error('❌ Error getting locations:', error.message);
    return [
      {
        id: 'demo-location',
        name: 'ServiceGenie Downtown',
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        phone: '(555) 100-0001',
        timezone: 'America/New_York',
        opening_time: '09:00',
        closing_time: '20:00'
      }
    ];
  }
}

async function getServices() {
  try {
    const query = "SELECT id, name, price, duration, category FROM services ORDER BY name;";
    const output = await runDockerExec(query);
    
    const results = await parsePsqlOutput(output);
    const services = results.map(row => ({
      id: row[0],
      name: row[1],
      price: parseFloat(row[2]),
      duration: parseInt(row[3]),
      category: row[4]
    }));
    
    return services;
  } catch (error) {
    console.error('❌ Error getting services:', error.message);
    return [];
  }
}

async function getAppointments(dateRange = null) {
  try {
    // Get appointments with all necessary details
    const query = `SELECT 
      a.id, a.date, a.start_time, a.end_time, a.duration, a.price, a.status, a.notes,
      p.name as provider_name, 
      c.name as customer_name,
      s.name as service_name,
      l.name as location_name,
      l.timezone as location_timezone
    FROM appointments a
    LEFT JOIN providers p ON a.provider_id = p.id
    LEFT JOIN customers c ON a.customer_id = c.id  
    LEFT JOIN services s ON a.service_id = s.id
    LEFT JOIN locations l ON a.location_id = l.id
    ORDER BY a.date DESC, a.start_time ASC
    LIMIT 100;`;
    
    const output = await runDockerExec(query);
    const results = await parsePsqlOutput(output);
    
    const appointments = results.map(row => ({
      id: row[0],
      date: row[1],
      start_time: row[2],
      end_time: row[3],
      duration: parseInt(row[4]),
      price: parseFloat(row[5]) || 0,
      status: row[6],
      notes: row[7] || '',
      provider_name: row[8] || 'Unknown Provider',
      customer_name: row[9] || 'Unknown Customer',
      service_name: row[10] || 'Unknown Service',
      location_name: row[11] || 'Unknown Location',
      location_timezone: row[12] || 'America/New_York'
    }));
    
    return appointments;
  } catch (error) {
    console.error('❌ Error getting appointments:', error.message);
    return [];
  }
}

async function getCustomerPreferences(customerId) {
  try {
    const query = `SELECT id, customer_timezone, communication_preferred_method, marketing_opt_in 
                  FROM customers WHERE id = '${customerId}';`;
    const output = await runDockerExec(query);
    
    const results = await parsePsqlOutput(output);
    if (results.length > 0) {
      const [id, customer_timezone, preferred_method, marketing_opt_in] = results[0];
      return {
        customer_timezone: customer_timezone || getUserTimezone(),
        preferred_communication_method: preferred_method || 'email',
        marketing_opt_in: marketing_opt_in === 't'
      };
    }
    
    return {
      customer_timezone: getUserTimezone(),
      preferred_communication_method: 'email',
      marketing_opt_in: true
    };
  } catch (error) {
    console.error('❌ Error getting customer preferences:', error.message);
    return {
      customer_timezone: getUserTimezone(),
      preferred_communication_method: 'email',
      marketing_opt_in: true
    };
  }
}

// JSON file persistence utilities
function saveLocalData(data, key) {
  try {
    const localDataPath = path.join(__dirname, 'local-data.json');
    let localData = {};
    
    if (fs.existsSync(localDataPath)) {
      localData = JSON.parse(fs.readFileSync(localDataPath, 'utf8'));
    }
    
    localData[key] = data;
    fs.writeFileSync(localDataPath, JSON.stringify(localData, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Error saving local data:', error.message);
    return false;
  }
}

function loadLocalData(key) {
  try {
    const localDataPath = path.join(__dirname, 'local-data.json');
    
    if (fs.existsSync(localDataPath)) {
      const localData = JSON.parse(fs.readFileSync(localDataPath, 'utf8'));
      return localData[key] || null;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error loading local data:', error.message);
    return null;
  }
}

async function getLocationPolicies(locationId) {
  try {
    // Try to load from our JSON persistence system first
    const key = `location-policies-${locationId}`;
    const dataFile = path.join(__dirname, 'local-data.json');
    
    if (fs.existsSync(dataFile)) {
      const jsonData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
      if (jsonData[key]) {
        return jsonData[key];
      }
    }
    
    // Default policies if none exist
    return {
      cancellationPolicy: { enabled: true, hoursRequired: 24, refundPercentage: 100 },
      depositPolicy: { enabled: false, servicesRequiringDeposit: [], depositPercentage: 0 },
      noShowPolicy: { enabled: true, noShowThreshold: 2, actionAfterThreshold: 'suspend' },
      reschedulePolicy: { allowed: true, maxReschedules: 2, reschedulingFee: 0 },
      latePolicy: { enabled: true, gracePeriod: 15, lateFee: 15 },
      bookingWindow: { maxDaysAhead: 60, minDaysAhead: 0 },
      emergencyPolicy: { allowCancellations: true, emergencyWindowHours: 4 }
    };
  } catch (error) {
    console.error('❌ Error getting location policies:', error.message);
    return {
      cancellationPolicy: { enabled: true, hoursRequired: 24, refundPercentage: 100 },
      depositPolicy: { enabled: false, servicesRequiringDeposit: [], depositPercentage: 0 },
      noShowPolicy: { enabled: true, noShowThreshold: 2, actionAfterThreshold: 'suspend' },
      reschedulePolicy: { allowed: true, maxReschedules: 2, reschedulingFee: 0 },
      latePolicy: { enabled: true, gracePeriod: 15, lateFee: 15 },
      bookingWindow: { maxDaysAhead: 60, minDaysAhead: 0 },
      emergencyPolicy: { allowCancellations: true, emergencyWindowHours: 4 }
    };
  }
}

async function saveLocationPolicies(locationId, policies) {
  try {
    const key = `location-policies-${locationId}`;
    const dataFile = path.join(__dirname, 'local-data.json');
    
    let jsonData = {};
    if (fs.existsSync(dataFile)) {
      jsonData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    }
    
    jsonData[key] = {
      locationId,
      policies,
      updatedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(dataFile, JSON.stringify(jsonData, null, 2));
    console.log(`✅ Saved location policies for location ${locationId}`);
    return true;
  } catch (error) {
    console.error('❌ Error saving location policies:', error.message);
    throw error;
  }
}

async function validateBookingPolicy(appointment, locationId) {
  try {
    const policies = await getLocationPolicies(locationId);
    const now = new Date();
    const appointmentDate = new Date(appointment.date);
    const appointmentTime = appointment.start_time.split(':').map(Number);
    appointmentDate.setHours(appointmentTime[0], appointmentTime[1], 0, 0);
    
    const hoursUntilAppointment = (appointmentDate - now) / (1000 * 60 * 60);
    const validation = {
      canCancel: true,
      requiresDeposit: false,
      canReschedule: true,
      messages: [],
      charges: [],
      warnings: []
    };
    
    // Check cancellation policy
    if (policies.cancellationPolicy && policies.cancellationPolicy.enabled) {
      if (hoursUntilAppointment < policies.cancellationPolicy.hoursRequired) {
        validation.messages.push(`Cancellation requires ${policies.cancellationPolicy.hoursRequired} hours notice`);
        validation.charges.push({
          type: 'partial_refund',
          percentage: 100 - policies.cancellationPolicy.refundPercentage,
          description: `Cancellation penalty for late notice`
        });
      }
    }
    
    // Check deposit requirements
    if (policies.depositPolicy && policies.depositPolicy.enabled) {
      const serviceRequiresDeposit = policies.depositPolicy.servicesRequiringDeposit.includes(
        appointment.service_id || appointment.service_type
      );
      
      if (serviceRequiresDeposit) {
        validation.requiresDeposit = true;
        
        let depositAmount;
        if (policies.depositPolicy.depositTypes === 'percentage') {
          depositAmount = appointment.price * (policies.depositPolicy.depositPercentage / 100);
        } else {
          depositAmount = policies.depositPolicy.fixedAmount;
        }
        
        validation.charges.push({
          type: 'deposit',
          amount: depositAmount,
          description: `Deposit required for ${appointment.service_name}`
        });
      }
    }
    
    // Check rescheduling policy
    if (!policies.reschedulePolicy || !policies.reschedulePolicy.allowed) {
      validation.canReschedule = false;
      validation.messages.push('Rescheduling not allowed');
    } else if (hoursUntilAppointment < 24) {
      validation.canReschedule = false;
      validation.messages.push('Cannot reschedule within 24 hours');
    }
    
    // Check no-show history (would need to fetch customer history)
    validation.warnings.push('Customer will be charged the full amount if they do not show up');
    
    return validation;
  } catch (error) {
    console.error('❌ Error validating booking policy:', error.message);
    return {
      canCancel: true,
      requiresDeposit: false,
      canReschedule: true,
      messages: ['Policy validation failed'],
      charges: [],
      warnings: ['Unable to verify customer booking history']
    };
  }
}

async function testDatabase() {
  try {
    const output = await runDockerExec("SELECT 1 as test;");
    console.log('✅ Database test successful:', output.includes('1'));
    return true;
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    return false;
  }
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  try {
    // Parse URL and query parameters
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    
    if (pathname === '/api/providers' && req.method === 'GET') {
      const providers = await getProviders();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(providers));
    } 
    else if (pathname === '/api/customers' && req.method === 'GET') {
      const customers = await getCustomers();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(customers));
    }
    else if (pathname === '/api/locations' && req.method === 'GET') {
      const locations = await getLocations();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(locations));
    }
    else if (pathname === '/api/services' && req.method === 'GET') {
      const services = await getServices();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(services));
    }
    else if (pathname === '/api/appointments' && req.method === 'GET') {
      const dateRange = {
        start_date: url.searchParams.get('start_date'),
        end_date: url.searchParams.get('end_date'),
        provider_id: url.searchParams.get('provider_id'),
        location_id: url.searchParams.get('location_id')
      };
      
      const appointments = await getAppointments(dateRange);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(appointments));
    }
    else if (pathname === '/api/customer-preferences' && req.method === 'GET') {
      const customerId = url.searchParams.get('customer_id');
      if (!customerId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'customer_id parameter required' }));
        return;
      }
      
      const preferences = await getCustomerPreferences(customerId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(preferences));
    }
    else if (pathname === '/api/timezone-convert' && req.method === 'POST') {
      const body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => resolve(JSON.parse(data)));
        req.on('error', reject);
      });
      
      const { time, from_timezone, to_timezone } = body;
      if (!time || !from_timezone || !to_timezone) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'time, from_timezone, and to_timezone required' }));
        return;
      }
      
      const convertedTime = convertTime(time, from_timezone, to_timezone);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        original_time: time,
        converted_time: convertedTime,
        from_timezone,
        to_timezone
      }));
    }
    else if (pathname === '/api/timezones' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(SALON_TIMEZONES));
    }
    else if (pathname === '/api/location-policies/' && req.method === 'GET') {
      const locationId = url.searchParams.get('id');
      if (!locationId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'location id parameter required' }));
        return;
      }
      
      const policies = await getLocationPolicies(locationId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(policies));
    }
    else if (pathname.startsWith('/api/location-policies/') && req.method === 'POST') {
      const locationId = pathname.split('/').pop();
      const body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => resolve(JSON.parse(data)));
        req.on('error', reject);
      });
      
      const { policies } = body;
      await saveLocationPolicies(locationId, policies);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, locationId, policies }));
    }
    else if (pathname === '/api/booking-policies/validate' && req.method === 'POST') {
      const body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => resolve(JSON.parse(data)));
        req.on('error', reject);
      });
      
      const { appointment, locationId } = body;
      if (!appointment || !locationId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'appointment and locationId required' }));
        return;
      }
      
      const validation = await validateBookingPolicy(appointment, locationId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(validation));
    }
    else if (pathname === '/api/save' && req.method === 'POST') {
      const body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => resolve(JSON.parse(data)));
        req.on('error', reject);
      });
      
      const { key, data } = body;
      if (!key || data === undefined) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'key and data required' }));
        return;
      }
      
      const saved = saveLocalData(data, key);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ saved, key }));
    }
    else if (pathname === '/api/load' && req.method === 'GET') {
      const key = url.searchParams.get('key');
      if (!key) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'key parameter required' }));
        return;
      }
      
      const data = loadLocalData(key);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ data, key }));
    }
    // ================================ 
    // NOTIFICATION & REMINDER SYSTEM
    // ================================
    
    // Get notifications for a customer/provider/location
    else if (pathname === '/api/notifications' && req.method === 'GET') {
      const customerId = url.searchParams.get('customer_id');
      const providerId = url.searchParams.get('provider_id');
      const locationId = url.searchParams.get('location_id');
      
      // Load notification history from local storage
      const notifications = loadLocalData('notifications') || [];
      
      let filteredNotifications = notifications;
      if (customerId) {
        filteredNotifications = filteredNotifications.filter(n => n.customer_id === customerId);
      }
      if (providerId) {
        filteredNotifications = filteredNotifications.filter(n => n.provider_id === providerId);
      }
      if (locationId) {
        filteredNotifications = filteredNotifications.filter(n => n.location_id === locationId);
      }
      
      // Sort by created_at desc
      filteredNotifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(filteredNotifications));
    }
    
    // Get notification templates
    else if (pathname === '/api/notification-templates' && req.method === 'GET') {
      const templates = loadLocalData('notification-templates');
      
      if (!templates) {
        // Default notification templates
        const defaultTemplates = [
          {
            id: 'appointment_reminder_24h',
            name: '24-Hour Reminder',
            type: 'appointment_reminder',
            template: "Hi {customer_name}, this is a reminder about your appointment with {provider_name} tomorrow at {appointment_time} at {location_name}. Please arrive 10 minutes early.",
            variables: ['customer_name', 'provider_name', 'appointment_time', 'location_name'],
            method: 'sms'
          },
          {
            id: 'booking_confirmation',
            name: 'Booking Confirmation',
            type: 'booking_confirmation',
            template: "Thank you for booking with us! Your {service_name} appointment with {provider_name} is confirmed for {appointment_date} at {appointment_time}.",
            variables: ['customer_name', 'service_name', 'provider_name', 'appointment_date', 'appointment_time'],
            method: 'email'
          }
        ];
        
        await saveLocalData('notification-templates', defaultTemplates);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(defaultTemplates));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(templates));
      }
    }
    
    // Send notification
    else if (pathname === '/api/notifications/send' && req.method === 'POST') {
      try {
        const body = await new Promise((resolve, reject) => {
          let data = '';
          req.on('data', chunk => data += chunk);
          req.on('end', () => resolve(JSON.parse(data)));
          req.on('error', reject);
        });
        
        const {
          type, method, content, recipients, schedule_time,
          customer_id, provider_id, location_id, variables
        } = body;
        
        // Create notification record
        const notification = {
          id: generateId(),
          type,
          method,
          content,
          recipients: recipients ? recipients.split(',').map(r => r.trim()) : [],
          customer_id,
          provider_id,
          location_id,
          status: schedule_time ? 'scheduled' : 'sent',
          created_at: new Date().toISOString(),
          scheduled_for: schedule_time,
          variables: variables || {}
        };
        
        // Simulate sending based on method
        if (method === 'sms' || method === 'both') {
          console.log(`📱 SMS sent to: ${recipients}`);
          // Simulate SMS gateway integration
        }
        
        if (method === 'email' || method === 'both') {
          console.log(`📧 Email sent to: ${recipients}`);
          // Simulate email service integration
        }
        
        // Save notification to history
        const notifications = loadLocalData('notifications') || [];
        notifications.push(notification);
        await saveLocalData('notifications', notifications);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          notification_id: notification.id,
          status: notification.status,
          message: 'Notification sent successfully'
        }));
        
      } catch (error) {
        console.error('❌ Error sending notification:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    }
    
    // Schedule appointment reminders
    else if (pathname === '/api/notifications/schedule-reminders' && req.method === 'POST') {
      try {
        const body = await new Promise((resolve, reject) => {
          let data = '';
          req.on('data', chunk => data += chunk);
          req.on('end', () => resolve(JSON.parse(data)));
          req.on('error', reject);
        });
        
        const { appointment } = body;
        if (!appointment) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'appointment data required' }));
          return;
        }
        
        // Calculate reminder times
        const appointmentTime = new Date(appointment.date + ' ' + appointment.start_time);
        const now = new Date();
        const hoursUntil = Math.floor((appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60));
        
        const reminders = [];
        
        if (hoursUntil > 24) {
          // Schedule 24-hour reminder
          const scheduledTime = new Date(appointmentTime.getTime() - 24 * 60 * 60 * 1000);
          reminders.push({
            id: generateId(),
            type: 'appointment_reminder',
            method: 'email',
            scheduled_for: scheduledTime.toISOString(),
            appointment_id: appointment.id,
            customer_id: appointment.customer_id,
            provider_id: appointment.provider_id,
            location_id: appointment.location_id,
            template_id: 'appointment_reminder_24h',
            status: 'pending'
          });
        }
        
        if (hoursUntil > 2) {
          // Schedule 2-hour reminder
          const scheduledTime = new Date(appointmentTime.getTime() - 2 * 60 * 60 * 1000);
          reminders.push({
            id: generateId(),
            type: 'appointment_reminder',
            method: 'sms',
            scheduled_for: scheduledTime.toISOString(),
            appointment_id: appointment.id,
            customer_id: appointment.customer_id,
            provider_id: appointment.provider_id,
            location_id: appointment.location_id,
            template_id: 'appointment_reminder_2h',
            status: 'pending'
          });
        }
        
        // Save scheduled reminders
        const existingReminders = loadLocalData('scheduled-reminders') || [];
        const updatedReminders = [...existingReminders, ...reminders];
        await saveLocalData('scheduled-reminders', updatedReminders);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          scheduled: reminders.length,
          reminders 
        }));
        
      } catch (error) {
        console.error('❌ Error scheduling reminders:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    }
    
    else if (pathname === '/health' && req.method === 'GET') {
      const dbOk = await testDatabase();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        status: 'ok', 
        database: dbOk ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
        timezone: getUserTimezone()
      }));
    }
    else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found', path: pathname }));
    }
  } catch (error) {
    console.error('API Error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Working API server running on http://localhost:${PORT}`);
  console.log('📊 Using Docker exec to bypass networking issues');
  
  testDatabase().then(dbOk => {
    if (dbOk) {
      console.log('✅ Database connection verified via Docker exec');
    } else {
      console.log('⚠️ Database connection failed, using fallback data');
    }
  });
});