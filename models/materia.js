'use strict';
var mongoose =  require('mongoose');
var Schema = mongoose.Schema;
var MateriaSchema = Schema ({
    nombre:     String,
    semestre:   Number,
    estado:     Number,
    enabled:    Boolean,
    created_at: String,
    escuela: {type: Schema.ObjectId, ref:'escuela'},
    identidad: {type: Schema.ObjectId, ref:'entidade'}

});
module.exports = mongoose.model('Materia', MateriaSchema);