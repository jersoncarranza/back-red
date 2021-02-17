'use strict';

var moment = require('moment');
var Comentario = require('../models/comentario');

function saveComentario(req,res){
    var params = req.body;
    console.log(params);
    if(!params.comentario) return res.status(200).send({message:'Debes enviar un texto',status:0});
    var comentario = new Comentario();
    comentario.comentario = params.comentario;
    comentario.evaluacionprofesor =params.evaluacionprofesor;
    comentario.file = 'null';
    comentario.user = req.user.sub;
    comentario.created_at = moment().unix();

    comentario.save((err, comentarioStored) =>{
        if(err) return res.status(500).send({message:'Error a; guardar la aplicaion',status:0});
        if(!comentarioStored) return res.status(404).send({message:'La publicacion NO ha sido guardada',status:0});
        return res.status(200).send({comentario:comentarioStored,status:1});
    })
}

function getComentario(req, res){ 
    var page    = 1;
    var itemsPerPage = 8;
    var idEvaluacionProfesor = req.params.id;
    if(req.params.page){
        page  = req.params.page;
    }

    Comentario.find({evaluacionprofesor:idEvaluacionProfesor}).sort('-created_at').paginate(page, itemsPerPage,(err, comentariosPublicacion, total)=>{
        if(err) return res.status(404).send({message:'Error devolver publicaciones'+err, status:0});
        if(!comentariosPublicacion) return res.status(500).send({message:'No hay publicaciones', status:0});
    
        return res.status(200).send( {
            total_items: total,
            pages: Math.ceil(total/itemsPerPage),
            page:page,
            itemsPerPage:itemsPerPage, 
            data:comentariosPublicacion,
            status:1
            }
        )    
    });     

}
module.exports  = {
    saveComentario,
    getComentario
}