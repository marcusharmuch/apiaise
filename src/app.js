/**
 * @author <marcus@publitechsistemas.com.br>
 */
//var moment = require('moment');
var pg = require('pg');
//moment().format();
//const Swal = require('sweetalert2');
const express = require('express');
const app = express();
const router = express.Router();
var bodyParser = require('body-parser');
// var moment = require('moment');
// moment().format();
// moment.locale('pt-BR');
var moment = require('moment-timezone');
//moment().tz('Asia/Tokyo').format();
moment.locale('pt-BR');


//var flash = require('connect-flash');
//const passport = require('passport')
//const session = require('express-session')
//const MongoStore = require('connect-mongo')(session)
//app.use(express.static("."));
//app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(flash());
//require('./auth')(passport);
//app.use(session({
//     store: new MongoStore({
//        host: 'mongodb://marcusharmuch@ds133622.mlab.com:33622/ponto',
//        // port: '33622',
//         //db: 'session',
//         url: 'mongodb://marcusharmuch:cpd4522@ds133622.mlab.com:33622/ponto',
//         //db: global.db,
//         ttl: 15 * 60 // = 30 minutos de sessão
//     }),
//     secret: '123',//configure um segredo seu aqui
//     resave: false,
//     saveUninitialized: false
// }))
// moment.locale('pt-BR');
// app.use(passport.initialize());
// app.use(passport.session());


//Conexao com MongoDb Atlas
// var MongoClient = require('mongodb').MongoClient;
// var uri = "mongodb+srv://marcusharmuch:cpd4522@cluster0-6lzy5.mongodb.net/test?retryWrites=true";
// MongoClient.connect(uri, function(err, client) {
//    if(err) {
//         console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
//    }
//    console.log('Conectado do Mongodb Atlas On Line');
//Rotas
const index = require('./routes/index');
const getRoute = require('./routes/Route');
const postRoute = require('./routes/Route');
//serve static files from template
app.use('/', index);
app.use('/', getRoute);
app.use('/', postRoute);
module.exports = app;
