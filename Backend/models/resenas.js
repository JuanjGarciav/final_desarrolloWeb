'use strict';

let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ResenaSchema = Schema(
    {
        usuario: { type: Schema.Types.ObjectId, ref: 'usuarios' },
        restaurante: String,
        calificacion: Number,
        comentario: String,
        fechaVisita: { type: Date, default: Date.now }
    }
);

module.exports = mongoose.model('resenas', ResenaSchema);
