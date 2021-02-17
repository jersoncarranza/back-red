'use strict';
var mongoose =  require('mongoose');
var Schema = mongoose.Schema;
var ProfesorSchema = Schema ({
    nombre: String,
    apellidos: String,
    estado: Number,
    correo: String,
    file:String,
    enabled:Boolean
});

module.exports = mongoose.model('Profesor', ProfesorSchema);