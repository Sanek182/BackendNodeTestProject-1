# Test project for job application
## Description
This is a backend server project based on Node.js for a simple sneaker storing and showing affair. It integrates with Google Sheets tables to get product data and synchronizes them with a MySQL database. The application provides a RESTful API to interact with the product data (for now with the help of Postman interface), including fetching all products, retrieving a product by ID, updating a product's name, and filtering products by size.

## Key Features
Transfers sneaker's data from Google Sheets pages to a MySQL database.
- REST API endpoints:
- GET /products: See all products.
- GET /products/:id: Check a product by its ID.
- PUT /products/:id: Change a product's name.
- GET /products/size/:size: Show products by specific size.
Regular updates from Google Sheets every hour.

## Technologies Used
* Node.js
* Express.js
* MySQL
* Google Sheets API

## Necessary Setup
Fill in the necessary project variables into .env file (database credentials - individual for every MySQL set together with password and database name, Google Sheets API - server key downloaded from Google Cloud Console, Spreadsheet ID - can be found in the URL address, PORT to listen to the server, and desired range for the product values).

Ensure your MySQL database is set up according to the schema used by the application.
A dump of the database is provided as `RestowavesDump.sql`. Import it into MySQL Workbench or run it with MySQL command line.

## Project Structure
app.js: Main server file.
routes/: Folder that has Express route definitions.
controllers/: contains logic for handling API requests.
config/: Configuration files, including database and Google Sheets integration.
services/: Services for data processing and synchronization.

## Future Project Additions
- Add a logic to include categories, subcategories, brands, and models data into the database and show them through API endpoints.
- deeper data check for product updates and data sorting in API endpoints.
- better error handling and logging for debugging purposes.