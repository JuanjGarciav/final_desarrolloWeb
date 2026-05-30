'use strict';

let Resena = require('../models/resenas');

function crearResena(req, resp) {
    let requestBody = req.body;

    if (!requestBody) {
        resp.status(400).send({ message: 'no body was sent' });
    }
    else if (!requestBody.restaurante || !requestBody.calificacion || !requestBody.comentario) {
        resp.status(400).send({ message: 'missing mandatory fields' });
    }
    else if (requestBody.restaurante.trim() === '' || requestBody.calificacion < 1 || requestBody.calificacion > 5) {
        resp.status(400).send({ message: 'invalid values in mandatory fields' });
    }
    else {
        let nuevaResena = new Resena();
        nuevaResena.usuario = req.userId;
        nuevaResena.restaurante = requestBody.restaurante;
        nuevaResena.calificacion = requestBody.calificacion;
        nuevaResena.comentario = requestBody.comentario;
        nuevaResena.fechaVisita = requestBody.fechaVisita || Date.now();

        nuevaResena.save().then(
            (resenaCreada) => {
                resp.status(201).send({ message: 'resena creada', resena: resenaCreada });
            },
            err => {
                resp.status(500).send({ message: 'internal error', error: err });
            }
        );
    }
}

function consultarTodas(req, resp) {
    Resena.find({ usuario: req.userId }).sort({ createdAt: -1 }).then(
        (resenas) => {
            resp.status(200).send(resenas);
        }
    ).catch(
        (err) => {
            resp.status(500).send({ message: 'Error al consultar reseñas' });
        }
    );
}

function consultarPorId(req, resp) {
    let resenaId = req.params.resenaId;
    Resena.findOne({ _id: resenaId, usuario: req.userId }).then(
        (resena) => {
            if (!resena) {
                return resp.status(404).send({ message: 'Reseña no encontrada' });
            }
            resp.status(200).send(resena);
        }
    ).catch(
        (err) => {
            resp.status(500).send({ message: 'Error al consultar reseña' });
        }
    );
}

function borrarPorId(req, resp) {
    let resenaId = req.params.resenaId;
    Resena.findOneAndDelete({ _id: resenaId, usuario: req.userId }).then(
        (resena) => {
            if (!resena) {
                return resp.status(404).send({ message: 'Reseña no encontrada o no autorizado' });
            }
            resp.status(200).send({ message: 'Reseña eliminada' });
        }
    ).catch(
        (err) => {
            resp.status(500).send({ message: 'Error al eliminar reseña' });
        }
    );
}

function actualizarResena(req, resp) {
    let resenaId = req.params.resenaId;
    let requestBody = req.body;

    if (!requestBody) {
        resp.status(400).send({ message: 'no body was sent' });
    }
    else if (!requestBody.restaurante || !requestBody.calificacion || !requestBody.comentario) {
        resp.status(400).send({ message: 'missing mandatory fields' });
    }
    else if (requestBody.restaurante.trim() === '' || requestBody.calificacion < 1 || requestBody.calificacion > 5) {
        resp.status(400).send({ message: 'invalid values in mandatory fields' });
    }
    else {
        Resena.findOneAndUpdate(
            { _id: resenaId, usuario: req.userId },
            {
                restaurante: requestBody.restaurante,
                calificacion: requestBody.calificacion,
                comentario: requestBody.comentario,
                fechaVisita: requestBody.fechaVisita
            },
            { new: true }
        ).then(
            (resena) => {
                if (!resena) {
                    return resp.status(404).send({ message: 'Reseña no encontrada o no autorizado' });
                }
                resp.status(200).send({ message: 'Reseña actualizada', resena: resena });
            }
        ).catch(
            (err) => {
                resp.status(500).send({ message: 'Error al actualizar reseña' });
            }
        );
    }
}

module.exports = { crearResena, consultarTodas, consultarPorId, borrarPorId, actualizarResena };
