var pg = require('pg');
module.exports.pg = pg;
connect();


//const connectionString = process.env.DATABASE_URL || 'postgres://192.168.20.37:5432/pmfarol';
/**
 * 
 */
function connect() {
    //var url = 'postgres://192.168.20.37:5432/pmfarol';

    const connectionString = process.env.DATABASE_URL || 'postgres://aise:gkdwps.aise@192.168.20.37:5432/pmfarol';
    
    var client = new pg.Client(connectionString);
    client.connect(function(error, client) {
        if(error) {
            console.log('Problema ao conectar ao Postgres. Verifique!',error);
       }
       console.log('Conectado ao Postgres');
       })    
    //    const query = client.query('SELECT * FROM aise.profissao', function(err, result) {
        
    //     if (err) {
    //       return console.error('error running query', err);
    //     }
    //     console.log(result);
    //   })
     // pg.connect(connectionString,function(error, client) {
    //  if(error) {
    //       console.log('Problema ao conectar ao Postgres. Verifique!',error);
    //  }
    //  console.log('Conectado do Postgres');
    //  })
 }



// const client = new pg.Client(connectionString);
// client.connect();
//const query = client.query(
//  'CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
//query.on('end', () => { client.end(); });