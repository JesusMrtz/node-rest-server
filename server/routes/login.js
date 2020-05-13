const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const app = express();



app.post('/login', (request, response) => {
    let body = request.body;

    User.findOne({ email: body.email }, (error, userDataBase) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                error
            });
        }

        if (!userDataBase) {
            return response.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        if (bcrypt.compareSync(body.password, userDataBase.password)) {
            let token = jwt.sign({
                data: userDataBase
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

            response.json({
                ok: true,
                data: userDataBase,
                token
            });
        } else {
            return response.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }
    });
});

module.exports = app;