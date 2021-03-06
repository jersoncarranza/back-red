'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
//cargar rutas
var user_routes = require('./routes/user');
var follow_routes = require('./routes/follow');
var publication_routes = require('./routes/publications');
var message_routes = require('./routes/message'); 
var codigo_routes = require('./routes/codigo');
var match_routes = require('./routes/match');
var entidad_routes = require('./routes/entidad');
var escuela_routes = require('./routes/escuelaRoutes');
var evaluacionprofesor = require('./routes/evaluacionProfesor')

// middlewares -- antes de llegar al controlador
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//rutas
app.use('/api',user_routes);
app.use('/api',follow_routes);
app.use('/api', publication_routes);
app.use('/api', message_routes);
app.use('/api', codigo_routes);
app.use('/api', match_routes);

app.use('/admin', escuela_routes);
app.use('/admin', evaluacionprofesor);
app.use('/admin', entidad_routes);

// exportar 
module.exports = app;