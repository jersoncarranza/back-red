'use strict';
var Entidad = require('../models/entidade');

function getEntidad(req, res){
    let query ={estado:1};
    Entidad.find(query)
    .exec((err, resultEntity)=>{
      //  console.log(resultEntity)
        if(err) return res.status(200).send({message:'Error de la peticion', status:0});
        return res.status(200).send({result:resultEntity,status:1,message:'ok'});
    })
}

function saveEntidad(req, res){
    var params = req.body;

    if(!params.name) return res.status(200).send(
        {message:'Debes enviar todos los datos',status:9});
    var entidad =  new Entidad();
    entidad.name     = params.name;
    entidad.dominio  = params.dominio;
    entidad.estado   = 1;
    entidad.tipo     =  params.tipo == null? 'E':params.tipo ;
    entidad.descripcion = params.descripcion == null? 'Educativa': params.descripcion;
    FindEntidad( entidad.dominio).then((value)=>{
        if (value.count !== 1 ) {
            entidad.save((err, entidadStored) =>{
                if(!entidadStored) return res.status(200).send({message:'La publicacion NO ha sido guardada',status:0});
                if(err) return res.status(200).send({message:'Error al guardar la aplicaion', status:0});
                return res.status(200).send({data:entidadStored, status:1});
            }); 
        }else{
            return res.status(200).send({message:'Esta repetido', status:3});
        }
    })

}

function editEntidad(req, res){
    var params = req.body;
     var update=  {name: params.name, dominio: params.dominio};
    if(!params._id) return res.status(200).send({message:'Debes enviar el id del entidad',status:9});
    var query = { _id: params._id};
    entidad.findOneAndUpdate(query, update ,{new:true},
        (err, entidadUpdated) =>{
        if(err) return res.status(505).send({message:'No tienes permiso para actualizar los datos del usuario', status:0});
        if(!entidadUpdated) return res.status(404).send({message:'No se ha podido actualizar el usuario', status:0});
        return res.status(200).send({data:entidadUpdated, status:1});

    });
}


 //  Buscar entidades Entidade Universidades
 async function FindEntidad(mail) {
    var dominio =  mail.trim();
    var query = {'dominio':dominio};
    var data ;
    //var entidad =  new Entidad();
    var findEntity = await Entidad.findOne(query)
    .exec()
    .then((resultEntity) => { 
        if(resultEntity){
            data = {
                data:resultEntity,
                count:1
            }
        }else{
            data = {
                data:resultEntity,
                count:0
            } 
        }
        return Promise.resolve(data);
    })
    .catch((err) => { return handleError(err);    });
    return Promise.resolve(findEntity);
    }
module.exports={
    getEntidad,
    saveEntidad,
    editEntidad
}