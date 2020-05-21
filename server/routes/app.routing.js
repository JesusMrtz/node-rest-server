const express = require('express');
const app = express();



app.use(require('./user-routes'));
app.use(require('./login-routes'));
app.use(require('./categories-router'));
app.use(require('./product-routes'));


module.exports = app;