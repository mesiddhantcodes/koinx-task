const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/companies-holding-crypto', async (req, res) => {
    try {
        const { currency } = req.body;
        if (!currency) {
            return res.status(400).json({ error: 'Currency field is required.' });
        }

        if (currency !== 'bitcoin' && currency !== 'ethereum') {
            return res.status(400).json({ error: 'Invalid currency.' });
        }
        const apiUrl = `https://api.coingecko.com/api/v3/companies/public_treasury/${currency}`;
        const response = await axios.get(apiUrl);
        if (response.status !== 200) {
            throw new Error('Failed to fetch companies holding cryptocurrency.');
        }

        const companies = response.data.companies;
        console.log('Companies holding cryptocurrency:', companies);
        return res.json({ companies });
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
