const axios = require('axios');
const schedule = require('node-schedule');
const url = 'mongodb://0.0.0.0:27017/koinx';
const collectionName = 'cryptocurrencies';
const { MongoClient } = require('mongodb');
const apiUrl = 'https://api.coingecko.com/api/v3/coins/list?include_platform=false';

async function getCryptoIdName() {
    try {
        const response = await axios.get(apiUrl);
        if (response.status === 200) {
            return response.data.map(({ id, name }) => ({ id, name }));
        } else {
            console.error('Failed to fetch cryptocurrencies from Coingecko API. Status:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Failed to fetch cryptocurrencies from Coingecko API:', error.message);
        return null;
    }
}


async function updateCryptocurrencies(db, cryptocurrencies) {
    const collection = db.collection(collectionName);
    try {
        await collection.deleteMany({});
        await collection.insertMany(cryptocurrencies);
        console.log('Cryptocurrencies updated successfully.');
    } catch (error) {
        console.error('Failed to update cryptocurrencies in the database.', error.message);
    }
}
schedule.scheduleJob('0 * * * *', async () => {
    console.log('Updating cryptocurrencies...');
    const client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db('koinx');
        const cryptocurrencies = await getCryptoIdName();
        if (cryptocurrencies) {
            await updateCryptocurrencies(db, cryptocurrencies);
        }
    } catch (error) {
        console.error('An error occurred during the update process.', error.message);
    } finally {
        await client.close();
    }
});