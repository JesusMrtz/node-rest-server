const express = require('express');
const Product = require('../models/product.model');
const { verifyToken, verifyTokenUseAdmin } = require('../middlewares/authentication');
const app = express();



app.get('/products', verifyToken, (request, response) => {
    let skipData = Number(request.query.from) || 0;
    let limitData = Number(request.query.limit) || 5;

    Product.find({ status: true })
        .skip(skipData)
        .limit(limitData)
        .populate('user_id', 'name email')
        .populate('category_id', 'name description')
        .exec((error, productsData) => {
            if (error) {
                return response.status(400).json({
                    ok: false,
                    error
                });
            }

            Product.countDocuments({ status: true }, (error, countProducts) => {
                response.json({
                    ok: true,
                    data: productsData,
                    count: countProducts
                });
            });
        });
});

app.get('/product/:id', verifyToken, (request, response) => {
    let id = request.params.id;

    Product.findById(id)
        .populate('user_id', 'name email')
        .populate('category_id', 'name')
        .exec((error, productDB) => {
            if (error) {
                return response.status(500).json({
                    ok: false,
                    error
                });
            }

            if (!productDB) {
                return response.status(500).json({
                    ok: false,
                    error: {
                        message: 'El producto no existe'
                    }
                });
            }

            response.json({
                ok: true,
                data: productDB
            });
        });
});

app.get('/products/search/:search', verifyToken, (request, response) => {
    let paramsBySearch = request.params.search;

    // Expresino regular para hacer insensibles de mayusculas y minusculas
    let regex = new RegExp(paramsBySearch, 'i');

    Product.find({ name: regex })
        .populate('category_id', 'name description')
        .exec((error, productsDB) => {
            if (error) {
                return response.status(500).json({
                    ok: false,
                    error
                });
            }

            if (!productsDB) {
                return response.status(400).json({
                    ok: false,
                    error: {
                        message: 'El producto no existe'
                    }
                });
            }

            response.json({
                ok: true,
                data: productsDB
            });
        });
});

app.post('/product', [verifyToken], (request, response) => {
    let body = request.body;
    let newProduct = new Product({
        name: body.name,
        price: body.price,
        description: body.description,
        category_id: body.category,
        user_id: request.user._id
    });

    newProduct.save((error, saveProduct) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                error
            });
        }

        response.json({
            ok: true,
            data: saveProduct
        });
    });
});

app.put('/product/:id', [verifyToken], (request, response) => {
    let id = request.params.id;
    let body = request.body;
    let dataProduct = {
        name: body.name,
        price: body.price,
        description: body.description,
        status: body.status,
        category_id: body.category
    };

    Product.findByIdAndUpdate(id, dataProduct, { new: true, runValidators: true, context: 'query' }, (error, productDB) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                error
            });
        }

        response.json({
            ok: true,
            data: productDB
        });
    });
});

app.delete('/product/:id', [verifyToken], function(request, response) {
    let id = request.params.id;

    Product.findByIdAndUpdate(id, { status: false }, { new: true }, (error, productDB) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                error
            });
        }

        if (!productDB) {
            return response.status(400).json({
                ok: false,
                error: {
                    message: 'El producto no fue encontrado'
                }
            });
        }

        response.json({
            ok: true,
            data: productDB
        });
    });
});


module.exports = app;