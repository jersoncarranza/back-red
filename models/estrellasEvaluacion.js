'use strict';
var mongoose =  require('mongoose');
var Schema = mongoose.Schema; 
var estrellasEvaluacionSchema = Schema ({
    idevaluacionprofesor : {type: Schema.ObjectId, ref:'evaluacionprofesor'},
    idestudiante:   {type: Schema.ObjectId, ref:'estudiante'},
    calificacion:   Number,
    created_at:     String,
    estado:         Number,
    enabled:        Boolean
});
module.exports = mongoose.model('estrellasEvaluacion', estrellasEvaluacionSchema)