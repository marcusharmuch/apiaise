/**
 * @author <marcus@publitechsistemas.com.br>
 */

 exports.funcionarios = (req,callback) => {
    AiseModel = require('../model/aiseModel.js');
    AiseModel.consultaAise(req, function (error, result) {
        if (error) {
            callback(error, null);
            return;
        } else {
            callback(null, result);
        };
    });
    
};
exports.get = (req, callback) => {
    AiseModel = require('../model/aiseModel.js');
    /**
     * Configuração Local do Aise, especifica para cada entidade, configurada manualmente aqui na API.
     */
    //req = 'postgres://aise@192.168.20.71:32768/cmpg';
    //callback("erro", "Deu certo");
    //return;

    AiseModel.consultaRequisicao(req, function (error, result) {
        if (error) {
            callback(error, null);
            //return;
        } else {
            console.log("nao podia entrar aki");
            callback(null, result);   
        }
        //return;
    });
};

exports.post = (function (req, callback) {
    global.method = 'POST';

    //req = 'postgres://aise@192.168.20.71:32768/cmpg';
    AiseModel.consultaRequisicao(req, function (error, result) {
        if (error) {
            console.log(error);
            //callback(error, null);
            return;
        } else {
            console.log('teste de saida do quadro de horas');
            //callback(null, result);
        }
    });

return;
    // const internalIp = require('internal-ip');
    // internalIp.v4().then(ip => {
    //     console.log(ip);
    //     //=> '10.0.0.79'
    // });

    // console.error(internalIp.v4.sync())

    // global.aise = 'postgres://aise@'+internalIp.v4.sync()+':32768/cmpg';

    /**
     * passando valor para variavel req para testes. Será repassado pelo usuario.
     */
    // var cpf = req.body.cpf;
    // req = cpf;
    /**
     * caminho para o banco de dados aise e mongo local do servidor
     * parametros utilizados do usuario de cada entidade no mLab;
     */

    PontoModel = require('../model/aiseModel.js');

    PontoModel.consultaAise(req, function (error, result) {
        if (error) {
            callback(error, null);

        } else {
            /**
             * somente para testar gravacao no mongo. O correto esta abaixo.
             */
            req = result;
            PontoModel.criaRequisicao(req, function (error, result) {
                if (error) {
                    callback(error, null);
                } else {
                    req = result;
                    RequisicaoPontoGestor = require('../model/requisicao.pontogestorModel.js');
                    RequisicaoPontoGestor.requisicao_pontogestor(req, function (problem, error, result) {
                        /** 
                         * retorna=>
                         * error: lista com nomes dos nao gravados que apresentaram erros no ponto gestor
                         * result: lista com nomes dos gravados no ponto gestor
                         */
                        if (problem) {

                            var erroconexao = problem;

                        } else {
                            if (error.length != 0) {
                                var listaerros = ("Erros foram encontrados. Dados não gravados no Ponto Gestor:<br><br>" + error);
                            }
                            //console.log(result.length);
                            if (result.length != 0) {
                                var listagravados = result;
                                //console.log(listagravados);
                                PontoModel.gravaPontodb(listagravados, function (error, result) {
                                    if (error) {
                                        console.log('Problema ao gravar no Mongodb. Verifique!', error);
                                        //callback(error, null);
                                    } else {
                                        console.log("Gravado com Sucesso");
                                        //res.send("Gravado com Sucesso");
                                    }
                                })
                            }
                        }
                        if (erroconexao) {
                            //res.send(erroconexao);
                            callback(erroconexao, null);
                        } else {
                            if (listaerros) {

                                callback(listaerros, null);
                            }
                            else {
                                callback(null, "Todos os funcionários foram gravados com sucessso!");
                            }
                        }
                    });
                }
            });
            // PontoModel.gravaPontodb(listagravados, function (error, result) {
            //     if (error) {
            //         console.log('Problema ao gravar no Mongodb. Verifique!', error);
            //         callback(error, null);
            //     } else {
            //         console.log("Gravado com Sucesso");
            //         res.send("Gravado com Sucesso");
            //     }
            // })
        }

    });
});
//PontoModel.gravaFuncionario(req, function (error, result) {

//res.send(result);
/**
  * Esta no lugar errado somente para teste. Remover após testar
  * A chamada dessa funçao deve ser dentro do else da funcao gravaFuncionario
  */
// if (error) {
//     res.send(error);
// } else {
//     req = JSON.parse(result);
//     PontoModel.gravaPontodb(req, function (error, result) {
//         if (error) {
//             console.log('Problema ao gravar no Mongodb. Verifique!', error);
//             callback(error, null);
//         } else {
//             console.log(result);
//             res.send("Gravado com Sucesso");
//         }
//     })

// }
// })

// var request = require('request');
// //var jsonparametros = JSON.parse(parametros);
// var url = 'http://api.961500-156727877.reviews.pontogestor.com/v1/funcionarios/';
//  var headers = {'X-Auth-Token' : 'iswHJ9ZkhNc6Qctjokkq', 'Content-type': 'application/json', 'Accept': 'application/json'};
//  request({url:url,headers:headers}, function (error, response, body){
//    if (!error && response.statusCode == 200) {

//    let teste = req;
//     console.log(teste);
//     res.status(200).send();
//     //res.status(200).send(parametros, parametros2, response.statusCode);    
//   }else if (response.statusCode == 401){
//     res.status(401).send('Acesso não autorizado, verifique o token!' ); 
//   }   
//})
//};
//     res.status(201).send(`Requisição recebida com sucesso!` );
// };

exports.patch = (function (req, callback) {
    global.method = 'PATCH';
    PontoModel = require('../model/aiseModel.js');
    PontoModel.consultaAise(req, function (error, result) {
        if (error) {
            callback(error, null);
        } else {
            req = result;
            PontoModel.consultaFuncionario(req, function (problem, error, result) {
                if (error) {
                    callback(error, null);
                } else {
                    if (result == 200) {
                        PontoModel.criaRequisicao(req, function (error, result) {

                            if (error) {
                                callback(error, null);
                            } else {
                                req = result;
                                RequisicaoPontoGestor = require('../model/requisicao.pontogestorModel.js');
                                RequisicaoPontoGestor.requisicao_pontogestor(req, function (problem, error, result) {
                                    /** 
                                     * retorna=>
                                     * error: lista com nomes dos nao gravados que apresentaram erros no ponto gestor
                                     * result: lista com nomes dos gravados no ponto gestor
                                     */
                                    if (problem) {
                                        var erroconexao = problem;
                                    } else {
                                        if (error.length != 0) {
                                            var listaerros = ("Funcionário com erros e não alterado no Ponto:<br><br>" + error);
                                        }
                                        if (result.length != 0) {
                                            var listagravados = result;
                                            PontoModel.gravaPontodb(listagravados, function (error, result) {
                                                if (error) {
                                                    console.log('Problema ao gravar no Mongodb. Verifique!', error);
                                                } else {
                                                    console.log("Gravado com Sucesso");
                                                }
                                            })
                                        }
                                    }
                                    if (erroconexao) {
                                        callback(erroconexao, null);
                                    } else {
                                        if (listaerros) {
                                            callback(listaerros, null);
                                        }
                                        else {
                                            callback(null, "Funcionário alterado com sucessso!");
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    });
});
exports.delete = (req, res, next) => {
    let id = req.params.id;
    res.status(200).send(`Requisição recebida com sucesso!`);
};