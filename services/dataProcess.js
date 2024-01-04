const validateData = (data) => {
    if (!Array.isArray(data) || data.length < 1) {
        throw new Error('Wrong data format: Expected an array with at least one element');
    }
}; // validate the data retrieved from Google Sheets (can be extended)

const handleModel = async (modelName, connection) => {
    try {
        let [model] = await connection.execute('SELECT model_id FROM model WHERE model_name = ?', [modelName]);
        if (model.length === 0) {
            [model] = await connection.execute('INSERT INTO model (model_name) VALUES (?)', [modelName]);
            return model.insertId;
        } else {
            return model[0].model_id;
        }
    } catch (error) {
        console.error(`Error with model ${modelName}:`, error);
        throw error;
    }
}; // handle the model logic

const extractProductData = (data, index) => {
    const name = data[0][index] ? data[0][index].trim() : '';
    const price = data[1][index] ? parseFloat(data[1][index].trim()) : 0;
    const productCode = data[2][index] ? data[2][index].trim() : '';
    let sizes = [];
    for (let j = 4; j < data.length; j++) {
        if (data[j][index] === '+') {
            sizes.push(parseInt(data[j][0]));
        }
    }
    return { name, price, productCode, sizes };
}; // extract product data from a row in the data array

const handleProduct = async (productData, modelId, connection) => {
    try {
        const { name, price, productCode, sizes } = productData;
        const [product] = await connection.execute('SELECT id FROM product WHERE product_code = ? AND model_id = ?', [productCode, modelId]);

        let productId;
        if (product.length === 0) {
            // add new product
            const [newProduct] = await connection.execute('INSERT INTO product (name, price, product_code, model_id) VALUES (?, ?, ?, ?)', [name, price, productCode, modelId]);
            productId = newProduct.insertId;
        } else {
            // update existing product
            productId = product[0].id;
            await connection.execute('UPDATE product SET name = ?, price = ? WHERE id = ?', [name, price, productId]);
        }

        // insert new sizes and remove old sizes
        await handleSizes(productId, sizes, connection);
    } catch (error) {
        console.error('Error handling product:', error);
        throw error;
    } 
}; // handle product logic, including insertion and updating

const handleSizes = async (productId, sizes, connection) => {
    try {
        const [existingSizes] = await connection.execute('SELECT size FROM size WHERE product_id = ?', [productId]);
        const existingSizeValues = existingSizes.map(sizeEntry => sizeEntry.size);

        for (let size of sizes) {
            if (!existingSizeValues.includes(size)) {
                await connection.execute('INSERT INTO size (size, product_id) VALUES (?, ?)', [size, productId]);
            }
        } // add new sizes

        for (let existingSize of existingSizeValues) {
            if (!sizes.includes(existingSize)) {
                await connection.execute('DELETE FROM size WHERE size = ? AND product_id = ?', [existingSize, productId]);
            }
        }// remove old sizes
    } catch (error) {
        console.error('Error handling sizes for product:', error);
        throw error;
    }
}; // handle sizes logic for a product

const processData = async (data, modelName, connection) => {
    try {
        validateData(data); // validate data format

        console.log(`Processing data for model: ${modelName}`);
        const modelId = await handleModel(modelName, connection);

        for (let i = 1; i < data[0].length; i++) {
            const productData = extractProductData(data, i);
            if (!productData.name && !productData.productCode) {
                continue; // skip empty column
            } // check if the product does not exist

            await handleProduct(productData, modelId, connection);
        }

        console.log(`Data processing for model ${modelName} completed.`);
    } catch (error) {
        console.error(`Error processing data for model ${modelName}:`, error);
        throw error; // show an error to the caller
    }
}; // main function to process data received from Google Sheets

module.exports = { processData };
