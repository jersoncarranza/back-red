'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ComentarioSchema = Schema ({
    text: String,
    comentario: String,
    file: String,
    created_at: String,
    user: {type: Schema.ObjectId, ref:'User'},
    evaluacionprofesor: {type: Schema.ObjectId, ref:'evaluacionprofesor'}

});
module.exports = mongoose.model('comentario', ComentarioSchema);