/**
 * @author <marcus@publitechsistemas.com.br>
 */
module.exports.gravaPontodb = gravaPontodb;
module.exports.consultaAise = consultaAise;
module.exports.criaRequisicao = criaRequisicao;
module.exports.gravaFuncionario = gravaFuncionario;
module.exports.consultaFuncionario = consultaFuncionario;
module.exports.consultaRequisicao = consultaRequisicao;
/**
 * 
 * @param {*} req (requisiçao para consulta, traz tb a configuração do aise)
 * @param {*} callback (retorno:error,result)
 */

function consultaAise(req, callback) {
  connect();
  function connect() {
    var pg = require('pg');
    const connectionString = process.env.DATABASE_URL || global.aise;
    client = new pg.Client(connectionString);
    client.connect(function (error, client) {
      if (error) {
        console.log('Problema ao conectar ao Postgres. Verifique!', error);
        callback(error, false);
        return;
      } else {
        console.log('Conectado ao Postgres');
        const query = client.query(req.body.sql, function (error, result) {
          if (error) {
            console.error('error running query', error);
            callback(error, null);
          } else {
            if (result.rowCount == 0 | result == null) {
              error = "Funcionário não encontrado no Aise."
              callback(error, null);
              return
            } else {
              callback(null, result);
              return
            }
          }
        })
      }
    })
    return;
    // consulta_sql = require('./requisicao_aiseModel.js');
    // consulta_sql.requisicao_aise(req.body.cpf, function (error, sql) {
    //   if (error) {
    //    callback(error, null);
    //   } else {
    //    const query = client.query(sql, function (error, result) {
    //      if (error) {
    //        console.error('error running query', error);
    //        callback(error, null);
    //      } else {
    //        if (result.rowCount == 0 | result == null) {
    //           error = "Funcionário não encontrado no Aise."
    //           callback(error, null);
    //         } else {
    //           callback(null, result);
    //         }
    //       }
    //     })
    //   }
    // });
  }
}
function consultaRequisicao(req, callback) {
  connect();
  function connect() {
    var pg = require('pg');
    const connectionString = process.env.DATABASE_URL || req.body.config_aise;
    client = new pg.Client(connectionString);
    client.connect(function (error, client) {
      if (error) {
        console.log('Problema ao conectar ao Postgres. Verifique!', error);
        callback(error, false);
        return;
      } else {
        console.log('Conectado ao Postgres');
        if (!global.ultimo_enviado) {
          var moment = require('moment');
          var data_atual = new Date();
          var converte = moment.utc(data_atual).toDate();
          /**
           * definido 01 para começar no inicio do mes corrente.
           */
          var data_inicial = moment(converte).local().format('YYYY-MM-01 00:00:00.000000');
          global.ultimo_enviado = data_inicial;
        }
        consulta_sql = "select * from justificativaponto where dataalteracao > '" + global.ultimo_enviado + "' and enviada = false";

        const query = client.query(consulta_sql, function (error, result) {
          if (error) {
            console.error('error running query', error);
            return (error, null);
          } else {

            if (result.rowCount > 0) {

              // for (let i = 0, p = Promise.resolve(justificativa); i < result.rowCount; i++) {//i < req.lentght
              //   p = p.then(_ => new Promise(resolve => {
              /**
              * Fazer a conversao para todas as datas que serão comparadas
              */
              var moment = require('moment');
              var data_atual = new Date();
              var converte = moment.utc(data_atual).toDate();
              var data_atual = moment(converte).local().format('YYYY-MM-DD HH:mm:ss');
              /**
               * Arrumar depois. Só para testar o horario q vai começar
               */
              // if (!global.ultimo_enviado) {
              //   var stillUtc = moment.utc(result.rows[6].dataalteracao).toDate();
              //   var teste = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss.999999');
              //   global.ultimo_enviado = teste;
              // }
              //console.log(global.ultimo_enviado);
              //console.log(global.ultimo_enviado);
              quadro_horas = new String();

              for (let i = 0, p = Promise.resolve(quadro_horas); i < result.rowCount; i++) {//i < req.lentght
                p = p.then(_ => new Promise(resolve => {
                  console.log('entrou na primeira promise');
                  console.log(result.rowCount);
                  var ultimo_horario = result.rows[i].dataalteracao;

                  const matricula = result.rows[i].matricula;
                  const movimentacao = result.rows[i].movimentacao;
                  AiseModel = require('../model/justificativa_aiseModel.js');
                  parametros = new String();

                  parametros.matricula = matricula;
                  parametros.movimentacao = movimentacao;

                  //req.body.matricula = matricula;
                  //req.movimentacao = movimentacao;
                  //console.log(parametros);
                  AiseModel.justificativa_aise(parametros, function (error, result) {
                    if (error) {
                      return (error, null);
                    } else {
                      var consulta_sql_justificativa = result;
                      const query = client.query(consulta_sql_justificativa, function (error, result) {
                        if (error) {
                          console.error('error running query', error);
                          return (error, null);
                        } else {
                          //teste = JSON.stringify(result.rows[0].matricula);
                          parametros.horariotrabalho = result.rows[0].horariotrabalho;
                          parametros.motivo = result.rows[0].idponto;
                          //Data Inicial
                          let data_inicial = result.rows[0].datainicial;
                          parametros.data_inicial = data_inicial;
                          parametros.ano_inicial = data_inicial.getFullYear();
                          /**
                           * No get do mes, Janeiro é igual a 0 
                           * 
                           */
                          let converte_mes = data_inicial.getMonth();
                          let adiciona_mes = converte_mes + 1;
                          parametros.mes_inicial = adiciona_mes;
                          parametros.dia_inicial = data_inicial.getDate();

                          //Data final
                          let data_final = result.rows[0].datafinal;
                          //parametros.data_final = data_final;
                          var moment = require('moment');

                          var converte = moment.utc(data_final).toDate();
                          parametros.data_final = converte;
                          parametros.ano_final = data_final.getFullYear();
                          let converte_mes_final = data_final.getMonth();
                          let adiciona_mes_final = converte_mes_final + 1;
                          parametros.mes_final = adiciona_mes_final;
                          parametros.dia_final = data_final.getDate();
                          parametros.horas = "";//vai pegar do quadro de horas lá no ponto gestor
                          //parametros.ultimo_enviado = result.rows[0].dataalteracao;
                          console.log(parametros);
                          var consulta = "?registro_folha=" + parametros.matricula;
                          /**
                         * Obs. Trocar essa requisicao feita ao  ponto gestor por um arquivo js.
                         */

                          var request = require('request'), default_headers, url = global.url_gestor + '/v1/funcionarios/' + consulta;
                          default_headers = { 'X-Auth-Token': global.token, 'Content-type': 'application/json', 'Accept': 'application/json' };
                          request({
                            url: url,
                            headers: default_headers,
                            method: 'GET',
                          }, function (error, res, body) {
                            /**
                             * Obs. Tratar erros de acesso negado. StatusCode
                             */
                            if (error) {
                              console.log("Ocorreu um erro ao comunicar-se com o Ponto Gestor!" + error);
                              callback("Ocorreu um erro ao comunicar-se com o Ponto Gestor!" + error, null);
                              return;
                              //callback("Ocorreu um erro ao comunicar-se com o Ponto Gestor!" + error, null, null);
                            }
                            if (!error && res.statusCode == 401) {
                              console.log("Erro ao conectar-se ao Ponto Gestor:" + res.statusMessage);
                              callback("Erro ao conectar-se ao Ponto Gestor:" + res.statusMessage, null, null);
                              return;
                              //callback("Erro ao conectar-se ao Ponto Gestor!<br> Código de erro: " + res.statusCode + " - " + res.statusMessage, null, null);
                            } else if (!error && res.statusCode == 200) {
                              console.log("Resultado da consulta:" + res.statusCode);
                              parametros2 = JSON.parse(body);
                              console.log(parametros2);
                              /**
                               * Consulta se o funcionário tem quadro de hora cadastrado
                               * [0] para pegar o primeiro retorno ; sempre será apenas um retorno
                               */
                              //var consulta = "aedd148a-5a25-4f87-ba05-b46779423bbd"//parametros2[0].uid;
                              var consulta = parametros2[0].uid;
                              var request = require('request'), default_headers, url = url = global.url_gestor + '/v1/funcionarios/' + consulta + '/quadros_de_horas';
                              default_headers = { 'X-Auth-Token': global.token, 'Content-type': 'application/json', 'Accept': 'application/json' };
                              request({
                                url: url,
                                headers: default_headers,
                                method: 'GET',
                              }, function (error, res, body) {
                                /**
                                 * Obs. Tratar erros de acesso negado. StatusCode
                                 */
                                if (error) {
                                  console.log("Ocorreu um erro ao comunicar-se com o Ponto Gestor!" + error);
                                  return;
                                  //callback("Ocorreu um erro ao comunicar-se com o Ponto Gestor!" + error, null, null);
                                }
                                if (!error && res.statusCode == 401) {
                                  console.log("Erro ao conectar-se ao Ponto Gestor:" + res.statusMessage);
                                  return;
                                  //callback("Erro ao conectar-se ao Ponto Gestor!<br> Código de erro: " + res.statusCode + " - " + res.statusMessage, null, null);
                                } else if (!error && res.statusCode == 200) {
                                  /**
                                   * Verifica se o quadro de horas que esta no ponto Gestor é o mesmo que esta no aise;
                                   * Caso nao seja o mesmo, ele vai alterar no ponto gestor para o que esta no AISE
                                   *  */

                                  if (body != "[]") {

                                    parametros3 = new Array();
                                    parametros3 = JSON.parse(body);
                                    console.log(parametros3.length);
                                    for (let i = 0; i < parametros3.length; i++) {
                                      var moment = require('moment');
                                      console.log(parametros3[i].data_vigencia);
                                      if (moment(parametros3[i].data_vigencia).isBetween(parametros.data_inicial, parametros.data_final)) {
                                        if (parametros3[i].quadro_de_hora.ch == parametros.horariotrabalho && parametros3[i].data_vigencia == parametros.data_inicial) {
                                          var ch_igual = true;
                                        } else {
                                          var ch_igual = false;
                                          //se for false, vai excluir o quadro de horas//rota ainda nao implementada
                                        }
                                      }
                                    }
                                  }
                                  inserirQuadro_horas();
                                  async function inserirQuadro_horas() {
                                    //aguarda verificar, excluir e inserir se necessário o quadro de horas
                                    await funcaoQuadro_de_horas();
                                    console.log('voltou do quadro de horas');
                                    //aguarda verificar, excluir e inserir se necessário as justificativa do dia
                                    await funcaoJustificativa();
                                    callback(null,"Deu Certo");
                                    console.log('Voltou das justificativa');


                                    async function funcaoJustificativa() {


                                      return new Promise(function (resolve, reject) {

                                        var moment = require('moment');
                                        for (let i = parametros.data_inicial, p = Promise.resolve(); i <= parametros.data_final; i = moment(i).add(1, "day").toDate()) {
                                          p = p.then(_ => new Promise(resolve => {
                                            //for (let i = parametros.data_inicial; p = Promise.resolve(); i <= parametros.data_final; i = moment(i).add(1, "day").toDate())) {
                                            parametros.ano = i.getFullYear();
                                            let converte_mes = i.getMonth();
                                            let adiciona_mes = converte_mes + 1;
                                            parametros.mes = adiciona_mes;
                                            parametros.dia = i.getDate();

                                            var converte = moment.utc(i).toDate();
                                            var data_justificativa = moment(converte).local().format('YYYY-MM-DD');
                                            //console.log(parametros2[0].uid);
                                            req = '{"cartao_ponto_justificativa":{"data":"' + data_justificativa + '","hora":"0","motivo_id":"' + parametros.motivo + '"}}';
                                            var request = require('request'), default_headers, url = global.url_gestor + '/v1/funcionarios/' + parametros2[0].uid + '/cartao_ponto/' + parametros.ano + '/' + parametros.mes + '/justificativas';
                                            default_headers = { 'X-Auth-Token': global.token, 'Content-type': 'application/json', 'Accept': 'application/json' };
                                            request({
                                              url: url,
                                              headers: default_headers,
                                              method: 'POST',
                                              body: req
                                            }, function (error, res, body) {
                                              if (error) {
                                                console.log(error);
                                                callback(erro,null);
                                              } else {
                                                console.log(body + res.statusMessage);
                                                if (res.statusCode == 201 | res.statusCode == 200) {
                                                  var moment = require('moment');
                                                  var stillUtc = moment.utc(ultimo_horario).toDate();
                                                  var fuso = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss.999999');
                                                  global.ultimo_enviado = fuso;


                                                  console.log(global.ultimo_enviado);
                                                  var sql_atualiza = "update aise.justificativaponto set enviada = true where matricula = " + parametros.matricula + " and movimentacao = " + parametros.movimentacao + "";
                                                  client.query(sql_atualiza, function (error, result) {
                                                    if (error) {
                                                      console.error('Erro ao atualzar status da matricula:' + parametros.matricula + '', error);
                                                      callback(erro,null);
                                                    };
                                                  });
                                                  resolve();

                                                } else {
                                                  console.log(res.statusCode);
                                                  console.log('Não fez nada. Nova tentativa sera realizada na próxima inserção');
                                                  resolve();
                                                }
                                              };

                                            });
                                          })).then(_ => {
                                            if (i >= parametros.data_final) {
                                              resolve();
                                            }
                                          });
                                        };
                                      });
                                    }
                                    //return;
                                  };
                                  /**
                                   * Se não tiver quadro de hora, ou se tiver e não for mesma vigencia e horario, 
                                   *  vai pegar do aise e inserir no ponto.
                                   */


                                  async function funcaoQuadro_de_horas() {
                                    return new Promise(function (resolve, reject) {
                                      if (body == "[]" | !body | body == null | ch_igual == false) {

                                        var consulta = parametros2[0].uid;
                                        var moment = require('moment');
                                        var converte = moment.utc(parametros.data_inicial).toDate();
                                        var data_vigencia = moment(converte).local().format('YYYY-MM-DD');
                                        req = '{"funcionario_quadro_de_hora":{"data_vigencia":"' + data_vigencia + '","ch":"' + parametros.horariotrabalho + '"}}';
                                        var request = require('request'), default_headers, url = global.url_gestor + '/v1/funcionarios/' + consulta + '/quadros_de_horas';
                                        default_headers = { 'X-Auth-Token': global.token, 'Content-type': 'application/json', 'Accept': 'application/json' };
                                        request({
                                          url: url,
                                          headers: default_headers,
                                          method: 'POST',
                                          body: req
                                        }, function (error, res, body) {
                                          if (error) {
                                            console.log(error);
                                            return;
                                          } else {
                                            console.log(body + res.statusMessage);
                                            resolve(res.statusCode);
                                          }
                                        });
                                      } else {
                                        console.log('Quadro de horas já cadastrado idem ao AISE ');
                                        resolve();
                                      };
                                    });

                                  }
                                  //return;
                                  // var moment = require('moment');
                                  // for (let i = parametros.data_inicial; i <= parametros.data_final; i = moment(i).add(1, "day").toDate()) {
                                  //   parametros.ano = i.getFullYear();
                                  //   let converte_mes = i.getMonth();
                                  //   let adiciona_mes = converte_mes + 1;
                                  //   parametros.mes = adiciona_mes;
                                  //   parametros.dia = i.getDate();

                                  //   var converte = moment.utc(i).toDate();
                                  //   var data_justificativa = moment(converte).local().format('YYYY-MM-DD');
                                  //   //console.log(parametros2[0].uid);
                                  //   req = '{"cartao_ponto_justificativa":{"data":"' + data_justificativa + '","hora":"","motivo_id":"' + parametros.motivo + '"}}';
                                  //   var request = require('request'), default_headers, url = 'http://api.961500-156727877.reviews.pontogestor.com/v1/funcionarios/' + parametros2[0].uid + '/cartao_ponto/' + parametros.ano + '/' + parametros.mes + '/justificativas';

                                  //   default_headers = { 'X-Auth-Token': 'kDQ_K5h_74aB3FWxy2eS', 'Content-type': 'application/json', 'Accept': 'application/json' };
                                  //   request({
                                  //     url: url,
                                  //     headers: default_headers,
                                  //     method: 'POST',
                                  //     body: req
                                  //   }, function (error, res, body) {
                                  //     if (error) {
                                  //       console.log(error);
                                  //       return;
                                  //     } else {
                                  //       console.log(body + res.statusMessage);
                                  //       if (res.statusCode == 201 | res.statusCode == 200) {
                                  //         console.log(res.statusCode);
                                  //         var moment = require('moment');
                                  //         var stillUtc = moment.utc(ultimo_horario).toDate();
                                  //         var fuso = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss.999999');
                                  //         global.ultimo_enviado = fuso;

                                  //         console.log(global.ultimo_enviado);
                                  //         var sql_atualiza = "update aise.justificativaponto set enviada = true where matricula = " + parametros.matricula + " and movimentacao = " + parametros.movimentacao + "";
                                  //         client.query(sql_atualiza, function (error, result) {
                                  //           if (error) {
                                  //             console.error('Erro ao atualzar status da matricula:' + parametros.matricula + '', error);
                                  //             return;
                                  //           };
                                  //         });
                                  //         resolve(quadro_horas);
                                  //       } else {
                                  //         console.log('Não fez nada. Nova tentativa sera realizada na próxima inserção');
                                  //         return;
                                  //       }
                                  //     }
                                  //   });
                                  //   //console.log(parametros.dia_inicial, parametros.mes_inicial, parametros.ano_inicial);
                                  //   //   console.log(parametros.dia_final, parametros.mes_final, parametros.ano_final);
                                  //   //resolve(quadro_horas);

                                  // }
                                  // justificativa = new String();

                                  // for (let i = 0, p = Promise.resolve(justificativa); i < result.rowCount; i++) {//i < req.lentght
                                  //   p = p.then(_ => new Promise(resolve => {
                                  //     console.log('Entrou na Promise para inserir justificativa');
                                  //     console.log(result.rowCount);
                                  //     resolve(justificativa);
                                  //   }));
                                  //   console.log('teste ordem');
                                  // };

                                  /**
                                   * Criação e inserção da justificativa
                                   * 
                                   */




                                } else {

                                  console.log("Consulta quadro de horas - Houve erros na consulta no Ponto Gestor. Verifique se o funcionário está cadastrado.");
                                  return;
                                  //callback(null, res.body, null);
                                }
                              });

                              //callback(null, null, res.statusCode);
                            } else {
                              console.log("Houve erros na consulta no Ponto Gestor. Verifique se o funcionário está cadastrado.");
                              return;
                              //callback(null, res.body, null);
                            }
                          });

                        };

                      });
                    }
                  });
                  // var stillUtc = moment.utc(result.rows[i].dataalteracao).toDate();
                  // var fuso = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss.999999');
                  // global.ultimo_enviado = fuso;
                  // console.log(global.ultimo_enviado);
                }));
              };

              //console.log(global.ultimo_enviado);
            } else {
              console.log("fechou a conexao");
              client.end();
              callback(null,"Justificativas já inseridas");
            }
            //console.log(global.ultimo_enviado);
            //client.end();

            // var stillUtc = moment.utc(result.rows[6].dataalteracao).toDate();
            // var fuso = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');
            // var data = new Date();
            // var stillUtc2 = moment.utc(data).toDate();
            // var datafinal = moment(stillUtc2).local().format('YYYY-MM-DD HH:mm:ss');
            // var fuso = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');
            // if (datafinal > fuso){
            //   console.log('teste 1');
            //   console.log(fuso);
            // }else{
            //   console.log('teste 2');
            //   console.log(datafinal);
            //   console.log(fuso);
            // }
            //return (null, result);

          }
        });
      }
    });
  };
  //data_alteracao = new Date().getTime();
  //consulta_sql = "select * from historico_ponto";//where data_alteracao = '"+data_alteracao+"'";
  //console.log(consulta_sql);
  //console.log(config_aise);
}
function criaRequisicao(req, callback) {
  requisicao = require('./requisicao_pontoModel.js');
  requisicao.requisicao_ponto(req, function (error, result) {
    if (error) {
      callback(error, null);
    } else {
      //console.log(result);
      callback(null, result);
    }
  });
}
function gravaFuncionario(req, callback) {
  console.log(global.method);
  /**
   * Obs. Trocar essa requisicao feita ao  ponto gestor por um arquivo js.
   */
  //global.url = 'http://api.961500-156727877.reviews.pontogestor.com/v1/funcionarios/';
  console.log(global.url);
  var request = require('request'), default_headers, url = 'http://api.961500-156727877.reviews.pontogestor.com/v1/funcionarios/';
  default_headers = { 'X-Auth-Token': global.token, 'Content-type': 'application/json', 'Accept': 'application/json' };
  request({
    url: url,
    headers: default_headers,
    method: global.method,
    body: req
  }, function (error, res, body) {
    /**
     * Obs. Tratar erros de acesso negado. StatusCode
     */
    if (!error && res.statusCode == 401) {
      console.log(res.statusMessage);
      callback("Erro ao conectar-se ao Ponto Gestor!<br> Código de erro: " + res.statusCode + " - " + res.statusMessage, null, null);
    } else if (!error && res.statusCode == 201) {
      console.log("Gravado com Sucesso no Ponto Gestor");
      callback(null, null, res.statusMessage);
    } else {
      console.log("Houve erros na gravaçao no Ponto Gestor");
      callback(null, res.body, null);
    }
  });
};
function consultaFuncionario(req, callback) {
  console.log(req.rows.length)
  //for (let i = 0, p = Promise.resolve(listaerros); i < req.length; i++) {//i < req.lentght    
  var consulta = "?registro_folha=" + req.rows[0].registro_folha;
  /**
   * Obs. Trocar essa requisicao feita ao  ponto gestor por um arquivo js.
   */
  var request = require('request'), default_headers, url = 'http://api.961500-156727877.reviews.pontogestor.com/v1/funcionarios' + consulta;
  default_headers = { 'X-Auth-Token': global.token, 'Content-type': 'application/json', 'Accept': 'application/json' };
  request({
    url: url,
    headers: default_headers,
    method: 'GET',
  }, function (error, res, body) {
    /**
     * Obs. Tratar erros de acesso negado. StatusCode
     */
    if (error) {
      callback("Ocorreu um erro ao comunicar-se com o Ponto Gestor!" + error, null, null);
    }
    if (!error && res.statusCode == 401) {
      console.log("Resultado da consulta:" + res.statusMessage);
      callback("Erro ao conectar-se ao Ponto Gestor!<br> Código de erro: " + res.statusCode + " - " + res.statusMessage, null, null);
    } else if (!error && res.statusCode == 200) {

      console.log("Resultado da consulta:" + res.statusCode);
      callback(null, null, res.statusCode);
    } else {
      console.log("Houve erros na consulta no Ponto Gestor. Verifique se o funcionário está cadastrado.");
      callback(null, res.body, null);
    }
  });
};
function gravaPontodb(req, callback) {
  var db = require('../db.js');
  var PontoSchema = new db.Schema({
    tipo: String,
    funcionario: String,
    pis: String,
    requisicao: JSON,
    data: String
  })
  /**
   * "teste" deve ser substituído pelo usuário que fez a solicitação
   */
  var Ponto = db.mongoose.models.teste || db.mongoose.model('teste', PontoSchema);
  var instance = new Ponto();
  /**
   * Converter a data e horario sem fuso horário para o horario local. (npm install moment)
   */
  var moment = require('moment');
  var date = moment.utc().format('YYYY-MM-DD HH:mm:ss');
  var stillUtc = moment.utc(date).toDate();
  var local = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');
  if (req.length == 1) {
    instance.tipo = "Individual";
    instance.funcionario = req[0].funcionario.name;
    instance.pis = req[0].funcionario.pis;
    instance.requisicao = req[0];
    instance.data = local;
    instance.save(function (error) {
      if (error) {
        callback(error);
      } else {
        callback(null, instance);
      }
    });
  } else {
    var listanomes = new Array();
    for (i = 0; i < req.length; i++) {
      var name = req[i].funcionario.name;
      listanomes.push(name);
    }
    instance.tipo = "Geral";
    instance.funcionario = listanomes;
    instance.requisicao = req;
    instance.data = local;
    instance.save(function (error) {
      if (error) {
        callback(error);
      } else {
        callback(null, instance);
      }
    });
  }
}