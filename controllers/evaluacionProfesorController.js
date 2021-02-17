'use strict';
var Escuela = require('../models/escuela');
var Profesor = require('../models/profesor');
var EstrellasEvaluacion= require('../models/estrellasEvaluacion');
var EvaluacionProfesor = require('../models/EvaluacionProfesor');
var moment = require('moment');
//const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var mongoose = require('mongoose');

function getEvaluacionProfesor(req, res,next){
    var Id_profesor = req.params.profesor;
    if(!Id_profesor) return res.status(200).send({message:'Debes enviar un texto', status:9});

 
        var id = mongoose.Types.ObjectId(Id_profesor);
        EvaluacionProfesor.aggregate(
            [   { $match:{idProfesor: id, estado:1}},// numero:1
                {$lookup:{
                from: "profesors",
                localField: "idProfesor",
                foreignField: "_id",
                as: "dataProfesor",
                }},
                {$lookup:{
                from: "materias",
                localField: "idMateria",
                foreignField: "_id",
                as: "dataMateria",
            }},
            {
                $project:{
                    "materia" :"$dataMateria.nombre",
                    "semestre" :"$dataMateria.semestre",
                    "profesor" :"$dataProfesor.nombre",
                    "profesorapellidos" :"$dataProfesor.apellidos",
                    calificacion:1,
                    numero:1,
                    periodo:1,
                    created_at:1,
                    estudiantes:1
                }
            }
            ],
            function(err, cursor) {
                assert.equal(err, null);
        
                return res.status(200).send({cursor,status:1,message:'ok'});   
            })

}

function saveEvaluacionProfesor(req, res){
    var params = req.body;
    if(!params.profesor && !params.materia) return res.status(200).send({message:'Debes enviar un texto', status:9});
    var evaluacionProfesor =  new EvaluacionProfesor();
    evaluacionProfesor.idProfesor   = params.profesor;
    evaluacionProfesor.idMateria    = params.materia;
    evaluacionProfesor.estado       = 1;
    evaluacionProfesor.enabled      = true;
    evaluacionProfesor.created_at   = moment().unix();
    evaluacionProfesor.periodo      = params.periodo;
    evaluacionProfesor.numero       = params.numero;//cada semestre aumenta 1
    evaluacionProfesor.calificacion = params.calificacion;
    evaluacionProfesor.estudiantes  = params.estudiantes;
    evaluacionProfesor.idEscuela  = params.idEscuela;
    evaluacionProfesor.idEntidad  = params.idEntidad;

    
    FindProfesorMateriaSemestre(evaluacionProfesor.idProfesor, evaluacionProfesor.idMateria, evaluacionProfesor.numero).then((value)=>{

        if (value.count == 0 ) {
            evaluacionProfesor.save((err, evaProfesorStored) =>{
                if(err) return res.status(500).send({message:'Error al guardar la aplicaion', status:0});
                if(!evaProfesorStored) return res.status(404).send({message:'La publicacion NO ha sido guardada',status:0});
                return res.status(200).send({data:evaProfesorStored, status:1});
            })

        }else{
             return res.status(200).send({message:'Ya existe ese profesor con esa materia(semestre)', status:3});
        }
    });
}

    async function FindProfesorMateriaSemestre(idProfesor,idMateria,numero) {
        var query = {idProfesor: idProfesor, idMateria:idMateria, numero:numero};
        var data ;
        var findEntity = await EvaluacionProfesor.countDocuments(query)
        .exec()
        .then((resultCount) => {
            if(resultCount){data = { count:resultCount}
            }else{
                data = {  count:resultCount}
            }
            return Promise.resolve(data);
        })
        return Promise.resolve(findEntity);
    }



function getEvaluacionProfesorXEstudiantes(req, res,next){
    //var idEntidadUniversidadParams = req.params.identidad;
    
    //let query;
    //console.log('respuesta '+req.params.identidad);
   // if (req.params.identidad !== 'undefined') {//Con universidad
    let idescuela  =   mongoose.Types.ObjectId(req.params.idescuela);
    //console.log(idescuela);
    let query     =   {estado:1,  idEscuela:idescuela};
    //}else{// sin universidad
    //    query           =   {estado:1, enabled:true}
    //}
    getAwaitEstrellasEvaluacionProfesor().then((value)=>{

        EvaluacionProfesor.aggregate(
            [   { $match:query},// numero:1
                {$lookup:{
                 from: "profesors",
                 localField: "idProfesor", 
                 foreignField: "_id",
                 as: "dataProfesor",
                }},
                {$lookup:{
                 from: "materias",
                 localField: "idMateria",
                 foreignField: "_id",
                 as: "dataMateria",
               }},
               {
                   $project:{
                       "materia" :"$dataMateria.nombre",
                       "idmateria" :"$dataMateria._id",
                       "semestre" :"$dataMateria.semestre",
                       "profesor" :"$dataProfesor.nombre",
                       "idprofesor" :"$dataProfesor._id",
                       "profesorapellidos" :"$dataProfesor.apellidos",
                       calificacion:1,
                       numero:1,
                       periodo:1,
                       created_at:1,
                       estudiantes:1,
                       _id:1
                   }
               }
            ],
            function(err, cursor) {
                assert.equal(err, null);
        
                return res.status(200).send(
                    {cursor,start:value.result,status:1,message:'ok'});   
            })
        });

    }

/**Obteniendo dato de un solo/ profesor *****/
    function getEvaluacionProfesorUnico(req, res,next){

        //if(req.params.id==null) return res.status(200).send({message:'Debes enviar un texto', status:9});
        var idProfesorParams = req.params.profesor;
        var id = mongoose.Types.ObjectId(idProfesorParams);

        getAwaitEstrellasEvaluacionProfesorUnico(idProfesorParams).then((value)=>{
    
            EvaluacionProfesor.aggregate(
                [   { $match:{estado:1, enabled:true, _id: id}},// numero:1
                    {$lookup:{
                     from: "profesors",
                     localField: "idProfesor",
                     foreignField: "_id",
                     as: "dataProfesor",
                    }},
                    {$lookup:{
                     from: "materias",
                     localField: "idMateria", 
                     foreignField: "_id",
                     as: "dataMateria",
                   }},
                   {
                       $project:{
                           "materia" :"$dataMateria.nombre",
                           "semestre" :"$dataMateria.semestre",
                           "profesor" :"$dataProfesor.nombre",
                           "profesorapellidos" :"$dataProfesor.apellidos",
                           calificacion:1,
                           numero:1,
                           periodo:1,
                           created_at:1,
                           estudiantes:1,
                           _id:1
                       }
                   }
                ],
                function(err, cursor) {
                    assert.equal(err, null);
            
                    return res.status(200).send(
                        //{cursor,status:1,message:'ok'}); 
                        {cursor,start:value.result,status:1,message:'ok'});   

                })

            });
    
        }
/*****Estrellass*******/    
    function saveEstrellasEvaluacion(req, res){
    var params = req.body;
    if(!params.idEvaluacionProfesor && !params.idEstudiante && !params.calificacion) return res.status(200).send({message:'Debes enviar un texto', status:9});
    var estrellasEvaluacion =  new EstrellasEvaluacion();

    estrellasEvaluacion.idevaluacionprofesor   = params.idEvaluacionProfesor;
    estrellasEvaluacion.idestudiante    = params.idEstudiante;
    estrellasEvaluacion.calificacion = params.calificacion;
    estrellasEvaluacion.estado       = 1;
    estrellasEvaluacion.enabled      = true;
    estrellasEvaluacion.created_at   = moment().unix();
    
    FindEstrellasEvaluacion(params.idEvaluacionProfesor, params.idEstudiante).then((value)=>{
        if (value.count == 0 ) {
            estrellasEvaluacion.save((err, estrellasEvaluacionStored) =>{
                if(err) return res.status(500).send({message:'Error al guardar la aplicaion', status:0});
                if(!estrellasEvaluacionStored) return res.status(404).send({message:'La publicacion NO ha sido guardada',status:0});
                return res.status(200).send({data:estrellasEvaluacionStored, status:1});
            })

        }else{
            const query = {idevaluacionprofesor: params.idEvaluacionProfesor, idestudiante: params.idEstudiante};
            const update = {$set:{ calificacion: params.calificacion }};
            const options ={new: true};
            EstrellasEvaluacion.findOneAndUpdate(query, update,options,(err, estrellasEvaluacionModified)=>{
                if(err) return res.status(500).send({message:'Error al guardar la aplicaion', status:0});
                if(!estrellasEvaluacionModified) return res.status(404).send({message:'La publicacion NO ha sido guardada',status:0});
                return res.status(200).send({data:estrellasEvaluacionModified, status:1});


            });
        }
    });
}

async function FindEstrellasEvaluacion(idEvaluacionProfesor,idEstudiante) {
    var query = {idevaluacionprofesor: idEvaluacionProfesor, idestudiante:idEstudiante};
    var data ;
    var findEntity = await EstrellasEvaluacion.countDocuments(query)
    .exec()
    .then((resultCount) => {
        if(resultCount){data = { count:resultCount}
        }else{
            data = {  count:resultCount}
        }
        return Promise.resolve(data);
    })
    return Promise.resolve(findEntity);
}


function getEstrellasEvaluacionProfesor(req, res){
  
 
        EstrellasEvaluacion.aggregate([ 
                { $match:{estado:1}}, 
            {$group : 
                {
                    _id:"$idevaluacionprofesor", 
                    countDocument:{$sum:1},
                    suma:{$sum:"$calificacion"},
                    e1:  {$sum:{ $cond:[{$eq: [ "$calificacion", 1] }, 1, 0 ]}},
                    e2:  {$sum:{ $cond:[{$eq: [ "$calificacion", 2] }, 1, 0 ]}},
                    e3:  {$sum:{ $cond:[{$eq: [ "$calificacion", 3] }, 1, 0 ]}},
                    e4:  {$sum:{ $cond:[{$eq: [ "$calificacion", 4] }, 1, 0 ]}},
                    e5:  {$sum:{ $cond:[{$eq: [ "$calificacion", 5] }, 1, 0 ]}}
                },
            },
            { $project: {
                "numerodocumentos":"$countDocument",
                "promedio":{$divide:["$suma","$countDocument" ]},
                "e1":"$e1",
                "e2":"$e2",
                "e3":"$e3",
                "e4":"$e4",
                "e5":"$e5"
                }
            }
        
        ],
            function(err, data) {
                assert.equal(err, null);
                return res.status(200).send({data,status:1,message:'ok'});   
            })
}



async function getAwaitEstrellasEvaluacionProfesor(){
    var data ;
    var findEntity = await EstrellasEvaluacion.aggregate([ 
        { $match:{estado:1}}, 
        {$group : 
            {
                _id:"$idevaluacionprofesor", 
                countDocument:{$sum:1},
                suma:{$sum:"$calificacion"},
                e1:  {$sum:{ $cond:[{$eq: [ "$calificacion", 1] }, 1, 0 ]}},
                e2:  {$sum:{ $cond:[{$eq: [ "$calificacion", 2] }, 1, 0 ]}},
                e3:  {$sum:{ $cond:[{$eq: [ "$calificacion", 3] }, 1, 0 ]}},
                e4:  {$sum:{ $cond:[{$eq: [ "$calificacion", 4] }, 1, 0 ]}},
                e5:  {$sum:{ $cond:[{$eq: [ "$calificacion", 5] }, 1, 0 ]}}
            },
        },
        { $project: {
            "numerodocumentos":"$countDocument",
            "promedio":{$divide:["$suma","$countDocument" ]},
            "e1":"$e1",
            "e2":"$e2",
            "e3":"$e3",
            "e4":"$e4",
            "e5":"$e5"
            }
        }

    ])
    .exec()
    .then((result) => {
        data = { result:result};
        return Promise.resolve(data);
    })
    return Promise.resolve(findEntity);
}
/*******Dato de valuacion de un solo profesor *******/

async function getAwaitEstrellasEvaluacionProfesorUnico(Id_profesor){
    var data ;
    var id = mongoose.Types.ObjectId(Id_profesor);
    var findEntity = await EstrellasEvaluacion.aggregate([ 
        { $match:{estado:1,idevaluacionprofesor: id }}, 
        {$group : 
            {
                _id:"$idevaluacionprofesor", 
                countDocument:{$sum:1},
                suma:{$sum:"$calificacion"},
                e1:  {$sum:{ $cond:[{$eq: [ "$calificacion", 1] }, 1, 0 ]}},
                e2:  {$sum:{ $cond:[{$eq: [ "$calificacion", 2] }, 1, 0 ]}},
                e3:  {$sum:{ $cond:[{$eq: [ "$calificacion", 3] }, 1, 0 ]}},
                e4:  {$sum:{ $cond:[{$eq: [ "$calificacion", 4] }, 1, 0 ]}},
                e5:  {$sum:{ $cond:[{$eq: [ "$calificacion", 5] }, 1, 0 ]}}
            },
        },
        { $project: {
            "numerodocumentos":"$countDocument",
            "promedio":{$divide:["$suma","$countDocument" ]},
            "e1":"$e1",
            "e2":"$e2",
            "e3":"$e3",
            "e4":"$e4",
            "e5":"$e5"
            }
        }

    ])
    .exec()
    .then((result) => {
        data = { result:result};
        return Promise.resolve(data);
    })
    return Promise.resolve(findEntity);
}

/**********************/
module.exports={
    getEvaluacionProfesor,
    saveEvaluacionProfesor,
    getEvaluacionProfesorXEstudiantes,
    getEvaluacionProfesorUnico,
    saveEstrellasEvaluacion,
    getEstrellasEvaluacionProfesor
}