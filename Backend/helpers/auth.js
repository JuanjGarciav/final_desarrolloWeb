'use strict';

let jwt = require('jwt-simple');
let moment = require('moment');

let secret = 'resenas_secret_key_2024';

function createToken(usuario) {
    let payload = {
        sub: usuario._id,
        email: usuario.email,
        iat: moment().unix(),
        exp: moment().add(8, 'hours').unix()
    };
    return jwt.encode(payload, secret);
}

function validateToken(req, res, next) {
    try {
        let token = req.headers.authorization.replace('Bearer ', '');
        let payload = jwt.decode(token, secret);

        if (moment.unix(payload.exp).isBefore(moment())) {
            return res.status(401).send({ message: 'Token expirado' });
        }

        req.userId = payload.sub;
        next();
    }
    catch (ex) {
        res.status(401).send({ message: 'Token inválido' });
    }
}

module.exports = { createToken, validateToken };
