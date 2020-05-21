const express = require('express');
const Category = require('../models/category.model');
const { verifyToken, verifyTokenUseAdmin } = require('../middlewares/authentication');
const app = express();



app.get('/categories', verifyToken, (request, response) => {
    let skipData = Number(request.query.from) || 0;
    let limitData = Number(request.query.limit) || 5;

    Category.find({})
        .skip(skipData)
        .limit(limitData)
        .sort('description')
        .populate('user_id', 'name email')
        .exec((error, categoriesData) => {
            if (error) {
                return response.status(400).json({
                    ok: false,
                    error
                });
            }

            Category.countDocuments({}, (error, countCategories) => {
                response.json({
                    ok: true,
                    data: categoriesData,
                    count: countCategories
                });
            });
        });
});

app.get('/category/:id', verifyToken, (request, response) => {
    let id = request.params.id;
    let body = {
        description: request.body.description
    };

    Category.findById(id, 'description', (error, categoryDB) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                error
            });
        }

        response.json({
            ok: true,
            data: categoryDB
        });
    });
});

app.post('/category', [verifyToken], (request, response) => {
    let body = request.body;
    let newCategory = new Category({
        description: body.description,
        user_id: request.user._id
    });

    newCategory.save((error, saveCategory) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                error
            });
        }

        response.json({
            ok: true,
            data: saveCategory
        });
    });
});

app.put('/category/:id', [verifyToken], (request, response) => {
    let id = request.params.id;
    let body = {
        description: request.body.description
    };

    Category.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (error, categoryDB) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                error
            });
        }

        response.json({
            ok: true,
            data: categoryDB
        });
    });
});

app.delete('/category/:id', [verifyToken, verifyTokenUseAdmin], function(request, response) {
    let id = request.params.id;

    Category.findOneAndRemove(id, (error, categoryDelete) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                error
            });
        }

        if (!categoryDelete) {
            return response.status(400).json({
                ok: false,
                error: {
                    message: 'Categoría no encontrada'
                }
            });
        }

        response.json({
            ok: true,
            data: categoryDelete
        });
    });
});


module.exports = app;