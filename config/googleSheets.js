const { google } = require('googleapis'); //import package to connect with Google services
require('dotenv').config(); // use environment variables from separate file for security reasons

if (!process.env.GOOGLESHEETS_API_DATA) {
    console.error('Error: The Google Sheets API key is not set.');
    process.exit(1); // shutdown if the server key is not set
} // check Google Sheets API credentials

const spreadSheet = async () => {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: process.env.GOOGLESHEETS_API_DATA,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const client = await auth.getClient();
        const spreadSheet = google.sheets({ version: 'v4', auth: client });
        return spreadSheet;
    } catch (error) {
        // possible auth errors to track
        console.error("Cannot reach Google Sheets API:", error);
        throw new Error('Authentication with Google Sheets failed');
    }
}; // making a GoogleAuth instance for accessing a given Google Sheets table and returning a connection client

const getSheetData = async (spreadsheetId, range) => {
    try {
        const sheets = await spreadSheet();
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: range,
        });
        return response.data.values;
    } catch (error) {
        // errors in retrieving data from the tables to track
        console.error(`Cannot retrieve data from the spreadsheet (Identification_Num: ${spreadsheetId}, Range: ${range}):`, error);
        throw new Error('Fetching values from Google Sheets failed');
    }
}; // using client to retrieve actual data values from Google Sheets

const getSheetNames = async (spreadsheetId) => {
    try {
        const sheets = await spreadSheet();
        const response = await sheets.spreadsheets.get({ spreadsheetId });
        return response.data.sheets.map(sheet => sheet.properties.title);
    } catch (error) {
        console.error('Error fetching sheet names:', error);
        throw new Error('Fetching sheet names failed');
    }
}; // getting the names of all sheets in a Google Sheets spreadsheet

module.exports = { getSheetData, getSheetNames }; // make the above functions accessible from outside