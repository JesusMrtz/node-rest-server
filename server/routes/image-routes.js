const express = require('express');
const fs = require('fs');
const path = require('path');

const { verifyTokenByParameter } = require('../middlewares/authentication');
const app = express();



app.get('/image/:type/:idImage', [verifyTokenByParameter], (request, response) => {
    let type = request.params.type;
    let image = request.params.idImage;

    let pathImage = path.resolve(__dirname, `../../uploads/${type}/${image}`);

    if (fs.existsSync(pathImage)) {
        response.sendFile(pathImage);
    } else {
        let pathNoImage = path.resolve(__dirname, '../assets/no-image.jpg');
        response.sendFile(pathNoImage);
    }
});


module.exports = app;