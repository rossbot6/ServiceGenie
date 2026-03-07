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
    
    // ================================ 
    // ENHANCED APPOINTMENT MANAGEMENT
    // ================================
    
    // Check appointment conflicts
    else if (pathname === '/api/appointments/check-conflicts' && req.method === 'POST') {
      try {
        const body = await new Promise((resolve, reject) => {
          let data = '';
          req.on('data', chunk => data += chunk);
          req.on('end', () => resolve(JSON.parse(data)));
          req.on('error', reject);
        });
        
        const { provider_id, date, start_time, end_time } = body;
        if (!provider_id || !date || !start_time || !end_time) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'provider_id, date, start_time, and end_time required' }));
          return;
        }
        
        // Load existing appointments for conflict checking
        const appointments = loadLocalData('appointments') || [];
        const conflicts = appointments.filter(apt => {
          return apt.provider_id === provider_id && 
                 apt.date === date &&
                 timesOverlap(start_time, end_time, apt.start_time, apt.end_time);
        });
        
        // Check provider schedule availability
        const providerSchedule = loadLocalData(`provider-${provider_id}-schedule`) || {};
        const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const daySchedule = providerSchedule[dayOfWeek] || [];
        const slotAvailable = daySchedule.some(slot => 
          isTimeWithinSlot(start_time, end_time, slot.time, slot.duration)
        );
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          has_conflicts: conflicts.length > 0,
          conflict_count: conflicts.length,
          conflicts: conflicts.map(apt => ({
            id: apt.id,
            customer: apt.customer,
            start_time: apt.start_time,
            end_time: apt.end_time
          })),
          slot_available: slotAvailable,
          can_schedule: conflicts.length === 0 && slotAvailable
        }));
        
      } catch (error) {
        console.error('❌ Error checking appointment conflicts:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    }
    
    // Auto-schedule appointments with smart algorithm
    else if (pathname === '/api/appointments/auto-schedule' && req.method === 'POST') {
      try {
        const body = await new Promise((resolve, reject) => {
          let data = '';
          req.on('data', chunk => data += chunk);
          req.on('end', () => resolve(JSON.parse(data)));
          req.on('error', reject);
        });
        
        const { customer_id, provider_id, service_id, preferred_date, preferred_time, duration } = body;
        if (!customer_id || !provider_id || !service_id || !duration) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'customer_id, provider_id, service_id, and duration required' }));
          return;
        }
        
        // Find available time slots
        const availableSlots = await findAvailableSlots(provider_id, preferred_date, duration);
        
        if (availableSlots.length === 0) {
          // Add to waitlist if no slots available
          const waitlistEntry = {
            id: generateId(),
            customer_id,
            provider_id,
            service_id,
            requested_date: preferred_date,
            requested_time: preferred_time,
            duration,
            priority: 'normal',
            created_at: new Date().toISOString(),
            status: 'waiting'
          };
          
          const waitlist = loadLocalData('waitlist') || [];
          waitlist.push(waitlistEntry);
          await saveLocalData('waitlist', waitlist);
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            scheduled: false,
            added_to_waitlist: true,
            waitlist_id: waitlistEntry.id,
            reason: 'No available slots found'
          }));
          return;
        }
        
        // Auto-schedule with first available slot
        const selectedSlot = availableSlots[0];
        const newAppointment = {
          id: generateId(),
          customer_id,
          provider_id,
          service_id,
          date: selectedSlot.date,
          start_time: selectedSlot.start_time,
          end_time: calculateEndTime(selectedSlot.start_time, duration),
          duration,
          status: 'confirmed',
          auto_scheduled: true,
          created_at: new Date().toISOString()
        };
        
        // Save appointment
        const appointments = loadLocalData('appointments') || [];
        appointments.push(newAppointment);
        await saveLocalData('appointments', appointments);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          scheduled: true,
          appointment: newAppointment,
          selected_slot: selectedSlot
        }));
        
      } catch (error) {
        console.error('❌ Error auto-scheduling appointment:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    }
    
    // Process waitlist automatically
    else if (pathname === '/api/waitlist/auto-process' && req.method === 'POST') {
      try {
        const body = await new Promise((resolve, reject) => {
          let data = '';
          req.on('data', chunk => data += chunk);
          req.on('end', () => resolve(JSON.parse(data)));
          req.on('error', reject);
        });
        
        const { provider_id, date, time_slot } = body;
        if (!provider_id || !date || !time_slot) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'provider_id, date, and time_slot required' }));
          return;
        }
        
        const waitlist = loadLocalData('waitlist') || [];
        const eligibleWaitlist = waitlist.filter(entry => 
          entry.provider_id === provider_id &&
          entry.status === 'waiting' &&
          isDateFlexible(entry.requested_date, date)
        ).sort((a, b) => {
          // Priority sorting: urgent > high > normal
          const priorityOrder = { urgent: 3, high: 2, normal: 1 };
          return (priorityOrder[b.priority] || 1) - (priorityOrder[a.priority] || 1);
        });
        
        const notifications = [];
        const updatedWaitlist = [];
        
        for (const entry of eligibleWaitlist) {
          if (hasNotificationExpired(entry)) continue;
          
          // Create auto-scheduled appointment
          const appointment = {
            id: generateId(),
            customer_id: entry.customer_id,
            provider_id: provider_id,
            service_id: entry.service_id,
            date: date,
            start_time: time_slot,
            end_time: calculateEndTime(time_slot, entry.duration),
            duration: entry.duration,
            status: 'confirmed',
            from_waitlist: true,
            waitlist_id: entry.id,
            created_at: new Date().toISOString()
          };
          
          // Save appointment
          const appointments = loadLocalData('appointments') || [];
          appointments.push(appointment);
          await saveLocalData('appointments', appointments);
          
          // Update waitlist entry
          entry.status = 'contacted';
          entry.scheduled_appointment_id = appointment.id;
          entry.contacted_at = new Date().toISOString();
          updatedWaitlist.push(entry);
          
          // Create notification for customer
          const notification = {
            id: generateId(),
            customer_id: entry.customer_id,
            type: 'waitlist_opportunity',
            method: 'sms',
            content: `Good news! A slot just opened up for your requested ${entry.service_id} service. Please confirm within 15 minutes.`,
            status: 'pending',
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()
          };
          notifications.push(notification);
        }
        
        // Save updates
        await saveLocalData('waitlist', waitlist.map(w => updatedWaitlist.find(uw => uw.id === w.id) || w));
        
        const notificationHistory = loadLocalData('notifications') || [];
        notificationHistory.push(...notifications);
        await saveLocalData('notifications', notificationHistory);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          processed: updatedWaitlist.length,
          appointments_created: updatedWaitlist.length,
          notifications_sent: notifications.length,
          waitlist_entries: updatedWaitlist
        }));
        
      } catch (error) {
        console.error('❌ Error processing waitlist:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    }
    
    // Create recurring appointments
    else if (pathname === '/api/appointments/recurring' && req.method === 'POST') {
      try {
        const body = await new Promise((resolve, reject) => {
          let data = '';
          req.on('data', chunk => data += chunk);
          req.on('end', () => resolve(JSON.parse(data)));
          req.on('error', reject);
        });
        
        const { 
          customer_id, provider_id, service_id, date, start_time, 
          duration, frequency, interval, occurrences, end_date 
        } = body;
        
        if (!customer_id || !provider_id || !service_id || !date || !start_time || !frequency) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing required fields for recurring appointment' }));
          return;
        }
        
        const recurrences = generateRecurringDates(date, frequency, interval, occurrences, end_date);
        const appointments = loadLocalData('appointments') || [];
        const recurringAppointments = [];
        const conflicts = [];
        
        for (const recurrence of recurrences) {
          const end_time = calculateEndTime(start_time, duration);
          const appointment = {
            id: generateId(),
            customer_id,
            provider_id,
            service_id,
            date: recurrence.date,
            start_time,
            end_time,
            duration,
            status: 'confirmed',
            recurring: true,
            recurring_pattern_id: generateId(),
            created_at: new Date().toISOString()
          };
          
          // Check for conflicts before adding
          const hasConflict = appointments.some(apt => 
            apt.provider_id === provider_id &&
            apt.date === recurrence.date &&
            (start_time === apt.start_time || timesOverlap(start_time, end_time, apt.start_time, apt.end_time))
          );
          
          if (hasConflict) {
            conflicts.push(recurrence.date);
          } else {
            appointments.push(appointment);
            recurringAppointments.push(appointment);
          }
        }
        
        await saveLocalData('appointments', appointments);
        
        // Save recurring pattern
        const pattern = {
          id: generateId(),
          customer_id,
          provider_id,
          service_id,
          start_date: date,
          end_date: end_date || null,
          frequency,
          interval,
          occurrences: recurringAppointments.length,
          created_at: new Date().toISOString()
        };
        
        const patterns = loadLocalData('recurring-patterns') || [];
        patterns.push(pattern);
        await saveLocalData('recurring-patterns', patterns);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          created: recurringAppointments.length,
          conflicts: conflicts.length,
          conflicted_dates: conflicts,
          pattern_id: pattern.id,
          appointments: recurringAppointments
        }));
        
      } catch (error) {
        console.error('❌ Error creating recurring appointments:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    }
    
    // Get recurring appointment patterns
    else if (pathname === '/api/appointments/patterns' && req.method === 'GET') {
      const customerId = url.searchParams.get('customer_id');
      const providerId = url.searchParams.get('provider_id');
      
      const patterns = loadLocalData('recurring-patterns') || [];
      let filteredPatterns = patterns;
      
      if (customerId) {
        filteredPatterns = filteredPatterns.filter(p => p.customer_id === customerId);
      }
      if (providerId) {
        filteredPatterns = filteredPatterns.filter(p => p.provider_id === providerId);
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(filteredPatterns));
    }
    
    // Update recurring appointment pattern
    else if (pathname.startsWith('/api/appointments/recurring/') && req.method === 'PUT') {
      try {
        const patternId = pathname.split('/').pop();
        const body = await new Promise((resolve, reject) => {
          let data = '';
          req.on('data', chunk => data += chunk);
          req.on('end', () => resolve(JSON.parse(data)));
          req.on('error', reject);
        });
        
        const patterns = loadLocalData('recurring-patterns') || [];
        const patternIndex = patterns.findIndex(p => p.id === patternId);
        
        if (patternIndex === -1) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Recurring pattern not found' }));
          return;
        }
        
        patterns[patternIndex] = { ...patterns[patternIndex], ...body };
        await saveLocalData('recurring-patterns', patterns);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          pattern: patterns[patternIndex] 
        }));
        
      } catch (error) {
        console.error('❌ Error updating recurring pattern:', error);
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

// ========================================
// ENHANCED APPOINTMENT HELPER FUNCTIONS
// ========================================

function timesOverlap(start1, end1, start2, end2) {
  const toMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
  const s1 = toMinutes(start1);
  const e1 = toMinutes(end1);
  const s2 = toMinutes(start2);
  const e2 = toMinutes(end2);
  
  return s1 < e2 && s2 < e1;
}

function calculateEndTime(startTime, duration) {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + duration;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
}

function isTimeWithinSlot(appointmentStart, appointmentEnd, slotStart, slotDuration) {
  const appointmentStartMins = timeToMinutes(appointmentStart);
  const appointmentEndMins = timeToMinutes(appointmentEnd);
  const slotStartMins = timeToMinutes(slotStart);
  const slotEndMins = slotStartMins + slotDuration;
  
  return appointmentStart >= slotStartMins && appointmentEnd <= slotEndMins;
}

function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

async function findAvailableSlots(providerId, date, duration) {
  const appointments = loadLocalData('appointments') || [];
  const providerSchedule = loadLocalData(`provider-${providerId}-schedule`) || {};
  
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const daySchedule = providerSchedule[dayOfWeek] || [];
  
  const availableSlots = [];
  
  for (const slot of daySchedule) {
    if (slot.available) {
      const slotStartMins = timeToMinutes(slot.time);
      const slotEndMins = slotStartMins + slot.duration;
      const appointmentEndMins = slotStartMins + duration;
      
      // Check if appointment fits in slot
      if (appointmentEndMins <= slotEndMins) {
        // Check for conflicts
        const hasConflict = appointments.some(apt => 
          apt.provider_id === providerId &&
          apt.date === date &&
          timesOverlap(
            slot.time,
            `${Math.floor(appointmentEndMins / 60).toString().padStart(2, '0')}:${(appointmentEndMins % 60).toString().padStart(2, '0')}`,
            apt.start_time,
            apt.end_time
          )
        );
        
        if (!hasConflict) {
          availableSlots.push({
            date,
            start_time: slot.time,
            duration: slot.duration,
            available_minutes: slot.duration - duration
          });
        }
      }
    }
  }
  
  return availableSlots;
}

function isDateFlexible(requestedDate, availableDate) {
  const requested = new Date(requestedDate);
  const available = new Date(availableDate);
  const daysDiff = Math.abs(available - requested) / (1000 * 60 * 60 * 24);
  return daysDiff <= 7; // Within 7 days
}

function hasNotificationExpired(waitlistEntry) {
  if (!waitlistEntry.created_at) return false;
  const created = new Date(waitlistEntry.created_at);
  const now = new Date();
  const hoursDiff = (now - created) / (1000 * 60 * 60);
  return hoursDiff > 168; // Expire after 7 days
}

function generateRecurringDates(startDate, frequency, interval, occurrences, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);
  const targetDate = endDate ? new Date(endDate) : null;
  
  for (let i = 0; i < occurrences; i++) {
    if (targetDate && currentDate > targetDate) break;
    
    dates.push({ date: currentDate.toISOString().split('T')[0] });
    
    // Calculate next date based on frequency
    switch (frequency) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + (interval || 1));
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7 * (interval || 1));
        break;
      case 'biweekly':
        currentDate.setDate(currentDate.getDate() + 14 * (interval || 1));
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + (interval || 1));
        break;
      case 'yearly':
        currentDate.setFullYear(currentDate.getFullYear() + (interval || 1));
        break;
    }
  }
  
  return dates;
}

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