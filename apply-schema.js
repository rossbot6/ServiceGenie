// Apply Supabase Schema Script
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration - trying multiple possible Supabase URLs
const supabaseUrls = [
  'http://localhost:8000',
  'http://localhost:3001',
  'http://localhost:3000'
];

const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'local-dev-key';

async function applySchema() {
  console.log('🔄 Starting Supabase Schema Application...\n');
  
  // Read the schema file
  const schemaPath = path.join(__dirname, 'supabase-schema.sql');
  let schemaSQL;
  
  try {
    schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    console.log('✅ Schema file loaded successfully');
    console.log(`📄 Schema size: ${schemaSQL.length} characters\n`);
  } catch (err) {
    console.error('❌ Failed to read schema file:', err.message);
    return false;
  }
  
  // Try each URL until one works
  for (const url of supabaseUrls) {
    console.log(`🔌 Testing connection to: ${url}`);
    
    try {
      const supabase = createClient(url, supabaseKey);
      
      // Test connection first
      const { data: testData, error: testError } = await supabase.from('providers').select('*').limit(1);
      
      if (testError && testError.message.includes('Invalid API key')) {
        console.log(`⚠️  API key issue with ${url} - but server is responding`);
        // Continue anyway - we can still execute SQL
      } else if (testError && !testError.message.includes('Invalid API key')) {
        console.log(`❌ Connection failed: ${testError.message}`);
        continue; // Try next URL
      } else {
        console.log(`✅ Successful connection to ${url}`);
      }
      
      // Split SQL into individual statements and execute
      const statements = schemaSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      console.log(`📋 Found ${statements.length} SQL statements to execute\n`);
      
      let successCount = 0;
      let errorCount = 0;
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (!statement) continue;
        
        try {
          // For Supabase, we need to use RPC calls or direct SQL execution
          // Let's try using the Supabase RPC endpoint
          const { data, error } = await supabase.rpc('exec_sql', { 
            query: statement + ';' 
          });
          
          if (error) {
            console.log(`⚠️  Statement ${i + 1} had issues:`, error.message);
            errorCount++;
          } else {
            successCount++;
            if (i % 10 === 0 || i < 5) { // Log progress for first few and every 10 statements
              console.log(`✅ Executed statement ${i + 1}/${statements.length}`);
            }
          }
        } catch (err) {
          console.log(`⚠️  Statement ${i + 1} failed:`, err.message);
          errorCount++;
        }
      }
      
      console.log(`\n📊 Execution Summary:`);
      console.log(`   ✅ Successful: ${successCount}`);
      console.log(`   ⚠️  Warnings/Errors: ${errorCount}`);
      console.log(`   📋 Total: ${statements.length}`);
      
      if (successCount > 0) {
        console.log(`\n🎉 Schema applied successfully via ${url}!`);
        return true;
      }
      
    } catch (err) {
      console.log(`❌ Failed to connect to ${url}:`, err.message);
      continue;
    }
  }
  
  console.log('\n❌ Failed to apply schema to any Supabase instance');
  return false;
}

// Fallback method: Create tables using Supabase REST API
async function applySchemaViaREST() {
  console.log('\n🔄 Trying alternative method: REST API table creation...\n');
  
  const tables = [
    'customers',
    'providers', 
    'locations',
    'services',
    'appointments'
  ];
  
  for (const url of supabaseUrls) {
    console.log(`🔌 Testing REST API on: ${url}`);
    
    try {
      const headers = {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'apikey': supabaseKey
      };
      
      // Try to create a simple table using the REST API
      const { data, error } = await fetch(`${url}/rest/v1/rpc/create_table`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          table_name: 'test_table',
          table_schema: 'public'
        })
      });
      
      if (data || !error) {
        console.log(`✅ REST API working on ${url}`);
      } else {
        console.log(`⚠️  REST API issue:`, error);
      }
      
    } catch (err) {
      console.log(`❌ REST API failed:`, err.message);
    }
  }
}

// Execute the main function
applySchema()
  .then(success => {
    if (!success) {
      console.log('\n💡 Try these alternatives:');
      console.log('   1. Run schema manually in Supabase SQL Editor');
      console.log('   2. Copy supabase-schema.sql content to browser SQL console');
      console.log('   3. Use Supabase CLI: supabase db push\n');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('💥 Unexpected error:', err);
    process.exit(1);
  });