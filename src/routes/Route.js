const express = require('express');
const router = express.Router();
const controller = require('../controllers/Controller')

router.get('/', controller.get);
router.post('/', controller.post);
router.patch('/', controller.patch);
router.delete('/:id', controller.delete);
module.exports = router;