const { Pool } = require('pg');

// Create a PostgreSQL connection pool
// Supports DATABASE_URL or POSTGRES_URL, with optional SSL via PGSSL=true
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || `postgres://postgres:${process.env.DB_PASSWORD || 'cands123'}@localhost:5432/darul_arkam`;

const pool = new Pool({
  connectionString,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  console.log('Database connected successfully with updated credentials');
});

module.exports = { pool };