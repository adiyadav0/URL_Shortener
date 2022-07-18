const urlModel = require('../models/urlModel');

var shortid = require('shortid');

const shortenUrl = async function(req, res){
    try{
        const getUrl = req.body;
        const baseUrl = 'http://localhost:3000/';
const isUrlShortened = await urlModel.findOne({longUrl: getUrl.longUrl});
if(isUrlShortened){
    res.status(400).send({status: false, message: 'Given url already has been shortened!!', shortUrl: isUrlShortened.shortUrl})
    return
}
const code = shortid.generate();
const shortUrl = baseUrl.concat(code)
const urlDetail = {
    longUrl: getUrl.longUrl,
    shortUrl: shortUrl,
    urlCode: code
}
let createShortUrl = await urlModel.create(urlDetail);
res.status(201).send({status: true, message: 'Success', data: urlDetail})
return
    }
catch(err){
res.status(500).send({status: false, message: err.message})
return
}
}



module.exports.shortenUrl = shortenUrl