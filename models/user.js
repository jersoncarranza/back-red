'use strict';

var mongoose =  require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema ({
    name: String,
    lastname: String,
    nickname: String,
    password: String,
    role:  String,
    image: String,
    email: String,
    codigo: String,
    genero:String,
    estado: Number, // 1 Activo ; 0 Desactivado,
    identidad: {type: Schema.ObjectId, ref:'entidade'},//
    idescuela: {type: Schema.ObjectId, ref:'escuela'},
});

module.exports = mongoose.model('User', UserSchema);