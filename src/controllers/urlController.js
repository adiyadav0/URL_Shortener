const urlModel = require("../models/urlModel");
const shortid = require("shortid");
const validUrl = require("valid-url");

const shortenUrl = async function (req, res) {
  try {
    const longUrl = req.body.longUrl;
    const baseUrl = "http://localhost:3000/";
    
    if (Object.keys(longUrl).length === 0) {
      res.status(400).send({ status: false, message: "Please provide url" });
      return;
    }
    if (!validUrl.isUri(longUrl)) {
      res
        .status(400)
        .send({ status: false, message: "Given url is not valid" });
      return;
    }
    const isUrlShortened = await urlModel.findOne({ longUrl: longUrl });
    if (isUrlShortened) {
      res
        .status(400)
        .send({
          status: false,
          message: "Given url already has been shortened!!",
          shortUrl: isUrlShortened.shortUrl,
        });
      return;
    }
    const code = shortid.generate();
    const shortUrl = baseUrl.concat(code);
    const urlDetail = {
      longUrl: longUrl,
      shortUrl: shortUrl,
      urlCode: code,
    };
    let createShortUrl = await urlModel.create(urlDetail);
    res.status(201).send({ status: true, message: "Success", data: urlDetail });
    return;
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
    return;
  }
};

module.exports.shortenUrl = shortenUrl;
