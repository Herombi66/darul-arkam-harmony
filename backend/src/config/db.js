const { Pool } = require('pg');

// Create a PostgreSQL connection pool
// Supports DATABASE_URL or POSTGRES_URL, with optional SSL via PGSSL=true
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || 'postgres://postgres:postgres@localhost:5432/darul_arkam';

const pool = new Pool({
  connectionString,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = { pool };