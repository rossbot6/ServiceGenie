// ServiceGenie Connection Test using our local API
import fetch from 'fetch';

console.log('🔍 Testing ServiceGenie with Local API...');
console.log('API Endpoint: http://localhost:3001');

// Test our local API endpoints
async function testLocalAPI() {
  const apiBase = 'http://localhost:3001';
  
  try {
    console.log('📡 Testing Health Check...');
    const healthResponse = await fetch(`${apiBase}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Status:', healthData);
    
    console.log('\n👨‍💼 Testing Providers API...');
    const providersResponse = await fetch(`${apiBase}/api/providers`);
    
    if (!providersResponse.ok) {
      const errorText = await providersResponse.text();
      console.log('❌ Providers API Error:', providersResponse.status, errorText);
    } else {
      const providersData = await providersResponse.json();
      console.log('✅ Providers Count:', providersData.length);
      console.log('📋 Sample Provider:', providersData[0]);
    }
    
    console.log('\n👥 Testing Customers API...');
    const customersResponse = await fetch(`${apiBase}/api/customers`);
    
    if (!customersResponse.ok) {
      const errorText = await customersResponse.text();
      console.log('❌ Customers API Error:', customersResponse.status, errorText);
    } else {
      const customersData = await customersResponse.json();
      console.log('✅ Customers Count:', customersData.length);
      console.log('📋 Sample Customer:', customersData[0]);
    }
    
    console.log('\n🛠️ Testing Services API...');
    const servicesResponse = await fetch(`${apiBase}/api/services`);
    
    if (!servicesResponse.ok) {
      const errorText = await servicesResponse.text();
      console.log('❌ Services API Error:', servicesResponse.status, errorText);
    } else {
      const servicesData = await servicesResponse.json();
      console.log('✅ Services Count:', servicesData.length);
      console.log('📋 Sample Service:', servicesData[0]);
    }
    
    console.log('\n✅ Local API Test Complete!');
    
  } catch (error) {
    console.error('💥 Connection Test Failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Check if fetch is available
if (typeof fetch === 'undefined') {
  console.log('📦 Fetch not available, trying alternative method...');
  
  // Fallback using native fetch or alternative
  const http = require('http');
  
  function simpleGet(url) {
    return new Promise((resolve, reject) => {
      const request = http.get(url, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve({ raw: data, parseError: e.message });
          }
        });
      });
      request.on('error', reject);
      request.end();
    });
  }
  
  // Test with simple HTTP requests
  simpleGet('http://localhost:3001/health')
    .then(result => {
      console.log('💚 Health Check Result:', result);
    })
    .catch(err => {
      console.error('❌ Simple HTTP Test Failed:', err.message);
    });
} else {
  testLocalAPI();
}

export default testLocalAPI;