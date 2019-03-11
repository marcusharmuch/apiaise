/**
 * @author  <marcusharmuch@publitechsistemas.com.br>
 */
module.exports.requisicao_ponto = requisicao_ponto;
/**
 * 
 * @param {*} req (resultado da consulta do aise para inserir dados no ponto) 
 * @param {*} callback (retorno)
 */
function requisicao_ponto(req, callback) {
    if (req != null) {
        var lista = new Array();
        for (let i = 0; i < 1; i++) {
            if (i != null) {
                var tabela = ('{"funcionario":');
                var name = ('{"name":' + JSON.stringify(req.rows[i].name));
                var pis = (',"pis":' + JSON.stringify(req.rows[i].pis));
                var cpf = (',"cpf":' + JSON.stringify(req.rows[i].cpf));
                var registro_folha = (',"registro_folha":' + JSON.stringify(req.rows[i].registro_folha));
                var empresa_id = (',"empresa_id":' + JSON.stringify(req.rows[i].empresa_id));
                var data_admissao = (',"data_admissao":' + JSON.stringify(req.rows[i].data_admissao));
                var funcionario_exames_attributes = (',"funcionario_exames_attributes":[{"data":' + JSON.stringify(req.rows[i].exame_data));
                if (req.rows[i].exame_apto == null) {
                    var apto = "0";
                } else {
                    var apto = "1";
                }
                var exame_apto = (',"apto":' + apto + '}]}}');
                var json = (tabela + name + pis + cpf + empresa_id + registro_folha + data_admissao + funcionario_exames_attributes + exame_apto);
                lista.push(JSON.parse(json));
            }

        }
        console.log(lista);
        callback(null, lista);
    }
    else {
        var error = "Erro ao criar JSON para inserir dados!";
        callback(error, null);
    }
}
