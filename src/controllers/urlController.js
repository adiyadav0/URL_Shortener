const urlModel = require("../models/urlModel");
const shortid = require("shortid");
const validUrl = require("valid-url");

const shortenUrl = async function (req, res) {
  try {
    const longUrl = req.body.longUrl;
    const baseUrl = "http://localhost:3000/";

    if (Object.keys(req.body).length === 0) {
      res.status(400).send({ status: false, message: "Please provide url" });
      return;
    }
    if (!longUrl || typeof longUrl == "undefined" || typeof longUrl == "null" || longUrl.trim().length==0) {
      res.status(400).send({ status: false, message: "Please enter longUrl" });
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
      res.status(400).send({
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

const getUrl = async (req, res) => {
  try {
    const url = req.params.urlCode;
    const dbUrl = await urlModel.findOne({ urlCode: url });
    if (dbUrl) {
      return res.status(302).redirect(
        dbUrl.longUrl
        /*{
				status: true,
				data: dbUrl.longUrl,
			}*/
      );
    } else {
      return res.status(404).send({
        status: false,
        message: "url code is not found",
      });
    }
  } catch (err) {
    return res.status(500).send({
      status: false,
      message: err.message,
    });
  }
};

module.exports.shortenUrl = shortenUrl;
module.exports.getUrl = getUrl;
