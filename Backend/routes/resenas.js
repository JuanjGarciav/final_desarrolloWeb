'use strict';

let express = require('express');
let router = express.Router();
let resenaController = require('../controllers/resenas');
let auth = require('../helpers/auth');

router.post('/api/resena', auth.validateToken, resenaController.crearResena);
router.get('/api/resenas', auth.validateToken, resenaController.consultarTodas);
router.get('/api/resena/:resenaId', auth.validateToken, resenaController.consultarPorId);
router.delete('/api/resena/:resenaId', auth.validateToken, resenaController.borrarPorId);
router.put('/api/resena/:resenaId', auth.validateToken, resenaController.actualizarResena);

module.exports = router;
