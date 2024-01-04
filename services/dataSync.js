const { getSheetData, getSheetNames } = require('../config/googleSheets');
const { processData } = require('./dataProcess');
const { databaseConnection } = require('../config/db');

require('dotenv').config(); // use environment variables from separate file for security reasons

if (!process.env.SPREADSHEET_ID || !process.env.DATA_RANGE) {
    console.error('Error: Essential environment variables for spreadsheet ID or data range are not set.');
    process.exit(1);
} // check essential spreadsheets parameters

const syncDataWithDatabase = async () => {
    let connection;
    try {
        connection = await databaseConnection();

        const spreadsheetId = process.env.SPREADSHEET_ID;
        const sheetNames = await getSheetNames(spreadsheetId);

        for (const name of sheetNames) {
            const range = `${name}!${process.env.DATA_RANGE}`;
            const data = await getSheetData(spreadsheetId, range);
            console.log(`Synchronizing data from sheet: ${name}`);
            await processData(data, name, connection);
        }
        console.log('All sheets have been processed and synchronized.');
        
    } catch (error) {
        console.error('Error during data synchronization:', error);
        throw error; // show an error to the caller

    } finally {
        if (connection) {
            await connection.end();
        }
    } // close database connection in case it was successful or failed
};

module.exports = syncDataWithDatabase;