/**
 * @author <marcus@publitechsistemas.com.br>
 */
const app = require('../src/app');
const bodyParser = require('body-parser');
const port = normalizaPort(process.env.PORT || '3100');

//require('dotenv-safe').load();

// const mongoClient = require("mongodb").MongoClient;
// mongoClient.connect(process.env.MONGO_CONNECTION, function (err, conn) {
//     if (err) { return console.log(err); }
//     console.log("Conectado ao MongoDB mLab!");
//     global.db = conn.db(process.env.MONGO_DB);
//     //console.log(global.db);
//     })
//     // var mongoose = require('mongoose');
//     // var Schema = mongoose.Schema;
//     // module.exports.mongoose = mongoose;
//     // module.exports.Schema = Schema;
//     // connect();
//     // /** 
//     //  * Conexão com o Mongo Db Local
//     // */
//     // function connect() {
//     //    mongoose.connect(process.env.MONGO_CONNECTION,function(error, client) {
//     //     if(error) {
//     //          console.log('Problema ao conectar ao Mongodb. Verifique!',error);
//     //     }else {
//     //         //global.db = conn.db(process.env.MONGO_DB);        
//     //         console.log('Conectado do Mongodb Local');
//     //         }
//     //     })
//     // }
    /**
     * 
     * @param {*} val
     * Inicialização da aplicaçaão na porta Local 
     */
    function normalizaPort(val) {
        const port = parseInt(val, 10);
        if (isNaN(port)) {
            return val;
        }
        if (port >= 0) {
            return port;
        }
        return false;
    }
    app.listen(port, function () {
        console.log(`Aplicação Iniciada na porta ${port}`)
    })