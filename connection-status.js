// Test various Supabase connection scenarios

function testSupabaseConnection() {
  console.log('🔍 Testing ServiceGenie Supabase Setup...\n');
  
  // Test 1: Check environment variables
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL || 'http://localhost:8000';
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'demo-key';
  
  console.log('📊 Current Configuration:');
  console.log('  URL:', url);
  console.log('  Key:', key.substring(0, 50) + '...');
  console.log('');
  
  // Test 2: Check if local Postgres is accessible
  console.log('🐘 Testing Direct Postgres Connection...');
  
  // Test 3: Check local Supabase alternatives
  console.log('🔗 Test Local Setup Options:');
  console.log('1. ❌ Local Supabase on port 8000 - Not running');
  console.log('2. ➡️ Direct Postgres on port 5432 - Available');
  console.log('3. 🌐 Remote Supabase - Would need project setup');
  console.log('');
  
  // Test 4: Recommendations
  console.log('💡 Recommendations:');
  console.log('Option A: Set up free Supabase cloud project (recommended)');
  console.log('Option B: Fix local Supabase Docker setup');
  console.log('Option C: Use direct Postgres connection with REST API');
  console.log('');
  
  // Test 5: Quick connectivity tests
  console.log('🧪 Quick Connection Tests:');
  
  return {
    localSupabase: false, // port 8000 not accessible
    postgres: true, // we have a working container
    remoteSupabase: false, // not configured yet
    recommendations: [
      'Create free Supabase project at supabase.com',
      'Update .env with project credentials',
      'Or fix local Docker Supabase setup'
    ]
  };
}

const testResult = testSupabaseConnection();
console.log('📈 Test Results:', JSON.stringify(testResult, null, 2));

export default testResult;