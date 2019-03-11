/**
 * @author  <marcusharmuch@publitechsistemas.com.br>
 */
module.exports.requisicao_pontogestor = requisicao_pontogestor;
/**
 * 
 * @param {*} req (resultado da consulta do aise para inserir dados no ponto) 
 * @param {*} callback (retorno)
 */
function requisicao_pontogestor(req, callback) {
    envia_pontogestor(req, function (problem, error, result) {
        callback(problem, error, result);
    });
}
function envia_pontogestor(req, callback) {

    listaerros = new Array();
    listagravados = new Array();
    for (let i = 0, p = Promise.resolve(listaerros); i < req.length; i++) {//i < req.lentght
        p = p.then(_ => new Promise(resolve => {
            var nome = req[i].funcionario.name;
            PontoModel = require('./aiseModel.js');
            var reqponto = JSON.stringify(req[i]);
            PontoModel.gravaFuncionario(reqponto, function (problem, error, result) {
                if (problem) {
                    callback(problem, null, null);
                    return;
                }
                if (error) {
                    listaerros.push(nome + error + "<br>");
                    resolve(listaerros);
                } else {
                    listagravados.push(req[i]);
                    resolve(listagravados);
                }
                if (i == (req.length - 1)) {//Aqui ter q ser o i = req.length
                    console.log(listaerros);
                    console.log(listagravados);
                    callback(null, listaerros, listagravados);
                    return;
                }
            });
        }));
    }
}