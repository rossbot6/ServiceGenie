// Debug API connection issues
import { Pool } from 'pg';
import express from 'express';

console.log('🔍 Starting API Debug...');

// PostgreSQL connection
const pool = new Pool({
  user: 'supabase_admin',
  host: 'localhost',
  database: 'postgres',
  password: '64a500a43a76c5570bc38d8813a4b89b',
  port: 5432,
});

async function testDatabase() {
  try {
    console.log('🔌 Testing database connection...');
    const client = await pool.connect();
    console.log('✅ Database connected successfully!');
    
    // Test query that should work
    console.log('📊 Testing providers query...');
    const result = await client.query('SELECT id, name, email FROM providers LIMIT 3');
    console.log('✅ Providers query result:', result.rows);
    
    client.release();
    console.log('✅ Database test completed successfully!');
    
    return { success: true, data: result.rows };
    
  } catch (err) {
    console.error('❌ Database test failed:', err.message);
    return { success: false, error: err.message };
  } finally {
    await pool.end();
  }
}

// Simple test function
testDatabase().then(result => {
  console.log('\n📈 Final Result:', JSON.stringify(result, null, 2));
}).catch(err => {
  console.error('💥 Debug failed:', err);
});