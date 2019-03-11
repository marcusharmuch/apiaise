/**
 * @author <marcus@publitechsistemas.com.br>
 */
module.exports.justificativa_aise = justificativa_aise;
/**
 * 
 * @param {*} req (requisição para consulta) 
 * @param {*} callback (retorno:error,result)
 */
function justificativa_aise(req, callback) {

    if (req != null) {
        /**
     * cria o select para inserçao individual da justificativa
     */
        var matricula = req.matricula;
        var movimentacao = req.movimentacao;
        var sql = "SELECT P.NOME, F.MATRICULA, MP.MOVIMENTACAO, F.HORARIOTRABALHO, P.pispasep as PIS, P.CNPJ_CPF, RHP.DATANASCIMENTO, F.DATAADMISSAO,\
            TPAFAST.AFASTAMENTO, case when AFAST.MOVIMENTACAOAFASTAMENTO is not null then 'AFASTAMENTO' when \
            PF.MOVIMENTACAO is not null then 'FÉRIAS' when PLP.MOVIMENTACAO is not null then 'LICENÇA PRÊMIO' end TIPO, \
            case when AFAST.MOVIMENTACAOAFASTAMENTO is not null then AFAST.AFASTAMENTO \
            when PF.MOVIMENTACAO is not null then FF.FERIAS when PLP.MOVIMENTACAO is not null then LP.LICENCA end CODIGO, \
            case when AFAST.MOVIMENTACAOAFASTAMENTO is not null then TPAFAST.DESCRICAO when PF.MOVIMENTACAO is not null then FF.DESCRICAO \
            when PLP.MOVIMENTACAO is not null then LP.DESCRICAO end DESCRICAO, case when AFAST.MOVIMENTACAOAFASTAMENTO is not null \
            then AFAST.DATAINICIAL when PF.MOVIMENTACAO is not null then PF.INICIOGOZO when PLP.MOVIMENTACAO is not null \
            then PLP.INICIOGOZO end DATAINICIAL, case when AFAST.MOVIMENTACAOAFASTAMENTO is not null then AFAST.DATAFINAL \
            when PF.MOVIMENTACAO is not null then PF.FIMGOZO when PLP.MOVIMENTACAO is not null then PLP.FIMGOZO end DATAFINAL, \
            case when mp.tipomovimentacao=56 then ff.tipoponto when mp.tipomovimentacao=56 then LP.tipoponto \
            else TPAFAST.tipoponto end IDPONTO from RHFUNCIONARIO F left outer join PESSOA P on P.PESSOA = F.PESSOA left outer \
            join RHPESSOA RHP on F.PESSOA = RHP.PESSOA left OUTER join RHMOVIMENTACAOPESSOAL MP on F.ENTIDADE = MP.ENTIDADE \
            and F.MATRICULA = MP.MATRICULA left outer join RHMOVIMENTACAOAFASTAMENTO AFAST on MP.ENTIDADE = AFAST.ENTIDADE \
            and MP.MATRICULA = AFAST.MATRICULA and MP.MOVIMENTACAO = AFAST.MOVIMENTACAO left outer join RHAFASTAMENTO TPAFAST \
            on AFAST.ENTIDADE = TPAFAST.ENTIDADE and AFAST.AFASTAMENTO = TPAFAST.AFASTAMENTO left outer join RHPROGRAMACAOFERIAS PF \
            on MP.ENTIDADE = PF.ENTIDADE and MP.MATRICULA = PF.MATRICULA and MP.MOVIMENTACAO = PF.MOVIMENTACAO left outer join RHFERIAS FF \
            on PF.ENTIDADE = FF.ENTIDADE and PF.FERIAS = FF.FERIAS left outer join RHPROGRAMACAOPREMIO PLP on MP.ENTIDADE = PLP.ENTIDADE \
            and MP.MATRICULA = PLP.MATRICULA and MP.MOVIMENTACAO = PLP.MOVIMENTACAO left outer join RHLICENCAPREMIO LP \
            on PLP.ENTIDADE = LP.ENTIDADE and PLP.LICENCA = LP.LICENCA where F.ENTIDADE = 1 and MP.tipomovimentacao \
            in (16,17,18,19,23,24,31,32,37,46,50,52,53,55,56,57) and mp.matricula = '"+ matricula + "' and mp.movimentacao = '" + movimentacao + "'";
        callback(null, sql);

    } else {
        var erro = "Erro ao criar sql para consulta no Aise. Verifique!";
        callback(erro, null);
    }

}