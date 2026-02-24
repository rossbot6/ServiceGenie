// Test Supabase connection
import { createClient } from '@supabase/supabase-js';

// Test configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'http://localhost:3000';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE';

console.log('🔍 Testing Supabase Connection...');
console.log('URL:', supabaseUrl);
console.log('Key (first 50 chars):', supabaseAnonKey.substring(0, 50) + '...');

try {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  // Test basic connection
  console.log('✅ Client created successfully');
  
  // Try to fetch data
  async function testConnection() {
    try {
      console.log('📡 Attempting to fetch providers...');
      const { data, error } = await supabase.from('providers').select('*').limit(1);
      
      if (error) {
        console.log('❌ Error fetching providers:', error.message);
        console.log('Error details:', error);
        
        // Test if it's just an authentication issue vs connection issue
        if (error.message.includes('Invalid API key') || error.message.includes('JWT')) {
          console.log('🔑 Authentication issue detected - connection to server is working');
        } else {
          console.log('🌐 Connection issue - server may not be running');
        }
      } else {
        console.log('✅ Successfully connected to Supabase and fetched data!');
        console.log('Sample data:', data);
      }
    } catch (err) {
      console.log('💥 Connection failed:', err.message);
      console.log('Stack:', err.stack);
    }
  }
  
  testConnection();
  
} catch (err) {
  console.log('💥 Failed to create Supabase client:', err.message);
}