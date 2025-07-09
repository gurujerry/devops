const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'currency_converter',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password123',
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Test database connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to PostgreSQL database');
        release();
    }
});

// API Routes

// Get exchange rate
app.get('/api/exchange-rate/:from/:to', async (req, res) => {
    try {
        const { from, to } = req.params;
        
        const result = await pool.query(
            'SELECT rate FROM exchange_rates WHERE from_currency = $1 AND to_currency = $2',
            [from.toUpperCase(), to.toUpperCase()]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Exchange rate not found' });
        }
        
        res.json({ 
            from: from.toUpperCase(), 
            to: to.toUpperCase(), 
            rate: parseFloat(result.rows[0].rate) 
        });
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Convert currency
app.post('/api/convert', async (req, res) => {
    try {
        const { from, to, amount } = req.body;
        const fromCurrency = from.toUpperCase();
        const toCurrency = to.toUpperCase();
        
        // Get exchange rate
        const rateResult = await pool.query(
            'SELECT rate FROM exchange_rates WHERE from_currency = $1 AND to_currency = $2',
            [fromCurrency, toCurrency]
        );
        
        if (rateResult.rows.length === 0) {
            return res.status(404).json({ error: 'Exchange rate not found' });
        }
        
        const rate = parseFloat(rateResult.rows[0].rate);
        const convertedAmount = amount * rate;
        
        // Save conversion to history
        await pool.query(
            `INSERT INTO conversion_history 
             (from_currency, to_currency, from_amount, to_amount, exchange_rate, ip_address, user_agent) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
                fromCurrency, 
                toCurrency, 
                amount, 
                convertedAmount, 
                rate,
                req.ip,
                req.get('User-Agent')
            ]
        );
        
        res.json({
            from: fromCurrency,
            to: toCurrency,
            fromAmount: amount,
            toAmount: parseFloat(convertedAmount.toFixed(2)),
            rate: rate
        });
    } catch (error) {
        console.error('Error converting currency:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get conversion history
app.get('/api/history', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        
        const result = await pool.query(
            `SELECT from_currency, to_currency, from_amount, to_amount, exchange_rate, created_at 
             FROM conversion_history 
             ORDER BY created_at DESC 
             LIMIT $1`,
            [limit]
        );
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get conversion statistics
app.get('/api/stats', async (req, res) => {
    try {
        const totalConversions = await pool.query(
            'SELECT COUNT(*) as total FROM conversion_history'
        );
        
        const popularPairs = await pool.query(
            `SELECT from_currency, to_currency, COUNT(*) as count 
             FROM conversion_history 
             GROUP BY from_currency, to_currency 
             ORDER BY count DESC 
             LIMIT 5`
        );
        
        const todayConversions = await pool.query(
            `SELECT COUNT(*) as today 
             FROM conversion_history 
             WHERE DATE(created_at) = CURRENT_DATE`
        );
        
        res.json({
            totalConversions: parseInt(totalConversions.rows[0].total),
            todayConversions: parseInt(todayConversions.rows[0].today),
            popularPairs: popularPairs.rows
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update exchange rate (admin endpoint)
app.put('/api/exchange-rate/:from/:to', async (req, res) => {
    try {
        const { from, to } = req.params;
        const { rate } = req.body;
        
        const result = await pool.query(
            `UPDATE exchange_rates 
             SET rate = $1, updated_at = CURRENT_TIMESTAMP 
             WHERE from_currency = $2 AND to_currency = $3 
             RETURNING *`,
            [rate, from.toUpperCase(), to.toUpperCase()]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Exchange rate not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating exchange rate:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve the frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});