var express = require('express');
var evaluacionProfesorController = require('../controllers/evaluacionProfesorController');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var comentarioController = require('../controllers/comentarioController');

api.get('/list-evaluacionProfesor/:identidad/:idescuela?', md_auth.ensureAuth, evaluacionProfesorController.getEvaluacionProfesorXEstudiantes);
api.get('/list-evaluacionProfesorUnico/:profesor', md_auth.ensureAuth, evaluacionProfesorController.getEvaluacionProfesorUnico);

api.get('/list-profesormateria/:profesor', md_auth.ensureAuth, evaluacionProfesorController.getEvaluacionProfesor);
api.post('/save-profesormateria', md_auth.ensureAuth, evaluacionProfesorController.saveEvaluacionProfesor);

api.post('/save-estrellasevaluacion', md_auth.ensureAuth, evaluacionProfesorController.saveEstrellasEvaluacion);
api.get('/list-estrellasevaluacionprofesores', md_auth.ensureAuth, evaluacionProfesorController.getEstrellasEvaluacionProfesor);


/*comentarios evaluacion*/
api.post('/save-comentarioevaluacion', md_auth.ensureAuth, comentarioController.saveComentario);
api.get('/list-comentarioevaluacion/:id/:page?', md_auth.ensureAuth, comentarioController.getComentario);

module.exports = api;