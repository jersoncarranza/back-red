'use strict';
var mongoose =  require('mongoose');
var Schema = mongoose.Schema;
var EscuelaSchema = Schema ({
    facultad: String,
    nombre: String,
    estado: Number,
    enabled:Boolean,
    created_at:String,
    identidad: {type: Schema.ObjectId, ref:'Entidade'}
});

module.exports = mongoose.model('Escuela', EscuelaSchema);