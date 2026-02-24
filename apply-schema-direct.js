// Direct PostgreSQL Schema Application Script
import { readFileSync } from 'fs';
import { Client } from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PostgreSQL configuration (from simple-postgres-test.js)
const pgConfig = {
  host: 'localhost',
  port: 54322,
  user: 'postgres',
  password: 'postgres',
  database: 'postgres'
};

async function applySchema() {
  console.log('🐘 Starting Direct PostgreSQL Schema Application...\n');
  
  // Read the schema file
  const schemaPath = path.join(__dirname, 'supabase-schema.sql');
  let schemaSQL;
  
  try {
    schemaSQL = readFileSync(schemaPath, 'utf8');
    console.log('✅ Schema file loaded successfully');
    console.log(`📄 Schema size: ${schemaSQL.length} characters\n`);
  } catch (err) {
    console.error('❌ Failed to read schema file:', err.message);
    return false;
  }
  
  // Create PostgreSQL client
  const client = new Client(pgConfig);
  
  try {
    // Connect to PostgreSQL
    console.log('🔌 Connecting to PostgreSQL...');
    await client.connect();
    console.log('✅ Connected to PostgreSQL successfully\n');
    
    // Split SQL into individual statements
    const statements = schemaSQL
      .split('\n')
      .filter(line => {
        const trimmed = line.trim();
        return trimmed.length > 0 && 
               !trimmed.startsWith('--') && 
               !trimmed.startsWith('BEGIN') && 
               !trimmed.includes('BEGIN');
      })
      .join('\n')
      .split(/;[\s]*\n/)
      .map(stmt => stmt.trim())
      .filter(stmt => {
        // Filter out empty statements and those with only comments
        const words = stmt.split(/\s+/).filter(w => !w.startsWith('--') && w.trim() !== '');
        return words.length > 0;
      });
    
    console.log(`📋 Found ${statements.length} potentially valid SQL statements\n`);
    
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (!statement.trim()) continue;
      
      try {
        // Execute the SQL statement
        await client.query(statement + ';');
        successCount++;
        
        // Log progress for first few and every 10 statements
        if (i < 5 || i % 10 === 0) {
          const preview = statement.substring(0, 60).replace(/\n/g, ' ') + (statement.length > 60 ? '...' : '');
          console.log(`✅ Statement ${i + 1}: ${preview}`);
        }
        
      } catch (err) {
        errorCount++;
        const errorMsg = `Statement ${i + 1}: ${err.message}`;
        errors.push(errorMsg);
        
        // Show errors for first few statements for debugging
        if (i < 3 || errors.length <= 5) {
          const preview = statement.substring(0, 80).replace(/\n/g, ' ') + (statement.length > 80 ? '...' : '');
          console.log(`⚠️  Error in statement ${i + 1}: ${preview}`);
          console.log(`    Error: ${err.message}`);
        }
      }
    }
    
    console.log('\n📊 Execution Summary:');
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ⚠️  Errors: ${errorCount}`);
    console.log(`   📋 Total processed: ${statements.length}`);
    
    if (errors.length > 0) {
      console.log('\n⚠️  Error Summary (first 3):');
      errors.slice(0, 3).forEach(err => console.log(`   ${err}`));
    }
    
    if (successCount > 0) {
      console.log('\n🎉 Schema application completed successfully!');
      
      // List created tables
      try {
        const tableResult = await client.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          ORDER BY table_name
        `);
        console.log('\n📋 Created Tables:');
        tableResult.rows.forEach(row => {
          console.log(`   • ${row.table_name}`);
        });
        
      } catch (err) {
        console.log('⚠️  Could not list tables:', err.message);
      }
      
      return true;
    } else {
      console.log('\n❌ No statements executed successfully');
      return false;
    }
    
  } catch (err) {
    console.error('💥 Connection or execution failed:', err.message);
    return false;
  } finally {
    // Close the connection
    try {
      await client.end();
      console.log('🔌 Database connection closed');
    } catch (err) {
      console.log('⚠️  Error closing connection:', err.message);
    }
  }
}

// Execute the main function
applySchema()
  .then(success => {
    if (!success) {
      console.log('\n💡 Manual troubleshooting steps:');
      console.log('   1. Check PostgreSQL is running on port 54322');
      console.log('   2. Verify credentials: postgres/postgres');
      console.log('   3. Try running schema manually in PostgreSQL client');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('💥 Unexpected error:', err);
    process.exit(1);
  });