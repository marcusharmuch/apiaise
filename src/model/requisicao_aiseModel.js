/**
 * @author <marcus@publitechsistemas.com.br>
 */
module.exports.requisicao_aise = requisicao_aise;
/**
 * 
 * @param {*} req (requisição para consulta) 
 * @param {*} callback (retorno:error,result)
 */
function requisicao_aise(req, callback) {

    if (req != null) {
        /**
     * cria o select para inserçao individual pelo cpf
     */
        if (req != "") {
            var aspas = "'";
            var cpf = req;
            var sql = "SELECT PE.PIS AS PIS, p.cnpj_cpf as CPF, FF.DATAADMISSAO AS DATA_ADMISSAO, FF.DATARESCISAO AS DATA_DEMISSAO,\
            id_ponto AS empresa_id, P.NOME AS name, FU.matricula AS REGISTRO_FOLHA, FF.DATAADMISSAO AS EXAME_DATA,\
            FF.DATAADMISSAO AS EXAME_APTO, CASE WHEN FF.HORARIOTRABALHO IS NULL THEN 1 ELSE HORARIOTRABALHO END HORARIOTRABALHO,\
            CASE WHEN FF.CLASSIFICACAO IS NULL THEN LO.CLASSIFICACAO ELSE FF.CLASSIFICACAO END DEPARTAMENTO_ID,\
            CASE WHEN FF.CLASSIFICACAO IS NULL THEN CL.DESCRICAO else CLL.DESCRICAO END DEPARTAMENTO_DESCRICAO\
            FROM AISE.RHPESSOA PE JOIN (select max(matricula) as matricula, F.pessoa, F.ENTIDADE\
            from aise.rhfuncionario f WHERE F.ENTIDADE = 1 AND ((F.SITUACAO <> 3) OR ((F.SITUACAO = 3) AND (F.DATASITUACAO BETWEEN (SELECT date_trunc('month', current_date))\
            AND (SELECT date_trunc('month', current_date) + INTERVAL '1 month' - INTERVAL '1 day')))) group by F.PESSOA, ENTIDADE) FU ON PE.PESSOA = FU.PESSOA\
            JOIN AISE.RHFUNCIONARIO FF ON FU.MATRICULA = FF.MATRICULA AND FU.ENTIDADE = FF.ENTIDADE\
            join pessoa P ON PE.PESSOA = P.PESSOA and p.cnpj_cpf= '"+cpf+"' JOIN AISE.RHLOTACAO LO ON FF.LOTACAO = LO.LOTACAO\
            AND FF.MODELOLOTACAO = LO.MODELOLOTACAO AND FF.ENTIDADE = LO.ENTIDADE LEFT OUTER JOIN AISE.RHCLASSIFICACAO CL ON LO.CLASSIFICACAO = CL.CLASSIFICACAO AND LO.ENTIDADE = CL.ENTIDADE\
            LEFT OUTER JOIN AISE.RHCLASSIFICACAO CLL ON FF.CLASSIFICACAO = CLL.CLASSIFICACAO and FF.entidade = CLL.entidade\
            left outer join AISE.entidade e on ff.entidade=e.entidade";
            //console.log(sql);
            //         "select rp.pis pis,p.cnpj_cpf cpf, f.dataadmissao data_admissao,\
            // f.situacao as situacao,\
            // p.nome as name, f.entidade empresa_id, hf.lotacao departamento_id,\
            // f.matricula registro_folha, p.rg,\
            // rp.ctps, rp.cnh,\
            // coalesce(mo.datainicio,f.dataadmissao) cargo_data,\
            // c.descricao cargo_funcao,\
            // c.descricao cargo_name,\
            // '2017-01-01' exame_data, '2017-01-01' exame_apto\
            // from rhfuncionario f join pessoa p on p.pessoa=f.pessoa\
            // left join rhpessoa rp on rp.pessoa=f.pessoa\
            // left join rhhistoricofuncionario hf on hf.matricula=f.matricula and hf.entidade=f.entidade\
            // and hf.anocompetencia=2018 and hf.mescompetencia=3 and hf.tipofolha=1\
            // left join rhcargo c on c.cargo=hf.cargo and c.entidade=hf.entidade\
            // left join rhmovimentacaopessoal mp on mp.matricula=f.matricula and mp.entidade=f.entidade\
            // and mp.tipomovimentacao in (59,82,109,99)\
            // left join rhmovimentacaooutros mo on mo.entidade=mp.entidade and mo.matricula=mp.matricula\
            // and mo.movimentacao=mp.movimentacao and mo.cargo=c.cargo\
            // where (f.situacao in (1,2) or f.datasituacao>='20180501')\
            // and p.cnpj_cpf = "+ cpf; "\
            // and f.entidade=1\
            // group by rp.pis,p.cnpj_cpf, f.dataadmissao,\
            // case when f.situacao=3 then f.datasituacao end,\
            // p.nome, f.entidade, hf.lotacao,\
            // f.matricula, p.rg,\
            // rp.ctps, rp.cnh,\
            // coalesce(mo.datainicio,f.dataadmissao),\
            // c.descricao";
            callback(null, sql);
        } else {
            /**
             * inserçao de todos os funcionários
             */
            var sql = "SELECT PE.PIS AS PIS,p.cnpj_cpf as CPF,FF.DATAADMISSAO AS DATA_ADMISSAO,\
            FF.DATARESCISAO AS DATA_DEMISSAO,id_ponto AS empresa_id,P.NOME AS name,\
            FU.matricula AS REGISTRO_FOLHA,FF.DATAADMISSAO AS EXAME_DATA,FF.DATAADMISSAO AS EXAME_APTO,\
            CASE WHEN FF.HORARIOTRABALHO IS NULL THEN 1 ELSE HORARIOTRABALHO END HORARIOTRABALHO,\
            CASE WHEN FF.CLASSIFICACAO IS NULL THEN LO.CLASSIFICACAO ELSE FF.CLASSIFICACAO END DEPARTAMENTO_ID,\
            CASE WHEN FF.CLASSIFICACAO IS NULL THEN CL.DESCRICAO else CLL.DESCRICAO\
            END DEPARTAMENTO_DESCRICAO FROM AISE.RHPESSOA PE JOIN\
            (select max(matricula) as matricula, F.pessoa, F.ENTIDADE from aise.rhfuncionario f\
            WHERE F.ENTIDADE = 1 AND ((F.SITUACAO <> 3) OR ((F.SITUACAO = 3) AND (F.DATASITUACAO BETWEEN\
            (SELECT date_trunc('month', current_date)) AND\
            (SELECT date_trunc('month', current_date) + INTERVAL '1 month' - INTERVAL '1 day'))))\
            group by F.PESSOA, ENTIDADE) FU ON PE.PESSOA = FU.PESSOA\
            JOIN AISE.RHFUNCIONARIO FF ON FU.MATRICULA = FF.MATRICULA AND FU.ENTIDADE = FF.ENTIDADE\
            join pessoa P ON PE.PESSOA = P.PESSOA\
            JOIN AISE.RHLOTACAO LO ON FF.LOTACAO = LO.LOTACAO\
            AND FF.MODELOLOTACAO = LO.MODELOLOTACAO\
            AND FF.ENTIDADE = LO.ENTIDADE\
            LEFT OUTER JOIN AISE.RHCLASSIFICACAO CL ON\
            LO.CLASSIFICACAO = CL.CLASSIFICACAO AND LO.ENTIDADE = CL.ENTIDADE\
            LEFT OUTER JOIN AISE.RHCLASSIFICACAO CLL ON FF.CLASSIFICACAO = CLL.CLASSIFICACAO\
            and FF.entidade = CLL.entidade left outer join AISE.entidade e on ff.entidade=e.entidade";
            callback(null, sql);
            
            //     "select rp.pis pis,p.cnpj_cpf cpf, f.dataadmissao data_admissao,\
            // f.situacao as situacao,\
            // p.nome as name, f.entidade empresa_id, hf.lotacao departamento_id,\
            // f.matricula registro_folha, p.rg,\
            // rp.ctps, rp.cnh,\
            // coalesce(mo.datainicio,f.dataadmissao) cargo_data,\
            // c.descricao cargo_funcao,\
            // c.descricao cargo_name,\
            // '2017-01-01' exame_data, '2017-01-01' exame_apto\
            // from rhfuncionario f join pessoa p on p.pessoa=f.pessoa\
            // left join rhpessoa rp on rp.pessoa=f.pessoa\
            // left join rhhistoricofuncionario hf on hf.matricula=f.matricula and hf.entidade=f.entidade\
            // and hf.anocompetencia=2018 and hf.mescompetencia=3 and hf.tipofolha=1\
            // left join rhcargo c on c.cargo=hf.cargo and c.entidade=hf.entidade\
            // left join rhmovimentacaopessoal mp on mp.matricula=f.matricula and mp.entidade=f.entidade\
            // and mp.tipomovimentacao in (59,82,109,99)\
            // left join rhmovimentacaooutros mo on mo.entidade=mp.entidade and mo.matricula=mp.matricula\
            // and mo.movimentacao=mp.movimentacao and mo.cargo=c.cargo\
            // where (f.situacao in (1,2,3) or f.datasituacao>='20180501')\
            // and f.entidade=1\
            // group by rp.pis,p.cnpj_cpf, f.dataadmissao,\
            // case when f.situacao=3 then f.datasituacao end,\
            // p.nome, f.entidade, hf.lotacao,\
            // f.matricula, p.rg,\
            // rp.ctps, rp.cnh,\
            // coalesce(mo.datainicio,f.dataadmissao),\
            // c.descricao";
            //     callback(null, sql);
        }
    } else {
        var erro = "Erro ao criar sql para consulta no Aise. Verifique!";
        callback(erro, null);
    }

}