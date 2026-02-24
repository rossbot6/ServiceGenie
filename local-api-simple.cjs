// Local ServiceGenie API using direct PostgreSQL connection
// This bypasses the problematic Supabase REST interface

const http = require('http');
const { spawn } = require('child_process');

const PORT = 3001;

// Simple HTTP server
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Parse URL
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;
  
  try {
    // Health check
    if (pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        database: 'direct-postgres'
      }));
      return;
    }
    
    // Helper function to run psql commands
    async function runPsql(query) {
      return new Promise((resolve, reject) => {
        const psql = spawn('docker', [
          'exec', 
          'servicegenie-postgres', 
          'psql', 
          '-U', 'postgres',
          '-d', 'postgres',
          '-t', '-A', // No headers, unaligned format
          '-c', query
        ]);
        
        let output = '';
        let error = '';
        
        psql.stdout.on('data', (data) => {
          output += data.toString();
        });
        
        psql.stderr.on('data', (data) => {
          error += data.toString();
        });
        
        psql.on('close', (code) => {
          if (code === 0) {
            resolve(output.trim());
          } else {
            reject(new Error(error || `psql exited with code ${code}`));
          }
        });
      });
    }
    
    // API Routes
    if (pathname === '/api/providers' && req.method === 'GET') {
      const result = await runPsql('SELECT * FROM providers ORDER BY name;');
      const rows = result.split('\n').filter(Boolean).map(row => {
        const parts = row.split('|');
        return {
          id: parts[0],
          name: parts[1],
          specialty: parts[2],
          email: parts[3],
          phone: parts[4],
          image: parts[5],
          created_at: parts[6]
        };
      });
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rows));
      return;
    }
    
    if (pathname === '/api/customers' && req.method === 'GET') {
      const result = await runPsql('SELECT * FROM customers ORDER BY name;');
      const rows = result.split('\n').filter(Boolean).map(row => {
        const parts = row.split('|');
        return {
          id: parts[0],
          name: parts[1],
          phone: parts[2],
          email: parts[3],
          notes: parts[4],
          created_at: parts[5]
        };
      });
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rows));
      return;
    }
    
    if (pathname === '/api/services' && req.method === 'GET') {
      const result = await runPsql('SELECT * FROM services ORDER BY name;');
      const rows = result.split('\n').filter(Boolean).map(row => {
        const parts = row.split('|');
        return {
          id: parts[0],
          name: parts[1],
          category: parts[2],
          duration: parts[3],
          price: parts[4],
          description: parts[5]
        };
      });
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rows));
      return;
    }
    
    if (pathname === '/api/appointments' && req.method === 'GET') {
      const { providerId, date } = Object.fromEntries(url.searchParams);
      let query = `SELECT * FROM appointments`;
      const params = [];
      
      if (providerId && date) {
        query += ` WHERE provider_id='${providerId}' AND date='${date}'`;
      } else if (providerId) {
        query += ` WHERE provider_id='${providerId}'`;
      } else if (date) {
        query += ` WHERE date='${date}'`;
      }
      
      query += ' ORDER BY date, start_time';
      
      const result = await runPsql(query);
      const rows = result.split('\n').filter(Boolean).map(row => {
        const parts = row.split('|');
        return {
          id: parts[0],
          customer_id: parts[1],
          provider_id: parts[2],
          date: parts[3],
          start_time: parts[4],
          duration: parts[5],
          status: parts[6],
          notes: parts[7],
          created_at: parts[8]
        };
      });
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rows));
      return;
    }
    
    // Communications endpoints
    if (pathname === '/api/communications' && req.method === 'GET') {
      const result = await runPsql(`
        SELECT 
          c.id, c.customer_id, c.customer_email, c.customer_phone, 
          c.type, c.category, c.subject, c.content, c.status, 
          c.sent_at, c.delivered_at, c.error_message, c.metadata,
          cust.name as customer_name
        FROM communications c
        JOIN customers cust ON c.customer_id = cust.id
        ORDER BY c.sent_at DESC;
      `);
      
      const rows = result.split('\n').filter(Boolean).map(row => {
        const parts = row.split('|');
        return {
          id: parts[0],
          customer_id: parts[1],
          customer_email: parts[2],
          customer_phone: parts[3],
          type: parts[4],
          category: parts[5],
          subject: parts[6],
          content: parts[7],
          status: parts[8],
          sent_at: parts[9],
          delivered_at: parts[10],
          error_message: parts[11],
          metadata: parts[12],
          customer_name: parts[13]
        };
      });
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rows));
      return;
    }
    
    if (pathname === '/api/communications' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const { customer_id, type, template_id, content, subject, category = 'general' } = data;
          
          // Get customer info
          const customerResult = await runPsql(`SELECT name, email, phone FROM customers WHERE id='${customer_id}';`);
          const customerRow = customerResult.split('\n').filter(Boolean)[0];
          
          if (!customerRow) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Customer not found' }));
            return;
          }
          
          const customerParts = customerRow.split('|');
          const customer_email = customerParts[1];
          const customer_phone = customerParts[2];
          
          // Create communication record
          const insertResult = await runPsql(`
            INSERT INTO communications (
              customer_id, customer_email, customer_phone, type, category,
              subject, content, status, sent_at, metadata
            ) VALUES (
              '${customer_id}', '${customer_email}', '${customer_phone}', '${type}', '${category}',
              ${subject ? `'${subject}'` : 'NULL'}, '${content}', 'sent', NOW(), '{}'
            ) RETURNING *;
          `);
          
          const newRow = insertResult.split('\n').filter(Boolean)[0];
          const newParts = newRow.split('|');
          
          const newCommunication = {
            id: newParts[0],
            customer_id: newParts[1],
            customer_email: newParts[2],
            customer_phone: newParts[3],
            type: newParts[4],
            category: newParts[5],
            subject: newParts[6],
            content: newParts[7],
            status: newParts[8],
            sent_at: newParts[9],
            delivered_at: newParts[10],
            error_message: newParts[11],
            metadata: newParts[12],
            customer_name: customerParts[0]
          };
          
          // Log the message as sent
          await runPsql(`
            INSERT INTO message_logs (communication_id, event_type, event_data)
            VALUES ('${newParts[0]}', 'sent', '{}');
          `);
          
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newCommunication));
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });
      return;
    }
    
    // Templates endpoints
    if (pathname === '/api/templates' && req.method === 'GET') {
      const result = await runPsql('SELECT * FROM notification_templates ORDER BY template_type;');
      const rows = result.split('\n').filter(Boolean).map(row => {
        const parts = row.split('|');
        return {
          id: parts[0],
          template_type: parts[1],
          name: parts[2],
          content: parts[3],
          is_sms: parts[4] === 't',
          is_email: parts[5] === 't',
          created_at: parts[6]
        };
      });
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rows));
      return;
    }
    
    // Campaigns endpoints
    if (pathname === '/api/campaigns' && req.method === 'GET') {
      const result = await runPsql('SELECT * FROM campaigns ORDER BY created_at DESC;');
      const rows = result.split('\n').filter(Boolean).map(row => {
        const parts = row.split('|');
        return {
          id: parts[0],
          name: parts[1],
          type: parts[2],
          status: parts[3],
          content: parts[4],
          target_segment: parts[5],
          recipient_count: parseInt(parts[6]) || 0,
          sent_at: parts[7]
        };
      });
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rows));
      return;
    }
    
    if (pathname === '/api/campaigns' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const { name, type, content, target_segment } = data;
          
          const insertResult = await runPsql(`
            INSERT INTO campaigns (name, type, content, target_segment, status)
            VALUES ('${name}', '${type}', '${content}', '${target_segment}', 'draft')
            RETURNING *;
          `);
          
          const newRow = insertResult.split('\n').filter(Boolean)[0];
          const newParts = newRow.split('|');
          
          const newCampaign = {
            id: newParts[0],
            name: newParts[1],
            type: newParts[2],
            status: newParts[3],
            content: newParts[4],
            target_segment: newParts[5],
            recipient_count: parseInt(newParts[6]) || 0,
            sent_at: newParts[7]
          };
          
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newCampaign));
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });
      return;
    }
    
    // 404 for unknown routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
    
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 ServiceGenie Local API running on http://localhost:${PORT}`);
  console.log('🐘 Using direct PostgreSQL via Docker exec');
  console.log('🌐 Endpoints:');
  console.log('  GET /health');
  console.log('  GET /api/providers');
  console.log('  GET /api/customers');
  console.log('  GET /api/services');
  console.log('  GET /api/appointments?providerId=X&date=YYYY-MM-DD');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️ Shutting down...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});