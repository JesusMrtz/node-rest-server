const express = require('express');
const fileUpload = require('express-fileupload');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const fs = require('fs');
const path = require('path');
const app = express();

// default options
app.use(fileUpload());




app.put('/upload/:type/:id', function(req, res) {
    let type = req.params.type;
    let id = req.params.id;
    let validTypes = ['products', 'users'];

    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'Los tipos permitidos son ' + validTypes.join(', ')
            }
        });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'No se ha seleccionado ningu archivo'
            }
        });
    }



    // The name of the input field (i.e. "image") is used to retrieve the uploaded file
    let sampleFile = req.files.image;

    // Extensiones permitidas
    let validExtensions = ['png', 'gif', 'jpg', 'jpeg'];
    let convertStringNameFileToArray = sampleFile.name.split('.');
    let extension = convertStringNameFileToArray[convertStringNameFileToArray.length - 1];

    if (validExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'Las extesiones permitida son ' + validExtensions.join(', '),
                extension
            }
        });
    }

    // Change file's name
    let fileName = `${id}-${new Date().getMilliseconds()}.${extension}`;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(`uploads/${type}/${fileName}`, (error) => {
        if (error)
            return res.status(500).json({
                ok: false,
                error
            });

        if (type === 'users') {
            imageUser(id, res, fileName);
        } else {
            imageProduct(id, res, fileName);
        }
    });
});

function imageUser(id, res, fileName) {
    User.findById(id, (error, userDB) => {
        if (error) {
            deleteFile(fileName, 'users');
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!userDB) {
            deleteFile(fileName, 'users');
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'El usuario no existe'
                }
            });
        }

        deleteFile(userDB.image, 'users');

        userDB.image = fileName;

        userDB.save((error, userSave) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }

            res.json({
                ok: true,
                data: userDB,
                img: fileName
            });
        });

    });
}

function imageProduct(id, res, fileName) {
    Product.findById(id, (error, productDB) => {
        if (error) {
            deleteFile(fileName, 'products');
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!productDB) {
            deleteFile(fileName, 'products');
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'El usuario no existe'
                }
            });
        }

        deleteFile(productDB.image, 'products');

        productDB.image = fileName;

        productDB.save((error, productSave) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }

            res.json({
                ok: true,
                data: productSave,
                img: fileName
            });
        });

    });
}

function deleteFile(fileName, type) {
    let pathImage = path.resolve(__dirname, `../../uploads/${type}/${fileName}`);

    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    }
}


module.exports = app;