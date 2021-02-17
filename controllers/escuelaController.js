'use strict';
var Escuela = require('../models/escuela');
var Profesor = require('../models/profesor');
var Materia = require('../models/materia');
var moment = require('moment');
const assert = require('assert');
var mongoose = require('mongoose');

function getEscuelaXuniversidad(req, res){
    var idEntUni    =   mongoose.Types.ObjectId(req.params.identidad);
    let query ={estado:1, identidad:idEntUni};

    Escuela.aggregate(
        [
            { $match:query},
            {$lookup:{
            from: "entidades",
            localField: "identidad",
            foreignField: "_id",
            as: "dataEntidad",
        }},
        {
            $project:{
                "identidad" :"$dataEntidad._id",
                "nombreEntidad" :"$dataEntidad.name",
                nombre : 1,
                facultad : 1,
                estado:1,
                _id:1
            }
        }
    ],
    function(err, cursor){
        assert.equal(err, null);
        return res.status(200).send({result:cursor,status:1,message:'ok'});   
     
    })
    /*
    Escuela.find(query)
    .exec((err, resultEntity)=>{
        if(err) return res.status(200).send({message:'Error de la peticion', status:0});
        return res.status(200).send({ result:resultEntity, status:1, message:'ok'});
    })
    */
}

function getEscuela(req, res){
    Escuela.aggregate(
        [
            { $match:{estado:1}},
            {$lookup:{
            from: "entidades",
            localField: "identidad",
            foreignField: "_id",
            as: "dataEntidad",
        }},
        {
            $project:{
                "identidad" :"$dataEntidad._id",
                "nombreEntidad" :"$dataEntidad.name",
                nombre : 1,
                facultad : 1
            }
        }
    ],
    function(err, cursor){
        assert.equal(err, null);
        return res.status(200).send({result:cursor,status:1,message:'ok'});   
     
    })
};

function getEscuelaXId(req, res){
    var idEntUni    =   mongoose.Types.ObjectId(req.params.identidad);
    let query ={estado:1, _id:idEntUni};

    Escuela.aggregate(
        [
            { $match:query},
            {$lookup:{
            from: "entidades",
            localField: "identidad",
            foreignField: "_id",
            as: "dataEntidad",
        }},
        {
            $project:{
                "identidad" :"$dataEntidad._id",
                "nombreEntidad" :"$dataEntidad.name",
                nombre : 1,
                facultad : 1
            }
        }
    ],
    function(err, cursor){
       
        assert.equal(err, null);
        return res.status(200).send({result:cursor,status:1,message:'ok'});   
     
    })
};

function saveEscuela(req, res){
    var params = req.body;
    if(!params.nombre) return res.status(200).send({message:'Debes enviar un texto', status:9});
    var escuela =  new Escuela();
    escuela.facultad = params.facultad;
    escuela.nombre   = params.nombre;
    escuela.estado   = 1;
    escuela.enabled  = true;
    escuela.created_at = moment().unix();
    escuela.identidad   = params.universidad;
    
    
    escuela.save((err, escuelaStored) =>{
        if(err) return res.status(500).send({message:'Error al guardar la aplicaion', status:0});
        if(!escuelaStored) return res.status(404).send({message:'La publicacion NO ha sido guardada',status:0});
        return res.status(200).send({escuela:escuelaStored, status:1});
    })
    
}

function saveProfesor(req, res){
    var params = req.body;
    if(!params.nombre) return res.status(200).send({message:'Debes enviar todos los datos',status:9});
    var profesor =  new Profesor();
    profesor.nombre   = params.nombre;
    profesor.apellidos = params.apellidos;
    profesor.estado   = 1;
    profesor.enabled  = true;
    profesor.created_at = moment().unix();
    profesor.save((err, profesorStored) =>{
        if(err) return res.status(500).send({message:'Error al guardar la aplicaion', status:0});
        if(!profesorStored) return res.status(404).send({message:'La publicacion NO ha sido guardada',status:0});
        return res.status(200).send({escuela:profesorStored, status:1});
    }); 
}

function editProfesor(req, res){
    var params = req.body;
     var update=  {nombre: params.nombre, apellidos: params.apellidos};
    if(!params._id) return res.status(200).send({message:'Debes enviar el id del profesor',status:9});
    var query = { _id: params._id};
    Profesor.findOneAndUpdate(query, update ,{new:true},
        (err, profesorUpdated) =>{
        if(err) return res.status(505).send({message:'No tienes permiso para actualizar los datos del usuario', status:0});
        if(!profesorUpdated) return res.status(404).send({message:'No se ha podido actualizar el usuario', status:0});
        return res.status(200).send({data:profesorUpdated, status:1});

    });
//}

}

function getProfesor(req, res){
    let query ={estado:1};
    Profesor.find(query)
    .exec((err, resultProfesor)=>{
        if(err) return res.status(200).send({message:'Error de la peticion', status:0});
        return res.status(200).send({result:resultProfesor,status:1,message:'ok'});
    })
}



function saveMateria(req, res){

    var params = req.body;
    if(!params.nombre) return res.status(200).send({message:'Debes enviar todos los datos',status:9});
    var materia =  new Materia();
    materia.escuela  = params.escuela;
    materia.nombre   = params.nombre;
    materia.semestre = params.semestre;
    materia.estado   = 1;
    materia.enabled  = true;
    materia.created_at = moment().unix();
    materia.identidad = params.entidad;
    materia.save((err, materiaStored) =>{
        if(err) return res.status(500).send({message:'Error al guardar la aplicaion', status:0});
        if(!materiaStored) return res.status(404).send({message:'La publicacion NO ha sido guardada',status:0});
        return res.status(200).send({escuela:materiaStored, status:1});
    })
    
    
    
}

function editMateria(req, res){
    var params = req.body;
    if(!params._id) return res.status(200).send({message:'Debes enviar el id de la materia',status:9});
    var query = { _id: params._id};
    var update=  {nombre: params.nombre, semestre: params.semestre,  estado: params.estado};
    Materia.findOneAndUpdate(query, update, {new:true}, (err, materiaUpdated) =>{
        if(err) return res.status(500).send({message:'Error al guardar la aplicaion', status:0});
        if(!materiaUpdated) return res.status(404).send({message:'La publicacion NO ha sido guardada',status:0});
        return res.status(200).send({escuela:materiaUpdated, status:1});
    })
    
    
}

function getMateria(req, res){
    let query ={estado:1};
    Materia.find(query)
    .exec((err, resultMateria)=>{
        if(err) return res.status(200).send({message:'Error de la peticion', status:0});
        return res.status(200).send({result:resultMateria,status:1,message:'ok'});
    })
}

module.exports={
    getEscuelaXuniversidad,
    getEscuela,
    getEscuelaXId,
    saveEscuela,
    saveProfesor,
    editProfesor,
    getProfesor,

    saveMateria,
    getMateria,
    editMateria
}