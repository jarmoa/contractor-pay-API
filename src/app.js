const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require("./model");
// const {getProfile} = require('./middleware/getProfile')
const { errorHandler } = require('./middleware/errorHandler')

const router = require('./routes')

const app = express();
app.use(bodyParser.json());
// app.use(getProfile);

app.set('sequelize', sequelize)
app.set('models', sequelize.models)
app.use('/', router);
app.use(errorHandler);


module.exports = app;
