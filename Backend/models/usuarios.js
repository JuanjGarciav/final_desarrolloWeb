'use strict';

let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let UsuarioSchema = Schema(
    {
        email: String,
        password: String
    }
);

module.exports = mongoose.model('usuarios', UsuarioSchema);
