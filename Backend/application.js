'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let routerResenas = require('./routes/resenas');
let routerUsuarios = require('./routes/usuarios');
let cors = require('cors');

let application = express();
application.use(cors());
application.use(bodyParser.json());
application.use(routerResenas);
application.use(routerUsuarios);

module.exports = application;
