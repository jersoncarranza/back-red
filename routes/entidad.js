'use strict';
var express = require('express');
var EntidadController = require('../controllers/entidad');
var md_auth = require('../middlewares/authenticated');
var api = express.Router();
api.get('/get-entidades', EntidadController.getEntidad);
api.post('/save-entidad', md_auth.ensureAuth, EntidadController.saveEntidad);
api.put('/edit-entidad', EntidadController.editEntidad);


module.exports = api;
