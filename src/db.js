/**
 * @author <marcus@publitechsistemas.com.br>
 */
require('dotenv-safe').load();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
module.exports.mongoose = mongoose;
module.exports.Schema = Schema;
connect();
/** 
 * Conexão com o Mongo Db Local
*/
function connect() {
   //var url = 'mongodb://localhost:32765/ponto';
   //console.log(process.env.MONGO_CONNECTION);
   mongoose.connect(global.mongo_local,function(error, client) {
    if(error) {
         console.log('Problema ao conectar ao Mongodb. Verifique!',error);
    }else {
        //global.db = client.db(process.env.MONGO_DB);        
        console.log('Conectado do Mongodb Local');
        }
    })
}