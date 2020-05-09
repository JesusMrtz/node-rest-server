require('../config/config');
const express = require('express');
const bodyParser = require('body-parser')
const app = express();



// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


app.get('/users', function(req, res) {
    res.json('Get users');
});

app.post('/user', function(request, response) {
    let body = request.body;

    if (body.name === undefined) {
        response.status(400).json({
            ok: false,
            message: 'El nombre es necesario'
        });
    } else {
        response.json({
            person: body
        });
    }
});

app.put('/user/:id', function(request, response) {
    let id = request.params.id;

    response.json({
        id,
        user: 'Jesús Martinez'
    });
});

app.delete('/user', function(req, res) {
    res.json('Delete user');
});



app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});