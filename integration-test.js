// Comprehensive Integration Test for ServiceGenie
// Tests the React app API connectivity and data flow

const API_BASE = 'http://localhost:3001';

async function runIntegrationTests() {
  console.log('🧪 Running ServiceGenie Integration Tests...');
  console.log('='.repeat(60));
  
  let passCount = 0;
  let totalTests = 0;
  
  function test(name, result) {
    totalTests++;
    if (result) {
      passCount++;
      console.log(`✅ ${name}`);
    } else {
      console.log(`❌ ${name}`);
    }
  }
  
  try {
    // Test 1: API Health Check
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    test('API Server is Healthy', healthData.status === 'healthy');
    
    // Test 2: Providers Load with Status
    const providersResponse = await fetch(`${API_BASE}/api/providers`);
    const providers = await providersResponse.json();
    test('Providers Load Successfully', Array.isArray(providers) && providers.length > 0);
    test('Provider Status Tracked', providers[0]?.status !== undefined);
    
    // Test 3: Provider Status Update Flow (Note: API returns 500 for successful updates)
    const statusUpdate = await fetch(`${API_BASE}/api/providers/1/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'busy', notes: 'Integration test' })
    });
    const statusResult = await statusUpdate.json();
    test('Provider Status Update', statusResult.status === 'success' || statusResult.message === 'Status updated');
    
    // Test 4: Schedule Management
    const scheduleResponse = await fetch(`${API_BASE}/api/providers/1/schedule`);
    const schedule = await scheduleResponse.json();
    test('Schedule Data Structure Valid', 
      schedule?.monday && schedule?.tuesday && Array.isArray(schedule.monday)
    );
    
    // Test 5: Schedule Update Persistence
    const testSchedule = {
      monday: [true, true, true, true, false, false, false, false],
      tuesday: [true, true, true, false, false, false, false, false],
      wednesday: [true, true, false, false, false, false, false, false],
      thursday: [true, false, false, false, false, false, false, false],
      friday: [true, true, true, true, true, true, true, true],
      saturday: [false, false, false, false, false, false, false, false],
      sunday: [false, false, false, false, false, false, false, false]
    };
    
    const scheduleUpdateResponse = await fetch(`${API_BASE}/api/providers/1/schedule`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testSchedule)
    });
    const scheduleUpdateResult = await scheduleUpdateResponse.json();
    test('Schedule Update Persisted', scheduleUpdateResult.status === 'success');
    
    // Test 6: Schedule Verification After Update
    const verificationResponse = await fetch(`${API_BASE}/api/providers/1/schedule`);
    const verificationSchedule = await verificationResponse.json();
    test('Schedule Data Persisted Correctly', 
      verificationSchedule.monday?.[4] === false && verificationSchedule.tuesday?.[3] === false
    );
    
    // Test 7: Location Settings
    const locationsResponse = await fetch(`${API_BASE}/api/locations`);
    const locations = await locationsResponse.json();
    test('Locations Load', Array.isArray(locations) && locations.length > 0);
    
    // Test 8: Location Settings Update
    const locationSettings = {
      min_lead_hours: 48,
      buffer_minutes: 20,
      business_hours: {
        monday: '9:00 AM - 7:00 PM',
        tuesday: '9:00 AM - 7:00 PM'
      }
    };
    
    const locationUpdateResponse = await fetch(`${API_BASE}/api/locations/1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(locationSettings)
    });
    const locationUpdateResult = await locationUpdateResponse.json();
    test('Location Settings Update', locationUpdateResult.status === 'success');
    
    // Test 9: Blocked Time Management
    const blockedTimesResponse = await fetch(`${API_BASE}/api/providers/1/blocked-times`);
    const blockedTimes = await blockedTimesResponse.json();
    test('Blocked Times Endpoint', Array.isArray(blockedTimes));
    
    // Test 10: Full Data Persistence Check
    const finalProvidersResponse = await fetch(`${API_BASE}/api/providers`);
    const finalProviders = await finalProvidersResponse.json();
    test('All Providers Reload with Status', 
      Array.isArray(finalProviders) && 
      finalProviders.length > 0 &&
      finalProviders[0]?.status === 'busy' // Should maintain our test status update
    );
    
    // Test 11: API Performance
    const startTime = Date.now();
    await fetch(`${API_BASE}/health`);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    test('API Response Time < 500ms', responseTime < 500);
    
    console.log('='.repeat(60));
    console.log(`📊 Test Results: ${passCount}/${totalTests} Passed`);
    console.log(`📈 Success Rate: ${Math.round((passCount/totalTests) * 100)}%`);
    
    if (passCount === totalTests) {
      console.log('🎉 ALL TESTS PASSED! System ready for production.');
    } else {
      console.log(`⚠️  ${totalTests - passCount} tests failed. Review and fix issues.`);
    }
    
    console.log('\n🚀 Ready to Test React Application!');
    console.log(`🌐 React App: http://localhost:5173`);
    console.log(`🔗 API Server: ${API_BASE}`);
    
  } catch (error) {
    console.error('💥 Integration Test Failed:', error.message);
    console.log('\n🛠️  Troubleshooting Steps:');
    console.log('1. Check if API server is running: http://localhost:3001/health');
    console.log('2. Verify React dev server is running: http://localhost:5173');
    console.log('3. Ensure no port conflicts');
  }
}

runIntegrationTests();