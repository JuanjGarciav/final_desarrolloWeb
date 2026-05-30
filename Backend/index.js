'use strict';

let mongoose = require('mongoose');
let application = require('./application');

mongoose.connect('mongodb://localhost:27017/resenas_restaurantes').then(
    () => {
        console.log('Conexion exitosa');
        application.listen(1702);
    },
    err => {
        console.error(err);
    }
);
