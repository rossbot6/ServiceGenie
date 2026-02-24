// Schema Application via Local API
import fs from 'fs';
import http from 'http';

async function applySchemaViaAPI() {
  console.log('📡 Starting Schema Application via Local API...\n');
  
  const schemaPath = './supabase-schema.sql';
  let schemaSQL;
  
  try {
    schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    console.log('✅ Schema file loaded successfully');
    console.log(`📄 Schema size: ${schemaSQL.length} characters\n`);
  } catch (err) {
    console.error('❌ Failed to read schema file:', err.message);
    return false;
  }
  
  // Test API connection
  try {
    const healthResponse = await fetch('http://localhost:3001/health');
    const healthData = await healthResponse.json();
    console.log('✅ Local API is responding:');
    console.log(`   Status: ${healthData.status}`);
    console.log(`   Database: ${healthData.database}\n`);
  } catch (err) {
    console.error('❌ Cannot connect to local API:', err.message);
    return false;
  }
  
  // Since the local API doesn't have a direct SQL execution endpoint,
  // let's use the existing endpoints to verify the API works
  // and then report what needs to be done manually
  
  const endpoints = [
    '/api/providers',
    '/api/customers', 
    '/api/services',
    '/api/appointments'
  ];
  
  console.log('🔍 Testing API endpoints:');
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://localhost:3001${endpoint}`);
      const data = await response.json();
      console.log(`✅ ${endpoint}: ${response.status} - ${Array.isArray(data) ? data.length : 'N/A'} items`);
    } catch (err) {
      console.log(`⚠️  ${endpoint}: Error - ${err.message}`);
    }
  }
  
  console.log('\n📋 Schema Status:');
  console.log('Since the local API uses Docker exec to run PostgreSQL commands,');
  console.log('you have two options to apply the schema:\n');
  
  console.log('Option 1 - Manual SQL Execution:');
  console.log('1. docker exec -it servicegenie-postgres psql -U postgres -d postgres');
  console.log('2. Copy and paste the contents of supabase-schema.sql\n');
  
  console.log('Option 2 - Use Supabase Studio:');
  console.log('1. Access Supabase Studio at http://localhost:8000/studio');
  console.log('2. Go to SQL Editor');
  console.log('3. Copy and paste the entire supabase-schema.sql file\n');
  
  return false; // Schema hasn't been applied automatically
}

// Execute the function
applySchemaViaAPI()
  .then(() => console.log('\n✨ API testing and guide completed'))
  .catch(err => console.error('💥 Error:', err));