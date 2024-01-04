const express = require('express');

const productsRoutes = require('./routes/productsRoutes');
const syncDataWithDatabase = require('./services/dataSync')

require('dotenv').config(); // use environment variables from separate file for security reasons

const app = express();
app.use(express.json());

app.use('/products', productsRoutes); // will serve as a basis for necessary routes to perform CRUD operations

const PORT = process.env.PORT;

if (!PORT) {
    console.error('Error: PORT is not set.');
    process.exit(1); // exit application in that case
}

// start the server and handle potential startup errors
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Error starting the server:', err);
    process.exit(1);
});

process.on('SIGTERM', () => {
    console.log('Shutting down...');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('Shutting down...');
    process.exit(0);
}); // track potential shutdown signals

(async () => {
    try {
        await syncDataWithDatabase();
    } catch (error) {
        console.error('Initial data synchronization error:', error);
    }
})(); // synchronize data with the database first time 

const ONE_HOUR = 3600000; // milliseconds in an hour

setInterval(async () => {
    try {
        await syncDataWithDatabase();
        console.log('Database sync completed');
    } catch (error) {
        console.error('Error during scheduled sync:', error);
    }
}, ONE_HOUR); // continue syncs every hour