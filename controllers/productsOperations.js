const { databaseConnection } = require('../config/db');

exports.getAllProducts = async (req, res) => {
    let connection;
    try {
        connection = await databaseConnection();
        const [products] = await connection.execute('SELECT * FROM product');
        await connection.end();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        if (connection) await connection.end();
    }
};

exports.getProductById = async (req, res) => {
    let connection;
    try {
        const productId = req.params.id;
        connection = await databaseConnection();
        const [product] = await connection.execute('SELECT * FROM product WHERE id = ?', [productId]);
        await connection.end();
        product.length ? res.json(product[0]) : res.status(404).json({ message: 'Product not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        if (connection) await connection.end();
    }
};

exports.getProductsBySize = async (req, res) => {
    let connection;
    try {
        const size = req.params.size;
        connection = await databaseConnection();
        const [products] = await connection.execute('SELECT p.* FROM product p JOIN size s ON p.id = s.product_id WHERE s.size = ?', [size]);
        await connection.end();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        if (connection) await connection.end();
    }
};

exports.updateProductName = async (req, res) => {
    let connection;
    try {
        const productId = req.params.id;
        const newName = req.body.name;
        connection = await databaseConnection();
        const [result] = await connection.execute('UPDATE product SET name = ? WHERE id = ?', [newName, productId]);
        result.affectedRows ? res.json({ message: 'Product updated' }) : res.status(404).json({ message: 'Product not found' }); // validate product input
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        if (connection) await connection.end();
    }
};