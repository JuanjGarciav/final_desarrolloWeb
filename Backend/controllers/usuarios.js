'use strict';

let bcrypt = require('bcryptjs');
let Usuario = require('../models/usuarios');
let auth = require('../helpers/auth');

function registrar(req, resp) {
    let requestBody = req.body;

    if (!requestBody) {
        resp.status(400).send({ message: 'no body was sent' });
    }
    else if (!requestBody.email || !requestBody.password) {
        resp.status(400).send({ message: 'missing mandatory fields' });
    }
    else if (requestBody.email.trim() === '' || requestBody.password.trim() === '') {
        resp.status(400).send({ message: 'invalid values in mandatory fields' });
    }
    else {
        Usuario.findOne({ email: requestBody.email }).then(
            (usuarioExistente) => {
                if (usuarioExistente) {
                    return resp.status(409).send({ message: 'El email ya está registrado' });
                }

                let nuevoUsuario = new Usuario();
                nuevoUsuario.email = requestBody.email;
                nuevoUsuario.password = bcrypt.hashSync(requestBody.password, 10);

                nuevoUsuario.save().then(
                    (usuarioCreado) => {
                        let token = auth.createToken(usuarioCreado);
                        resp.status(201).send({ message: 'usuario registrado', token: token, usuario: { id: usuarioCreado._id, email: usuarioCreado.email } });
                    },
                    err => {
                        resp.status(500).send({ message: 'internal error', error: err });
                    }
                );
            }
        ).catch(
            (err) => {
                resp.status(500).send({ message: 'Error al verificar usuario', error: err });
            }
        );
    }
}

function login(req, resp) {
    let requestBody = req.body;

    if (!requestBody) {
        resp.status(400).send({ message: 'no body was sent' });
    }
    else if (!requestBody.email || !requestBody.password) {
        resp.status(400).send({ message: 'missing mandatory fields' });
    }
    else {
        Usuario.findOne({ email: requestBody.email }).then(
            (usuario) => {
                if (!usuario) {
                    return resp.status(401).send({ message: 'Credenciales inválidas' });
                }

                let passwordValido = bcrypt.compareSync(requestBody.password, usuario.password);
                if (!passwordValido) {
                    return resp.status(401).send({ message: 'Credenciales inválidas' });
                }

                let token = auth.createToken(usuario);
                resp.status(200).send({ message: 'login exitoso', token: token, usuario: { id: usuario._id, email: usuario.email } });
            }
        ).catch(
            (err) => {
                resp.status(500).send({ message: 'Error al iniciar sesión', error: err });
            }
        );
    }
}

module.exports = { registrar, login };
