const express = require('express');
const router = express.Router();
const cron = require('node-cron');
//const swal = require('sweetalert2')

var bodyParser = require('body-parser')
router.get('/funcionarios', function (req, res, next) {
    global.aise = req.body.config_aise;
    global.token = req.body.config_token;
    global.url_gestor = req.body.config_gestor;
    
    const controller = require('../controllers/Controller')
    controller.funcionarios(req, function (error, result) {
        if (error) {
            console.log(error);
            res.status(400).send(error);
        } else {
            res.status(200).send(result);
        }
        //res.render('../index');
    });
});

router.get('/justificativas', function (req, res, next) {
    global.aise = req.body.config_aise;
    global.token = req.body.config_token;
    global.url_gestor = req.body.config_gestor;
    
    const controller = require('../controllers/Controller')
    controller.get(req, function (error, result) {
        if (error) {
            console.log(error);
            res.status(400).send(error);
        } else {
            res.status(200).send(result);
        }
        //res.render('../index');
    });
});
// cron.schedule('*/45 * * * * *', function(){
//     AiseModel = require('../model/aiseModel.js');
//     /**
//      * caminho servidor aise local
//      */
//     req = 'postgres://aise@192.168.20.71:32768/cmpg';
//     AiseModel.consultaRequisicao(req, function (error, result) {
//         if (error) {
//             console.log(error);
//             //callback(error, null);
//             return;
//         } else {
//             console.log('teste de saida do quadro de horas');
//             //callback(null, result);
//         }
//     });

//     console.log("testando cron jobs");
//});
module.exports = router;