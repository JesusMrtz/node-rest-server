const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/User');
const app = express();



app.get('/users', function(request, response) {
    let skipData = Number(request.query.from) || 0;
    let limitData = Number(request.query.limit) || 5;

    User.find({ status: true }, 'name email role status googleSignIn')
        .skip(skipData)
        .limit(limitData)
        .exec((error, userData) => {
            if (error) {
                return response.status(400).json({
                    ok: false,
                    error
                });
            }

            User.count({ status: true }, (error, countUser) => {
                response.json({
                    ok: true,
                    data: userData,
                    count: countUser
                });
            });
        });
});

app.post('/user', function(request, response) {
    let body = request.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((error, userDB) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                error
            });
        }

        response.json({
            ok: true,
            data: userDB
        });
    });
});

app.put('/user/:id', function(request, response) {
    let id = request.params.id;
    let body = _.pick(request.body, ['name', 'email', 'image', 'role', 'status']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, userDB) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                error
            });
        }

        response.json({
            ok: true,
            data: userDB
        });
    });
});

/**
 * Eliminado fisico
 */
/*
app.delete('/user/:id', function(request, response) {
    let id = request.params.id;

    User.findOneAndRemove(id, (error, userDelete) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                error
            });
        }

        if (!userDelete) {
            return response.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        response.json({
            ok: true,
            data: userDelete
        });
    });
});
*/

/**
 * Eliminado lógico
 */
app.delete('/user/:id', function(request, response) {
    let id = request.params.id;

    User.findByIdAndUpdate(id, { status: false }, { new: true }, (error, userDB) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                error
            });
        }

        response.json({
            ok: true,
            data: userDB
        });
    });
});


module.exports = app;