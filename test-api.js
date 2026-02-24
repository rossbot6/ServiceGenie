// Test all API endpoints
const baseURL = 'http://localhost:3001';

async function testAPI() {
  console.log('🧪 Testing ServiceGenie API Endpoints...\n');
  
  const tests = [
    { name: 'Health Check', url: '/health' },
    { name: 'API Info', url: '/api' },
    { name: 'Providers', url: '/api/providers' },
    { name: 'Customers', url: '/api/customers' },
    { name: 'Services', url: '/api/services' },
    { name: 'Locations', url: '/api/locations' },
    { name: 'Appointments', url: '/api/appointments?providerId=1&date=2026-02-23' },
    { name: 'Provider Schedule', url: '/api/providers/1/schedule' },
  ];
  
  for (const test of tests) {
    try {
      const response = await fetch(`${baseURL}${test.url}`);
      const data = await response.json();
      
      console.log(`✅ ${test.name}: ${response.status}`);
      console.log(`   Response:`, JSON.stringify(data).substring(0, 100) + (JSON.stringify(data).length > 100 ? '...' : ''));
      
      if (test.name === 'Health Check') {
        console.log(`   Database Status: ${data.database}`);
        console.log(`   Local Data Keys: ${data.localDataKeys}`);
      }
      
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR - ${error.message}`);
    }
    console.log('');
  }
  
  // Test provider status update
  console.log('🔄 Testing Provider Status Update...');
  try {
    const response = await fetch(`${baseURL}/api/providers/1/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'busy', notes: 'Testing API integration' })
    });
    const data = await response.json();
    console.log(`✅ Provider Status Update: ${response.status}`);
    console.log(`   Response:`, data);
  } catch (error) {
    console.log(`❌ Provider Status Update: ERROR - ${error.message}`);
  }
  
  // Test provider schedule update
  console.log('\n🔄 Testing Provider Schedule Update...');
  try {
    const testSchedule = {
      monday: [true, true, true, true, false, false, false, false],
      tuesday: [true, true, true, true, true, false, false, false],
      wednesday: [true, true, true, true, true, true, false, false],
      thursday: [true, true, true, true, true, true, true, false],
      friday: [true, true, true, true, true, true, true, true],
      saturday: [false, false, false, false, false, false, false, false],
      sunday: [false, false, false, false, false, false, false, false]
    };
    
    const response = await fetch(`${baseURL}/api/providers/1/schedule`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testSchedule)
    });
    const data = await response.json();
    console.log(`✅ Provider Schedule Update: ${response.status}`);
    console.log(`   Response:`, data);
  } catch (error) {
    console.log(`❌ Provider Schedule Update: ERROR - ${error.message}`);
  }
  
  // Test location settings update
  console.log('\n🔄 Testing Location Settings Update...');
  try {
    const locationSettings = {
      bookingPolicy: { leadTime: 24, bufferTime: 15 },
      businessHours: { monday: '9:00 AM - 6:00 PM' },
      noShowPolicy: { banThreshold: 3 },
    };
    
    const response = await fetch(`${baseURL}/api/locations/1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(locationSettings)
    });
    const data = await response.json();
    console.log(`✅ Location Settings Update: ${response.status}`);
    console.log(`   Response:`, data);
  } catch (error) {
    console.log(`❌ Location Settings Update: ERROR - ${error.message}`);
  }
  
  // Verify data persistence
  console.log('\n📋 Verifying Data Persistence...');
  try {
    const response = await fetch(`${baseURL}/api/providers/1/schedule`);
    const data = await response.json();
    console.log(`✅ Schedule Persistence Check: ${response.status}`);
    console.log(`   Sample:`, { Monday: data.monday, Friday: data.friday });
  } catch (error) {
    console.log(`❌ Schedule Persistence: ERROR - ${error.message}`);
  }
  
  console.log('\n🎯 API Testing Complete!');
}

testAPI().catch(console.error);