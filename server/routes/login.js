const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

// Configuraciones de google 
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        image: payload.picture,
        google: true
    };
}

app.post('/google', async(request, response) => {
    let token = request.body.idtoken;
    let googleUser = await verify(token)
        .catch((error) => {
            return response.status(403).json({
                ok: false,
                error
            });
        });

    User.findOne({ email: googleUser.email }, (error, userDataBase) => {
        if (error) {
            return response.status(500).json({
                ok: false,
                error
            });
        }

        if (userDataBase) {
            if (userDataBase.googleSignIn === false) {
                return response.status(400).json({
                    ok: false,
                    error: {
                        message: 'Debe de usar su autenticación normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    data: userDataBase
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return response.json({
                    ok: true,
                    data: userDataBase,
                    token
                });
            }
        } else {
            let user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.image = googleUser.image;
            user.googleSignIn = true;
            user.password = ':)';

            user.save((error, newUser) => {
                if (error) {
                    return response.status(500).json({
                        ok: false,
                        error
                    });
                }

                let token = jwt.sign({
                    data: newUser
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return response.json({
                    ok: true,
                    data: newUser,
                    token
                });

            });
        }
    });
});

module.exports = app;