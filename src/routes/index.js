const express = require('express');
const router = express.Router();
const cron = require('node-cron');

var bodyParser = require('body-parser')

router.get('/', function (req, res, next) {
    

    const controller = require('../controllers/Controller')
    controller.get(req, function (error, result) {
    if (error) {
        res.status(500).send(error);
    }else {
        res.status(200).send(result);
    }
    //res.render('../index');
});
});
cron.schedule('*/45 * * * * *', function(){
    AiseModel = require('../model/aiseModel.js');
    /**
     * caminho servidor aise local
     */
    req = 'postgres://aise@192.168.20.71:32768/cmpg';
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

    console.log("testando cron jobs");
});
module.exports = router;