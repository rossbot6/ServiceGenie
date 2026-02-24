// Direct PostgreSQL connection test
import { Pool } from 'pg';

console.log('🐘 Testing Direct PostgreSQL Connection...');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 54322, // Using the new port
});

async function testPostgres() {
  try {
    console.log('🔌 Connecting to PostgreSQL...');
    const client = await pool.connect();
    console.log('✅ Connected successfully!');
    
    // Test query
    const result = await client.query('SELECT version();');
    console.log('📊 PostgreSQL Version:', result.rows[0].version);
    
    // Test if our ServiceGenie schema exists
    const tablesResult = await client.query(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;"
    );
    console.log('📋 Database Tables:', tablesResult.rows.map(row => row.tablename).join(', '));
    
    // Test specific ServiceGenie tables
    const customerCount = await client.query('SELECT COUNT(*) FROM customers;');
    console.log('👥 Customer Count:', customerCount.rows[0].count);
    
    const providerCount = await client.query('SELECT COUNT(*) FROM providers;');
    console.log('💇 Provider Count:', providerCount.rows[0].count);
    
    client.release();
    console.log('✅ PostgreSQL connection test completed successfully!');
    
    return {
      connected: true,
      hasSchema: true,
      customerCount: parseInt(customerCount.rows[0].count),
      providerCount: parseInt(providerCount.rows[0].count)
    };
    
  } catch (err) {
    console.error('❌ PostgreSQL connection failed:', err.message);
    return {
      connected: false,
      error: err.message
    };
  } finally {
    await pool.end();
  }
}

testPostgres().then(result => {
  console.log('\n📈 Test Result:', JSON.stringify(result, null, 2));
}).catch(err => {
  console.error('💥 Test failed:', err);
});

export default testPostgres;