'use strict';
var mongoose =  require('mongoose'); 
var Schema = mongoose.Schema;
var EvaluacionProfesorSchema = Schema ({
    idProfesor:     {type: Schema.ObjectId, ref:'profesor'},
    idMateria:      {type: Schema.ObjectId, ref:'materia'},
    estado:         Number,
    enabled:        Boolean,
    created_at:     String,
    periodo:        String,
    numero:         Number,
    calificacion:   Number,
    estudiantes:    Number,
    idEscuela:      {type: Schema.ObjectId, ref:'escuelas'},
    idEntidad:      {type: Schema.ObjectId, ref:'entidades'},
});
module.exports = mongoose.model('evaluacionprofesor', EvaluacionProfesorSchema);