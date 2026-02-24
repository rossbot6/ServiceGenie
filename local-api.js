// Simple local API server for ServiceGenie
import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';

const app = express();
const port = 3001;

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'servicegenie',
  password: 'postgres',
  port: 5432,
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes

// Customers
app.get('/api/customers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const { phone, name, email } = req.body;
    const result = await pool.query(
      'INSERT INTO customers (phone, name, email) VALUES ($1, $2, $3) RETURNING *',
      [phone, name, email]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Providers
app.get('/api/providers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM providers ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Services
app.get('/api/services', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const { providerId, date } = req.query;
    let query = 'SELECT * FROM appointments';
    const params = [];
    
    if (providerId && date) {
      query += ' WHERE provider_id = $1 AND date = $2';
      params.push(providerId, date);
    } else if (providerId) {
      query += ' WHERE provider_id = $1';
      params.push(providerId);
    } else if (date) {
      query += ' WHERE date = $1';
      params.push(date);
    }
    
    query += ' ORDER BY date, time';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/appointments', async (req, res) => {
  try {
    const { customerId, providerId, date, startTime, duration, notes } = req.body;
    const result = await pool.query(
      'INSERT INTO appointments (customer_id, provider_id, date, start_time, duration, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [customerId, providerId, date, startTime, duration, notes]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM appointments WHERE id = $1', [id]);
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Blocked times
app.get('/api/blocked-times', async (req, res) => {
  try {
    const { providerId, date } = req.query;
    let query = 'SELECT * FROM blocked_times';
    const params = [];
    
    if (providerId && date) {
      query += ' WHERE provider_id = $1 AND date = $2';
      params.push(providerId, date);
    } else if (providerId) {
      query += ' WHERE provider_id = $1';
      params.push(providerId);
    } else if (date) {
      query += ' WHERE date = $1';
      params.push(date);
    }
    
    query += ' ORDER BY date, start_time';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/blocked-times', async (req, res) => {
  try {
    const { providerId, date, startTime, endTime, reason } = req.body;
    const result = await pool.query(
      'INSERT INTO blocked_times (provider_id, date, start_time, end_time, reason) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [providerId, date, startTime, endTime, reason]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`🚀 Local API server running on http://localhost:${port}`);
  console.log('📊 Database connected to PostgreSQL');
});