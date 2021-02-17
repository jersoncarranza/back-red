'use strict';
var express = require('express');
var escuelaController = require('../controllers/escuelaController');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

//list-escuelasXuniversidad
api.get('/list-escuelasXuniversidad/:identidad', md_auth.ensureAuth, escuelaController.getEscuelaXuniversidad);
api.get('/list-escuela', md_auth.ensureAuth, escuelaController.getEscuela);
api.get('/list-escuela-id/:identidad', md_auth.ensureAuth, escuelaController.getEscuelaXId);
api.post('/save-escuela', md_auth.ensureAuth, escuelaController.saveEscuela);



api.post('/save-profesor', md_auth.ensureAuth, escuelaController.saveProfesor);
api.get('/list-profesor', md_auth.ensureAuth, escuelaController.getProfesor);
api.post('/edit-profesor', md_auth.ensureAuth, escuelaController.editProfesor);


api.post('/save-materia', md_auth.ensureAuth, escuelaController.saveMateria);
api.get('/list-materia', md_auth.ensureAuth, escuelaController.getMateria);
api.post('/edit-materia', md_auth.ensureAuth, escuelaController.editMateria);

module.exports = api;