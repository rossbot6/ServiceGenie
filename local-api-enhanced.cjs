// Enhanced ServiceGenie API with JSON File Fallback
const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const PORT = 3001;
const DATA_FILE = './local-data.json';

// Fallback data for when database is not available
const fallbackData = {
  providers: [
    {
      id: 1,
      name: 'Emma Wilson',
      email: 'emma@servicegenie.com',
      phone: '(212) 555-0101',
      specialty: 'Senior Colorist',
      bio: 'Specialist in balayage and color corrections with 8 years experience',
      avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
      is_active: true,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Marcus Thompson',
      email: 'marcus@servicegenie.com', 
      phone: '(212) 555-0102',
      specialty: 'Master Stylist',
      bio: 'Expert in cuts and styling for all hair types',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      is_active: true,
      created_at: new Date().toISOString()
    }
  ],
  customers: [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      notes: 'Prefers morning appointments',
      total_spent: 850,
      visit_count: 12,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '(555) 234-5678',
      notes: 'Allergic to certain hair products',
      total_spent: 620,
      visit_count: 8,
      created_at: new Date().toISOString()
    }
  ],
  services: [
    { id: 1, name: 'Full Balayage', price: 180, duration: 120, category: 'Color' },
    { id: 2, name: "Women's Haircut", price: 85, duration: 60, category: 'Cut' },
    { id: 3, name: 'Root Touch-up', price: 95, duration: 90, category: 'Color' },
    { id: 4, name: 'Deep Conditioning', price: 45, duration: 30, category: 'Treatment' }
  ],
  locations: [
    { id: 1, name: 'Downtown Salon', address: '123 Main St, New York, NY', phone: '(212) 555-0123' },
    { id: 2, name: 'Brooklyn Location', address: '456 Bedford Ave, Brooklyn, NY', phone: '(718) 555-0456' }
  ]
};

// File-based persistence system
let localData = {};

function loadFileData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
      localData = JSON.parse(fileContent);
      console.log(`📦 Loaded local file with ${Object.keys(localData).length} data keys`);
    } else {
      console.log('🆕 Starting with empty local file');
    }
  } catch (error) {
    console.log('Error loading file:', error.message);
    localData = {};
  }
}

function saveFileData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(localData, null, 2));
    return true;
  } catch (error) {
    console.log('Error saving file:', error.message);
    return false;
  }
}

// Function to run psql commands
function runPsql(query) {
  return new Promise((resolve, reject) => {
    const psql = spawn('docker', [
      'exec', 
      'servicegenie-postgres', 
      'psql', 
      '-U', 'postgres',
      '-d', 'postgres',
      '-t', '-A', // No headers, unaligned format
      '-c', query
    ]);
    
    let output = '';
    let error = '';
    
    psql.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    psql.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    psql.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`psql failed with code ${code}: ${error}`));
      } else {
        resolve(output.trim());
      }
    });
  });
}

// Database query function with fallback
async function queryDatabase(sql) {
  try {
    const result = await runPsql(sql);
    return { status: 'success', data: result };
  } catch (error) {
    console.warn('Database query failed, using fallback:', error.message);
    return { status: 'error', error: error.message };
  }
}

// Provider operations
async function getProviders() {
  const query = await queryDatabase(`SELECT id, name, email, phone, specialty, bio, avatar_url, is_active, created_at FROM providers ORDER BY name`);
  
  if (query.status === 'error') {
    // Return fallback providers with saved status
    return fallbackData.providers.map(p => ({
      ...p,
      status: localData[`provider-${p.id}-status`] || 'available',
      status_notes: localData[`provider-${p.id}-status-notes`] || ''
    }));
  }
  
  return formatQueryResult(query.data, ['id', 'name', 'email', 'phone', 'specialty', 'bio', 'avatar_url', 'is_active', 'created_at'])
    .map(p => ({
      ...p,
      status: localData[`provider-${p.id}-status`] || 'available',
      status_notes: localData[`provider-${p.id}-status-notes`] || ''
    }));
}

async function updateProviderStatus(providerId, status, notes = '') {
  // Save to localData
  const key = `provider-${providerId}-status`;
  const notesKey = `provider-${providerId}-status-notes`;
  
  localData[key] = status;
  localData[notesKey] = notes;
  
  if (saveFileData()) {
    console.log(`Provider ${providerId} status updated: ${status}`);
    return { status: 'success', message: 'Status updated', providerId, status, notes };
  } else {
    return { status: 'error', message: 'Failed to save status' };
  }
}

// Helper function to format query results
function formatQueryResult(result, columns) {
  if (!result || result === '') return [];
  
  return result.split('\n').filter(row => row.trim()).map(row => {
    const values = row.split('|');
    const obj = {};
    columns.forEach((col, i) => {
      obj[col] = values[i] ? values[i].trim() : null;
    });
    return obj;
  });
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;
  const method = req.method;
  
  try {
    // Health check
    if (pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        database: 'fallback-mode',
        localDataKeys: Object.keys(localData).length,
        dataFile: DATA_FILE
      }));
      return;
    }
    
    // Get all providers
    if (pathname === '/api/providers' && method === 'GET') {
      const providers = await getProviders();
      res.writeHead(200);
      res.end(JSON.stringify(providers));
      return;
    }
    
    // Update provider status
    if (pathname.match(/^\/api\/providers\/\d+\/status$/) && method === 'PUT') {
      const providerId = pathname.split('/')[3];
      const body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => resolve(JSON.parse(data)));
        req.on('error', reject);
      });
      
      if (!body.status) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Status is required' }));
        return;
      }
      
      const result = await updateProviderStatus(providerId, body.status, body.notes || '');
      res.writeHead(result.status === 'success' ? 200 : 500);
      res.end(JSON.stringify(result));
      return;
    }
    
    // Get all customers
    if (pathname === '/api/customers' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify(fallbackData.customers));
      return;
    }
    
    // Get all services
    if (pathname === '/api/services' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify(fallbackData.services));
      return;
    }
    
    // Get appointments for provider and date
    if (pathname === '/api/appointments' && method === 'GET') {
      const providerId = url.searchParams.get('providerId');
      const date = url.searchParams.get('date');
      
      // Mock appointments
      const mockAppointments = [
        { id: 1, time: '10:00 AM', customer: 'John Smith', service: 'Full Balayage', price: 180, status: 'confirmed' },
        { id: 2, time: '1:00 PM', customer: 'Sarah Johnson', service: "Women's Haircut", price: 85, status: 'confirmed' },
        { id: 3, time: '3:30 PM', customer: 'Michael Davis', service: 'Root Touch-up', price: 95, status: 'pending' }
      ];
      
      res.writeHead(200);
      res.end(JSON.stringify(mockAppointments));
      return;
    }
    
    // Location settings endpoints
    if (pathname === '/api/locations' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify(fallbackData.locations));
      return;
    }
    
    if (pathname.match(/^\/api\/locations\/\d+$/) && method === 'PUT') {
      const locationId = pathname.split('/')[3];
      const body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => resolve(JSON.parse(data)));
        req.on('error', reject);
      });
      
      // Save location settings locally
      const settingsKey = `location-${locationId}-settings`;
      localData[settingsKey] = JSON.stringify(body);
      
      if (saveFileData()) {
        res.writeHead(200);
        res.end(JSON.stringify({ status: 'success', message: 'Location settings updated', locationId }));
      } else {
        res.writeHead(500);
        res.end(JSON.stringify({ status: 'error', message: 'Failed to save settings' }));
      }
      return;
    }
    
    // Provider schedules endpoints
    if (pathname.match(/^\/api\/providers\/\d+\/schedule$/) && method === 'GET') {
      const providerId = pathname.split('/')[3];
      const scheduleKey = `provider-${providerId}-schedule`;
      const savedSchedule = localData[scheduleKey];
      
      if (savedSchedule) {
        res.writeHead(200);
        res.end(JSON.stringify(JSON.parse(savedSchedule)));
      } else {
        // Default schedule
        const defaultSchedule = {
          monday: [true, true, true, true, true, true, true, true],
          tuesday: [true, true, true, true, true, true, true, true],
          wednesday: [true, true, true, true, true, true, true, true],
          thursday: [true, true, true, true, true, true, true, true],
          friday: [true, true, true, true, true, true, true, true],
          saturday: [true, true, true, true, false, false, false, false],
          sunday: [false, false, false, false, false, false, false, false]
        };
        res.writeHead(200);
        res.end(JSON.stringify(defaultSchedule));
      }
      return;
    }
    
    if (pathname.match(/^\/api\/providers\/\d+\/schedule$/) && method === 'PUT') {
      const providerId = pathname.split('/')[3];
      const body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => resolve(JSON.parse(data)));
        req.on('error', reject);
      });
      
      const scheduleKey = `provider-${providerId}-schedule`;
      localData[scheduleKey] = JSON.stringify(body);
      
      if (saveFileData()) {
        res.writeHead(200);
        res.end(JSON.stringify({ status: 'success', message: 'Schedule updated', providerId }));
      } else {
        res.writeHead(500);
        res.end(JSON.stringify({ status: 'error', message: 'Failed to save schedule' }));
      }
      return;
    }
    
    // Blocked time management
    if (pathname.match(/^\/api\/providers\/\d+\/blocked-times$/) && method === 'GET') {
      const providerId = pathname.split('/')[3];
      const key = `provider-${providerId}-blocked-times`;
      const blockedTimes = localData[key] ? JSON.parse(localData[key]) : [];
      
      res.writeHead(200);
      res.end(JSON.stringify(blockedTimes));
      return;
    }
    
    if (pathname.match(/^\/api\/providers\/\d+\/blocked-times$/) && method === 'PUT') {
      const providerId = pathname.split('/')[3];
      const body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => resolve(JSON.parse(data)));
        req.on('error', reject);
      });
      
      const key = `provider-${providerId}-blocked-times`;
      localData[key] = JSON.stringify(body);
      
      if (saveFileData()) {
        res.writeHead(200);
        res.end(JSON.stringify({ status: 'success', message: 'Blocked times updated', providerId }));
      } else {
        res.writeHead(500);
        res.end(JSON.stringify({ status: 'error', message: 'Failed to save blocked times' }));
      }
      return;
    }
    
    // API info endpoint
    if (pathname === '/api' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        name: 'ServiceGenie API',
        version: '1.0',
        status: 'running',
        features: ['providers', 'customers', 'services', 'appointments', 'locations', 'schedules', 'status-management'],
        dataPersistence: 'local-file',
        localDataKeys: Object.keys(localData).length
      }));
      return;
    }
    
    // 404 for unknown endpoints
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Endpoint not found', method, pathname }));
    
  } catch (error) {
    console.error('API Error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal server error', message: error.message }));
  }
});

// Initialize
loadFileData();

server.listen(PORT, () => {
  console.log(`🚀 ServiceGenie Local API running on http://localhost:${PORT}`);
  console.log(`💾 Using JSON file persistence at ${DATA_FILE}`);
  console.log('🌐 Available endpoints:');
  console.log('  GET  /health                       - Health check');
  console.log('  GET  /api                          - API info');
  console.log('  GET  /api/providers                - Get all providers');
  console.log('  PUT  /api/providers/:id/status     - Update provider status');
  console.log('  GET  /api/customers                - Get all customers');
  console.log('  GET  /api/services                 - Get all services');
  console.log('  GET  /api/appointments             - Get appointments');
  console.log('  GET  /api/locations                - Get all locations');
  console.log('  PUT  /api/locations/:id            - Update location settings');
  console.log('  GET  /api/providers/:id/schedule   - Get provider schedule');
  console.log('  PUT  /api/providers/:id/schedule   - Update provider schedule');
  console.log('  GET  /api/providers/:id/blocked-times  - Get blocked times');
  console.log('  PUT  /api/providers/:id/blocked-times  - Update blocked times\n');
});