-- Create database schema for currency converter

-- Exchange rates table
CREATE TABLE exchange_rates (
    id SERIAL PRIMARY KEY,
    from_currency VARCHAR(3) NOT NULL,
    to_currency VARCHAR(3) NOT NULL,
    rate DECIMAL(10, 6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversion history table
CREATE TABLE conversion_history (
    id SERIAL PRIMARY KEY,
    from_currency VARCHAR(3) NOT NULL,
    to_currency VARCHAR(3) NOT NULL,
    from_amount DECIMAL(15, 2) NOT NULL,
    to_amount DECIMAL(15, 2) NOT NULL,
    exchange_rate DECIMAL(10, 6) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial exchange rates
INSERT INTO exchange_rates (from_currency, to_currency, rate) VALUES
('USD', 'EUR', 0.92),
('EUR', 'USD', 1.087),
('USD', 'GBP', 0.79),
('GBP', 'USD', 1.266),
('EUR', 'GBP', 0.86),
('GBP', 'EUR', 1.163);

-- Create indexes for better performance
CREATE INDEX idx_exchange_rates_currencies ON exchange_rates(from_currency, to_currency);
CREATE INDEX idx_conversion_history_date ON conversion_history(created_at);
CREATE INDEX idx_conversion_history_currencies ON conversion_history(from_currency, to_currency);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_exchange_rates_updated_at 
    BEFORE UPDATE ON exchange_rates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();