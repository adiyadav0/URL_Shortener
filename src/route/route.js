const express= require('express');
const router = express.Router();
const urlController = require('../controllers/urlController')


router.get('/:urlCode',urlController.getUrl);


router.post('/url/shorten', urlController.shortenUrl)


module.exports= router;