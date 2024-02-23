const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/convert', async (req, res) => {
    try {
        const { fromCurrency, toCurrency, date } = req.query;

        // Input validation
        if (!fromCurrency || !toCurrency || !date) {
            return res.status(400).send({ Error: 'Missing  parameters: fromCurrency, toCurrency, date' });
        }
        const apiUrl = `https://api.coingecko.com/api/v3/coins/${fromCurrency}/history?date=${date}&localization=false`;

        const response = await axios.get(apiUrl);
        const priceData = response.data;

        if (!priceData.market_data.current_price[toCurrency]) {
            return res.status(404).send({ error: `Price data not for ${fromCurrency} in ${toCurrency} on ${date}` });
        }

        const price = priceData.market_data.current_price[toCurrency];


        res.send({ price, date: date });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while processing your request' });
    }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
