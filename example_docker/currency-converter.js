// Currency converter JavaScript
// Exchange rate (approximate - in production, you'd fetch from an API)
const USD_TO_EUR_RATE = 0.92; // 1 USD = 0.92 EUR (example rate)

function convertCurrency() {
    const dollarInput = document.getElementById('dollarAmount');
    const euroResult = document.getElementById('euroResult');
    const dollarAmount = parseFloat(dollarInput.value);
    
    // Validate input
    if (isNaN(dollarAmount) || dollarAmount < 0) {
        euroResult.textContent = 'Invalid amount';
        euroResult.style.color = '#e74c3c';
        return;
    }
    
    // Convert USD to EUR
    const euroAmount = dollarAmount * USD_TO_EUR_RATE;
    
    // Display result
    euroResult.textContent = `€${euroAmount.toFixed(2)}`;
    euroResult.style.color = '#2ecc71';
    
    // Add animation effect
    euroResult.style.transform = 'scale(1.1)';
    setTimeout(() => {
        euroResult.style.transform = 'scale(1)';
    }, 200);
}

// Convert on Enter key press
document.getElementById('dollarAmount').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        convertCurrency();
    }
});

// Real-time conversion as user types
document.getElementById('dollarAmount').addEventListener('input', function() {
    const value = this.value;
    if (value && !isNaN(value)) {
        convertCurrency();
    } else {
        document.getElementById('euroResult').textContent = '0.00';
        document.getElementById('euroResult').style.color = '#7f8c8d';
    }
});

// Update the displayed rate
document.getElementById('currentRate').textContent = (1 / USD_TO_EUR_RATE).toFixed(2);

// Optional: Fetch real exchange rates from an API
async function fetchRealExchangeRate() {
    try {
        // Example using a free API (you'd need to replace with actual API)
        // const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        // const data = await response.json();
        // return data.rates.EUR;
        
        // For demo purposes, return static rate
        return USD_TO_EUR_RATE;
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        return USD_TO_EUR_RATE; // Fallback to static rate
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    console.log('Currency converter loaded successfully!');
    
    // Focus on input field
    document.getElementById('dollarAmount').focus();
});