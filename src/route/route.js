const express= require('express');
const router = express.Router();
const urlController = require('../controllers/urlController')


router.get('/:urlCode',urlController.getUrl);




module.exports= router;