const urlModel = require("../models/urlModel");
const shortid = require("shortid");
const validUrl = require("valid-url");
const redis = require("redis")
const { promisify } = require("util");

//Connect to Redis
const redisClient = redis.createClient(
  15298,
  "redis-15298.c264.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("KSaqd7MQJ0joy9r9cBSusYPNp712HxiN", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});

//Connection setup for redis
const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


const shortenUrl = async function (req, res) {
  try {
    if (Object.keys(req.body).length === 0) {
      res.status(400).send({ status: false, message: "Please provide url" });
      return;
    }
    const longUrl = req.body.longUrl;
    const baseUrl = "http://localhost:3000/";
    if (
      !longUrl ||
      typeof longUrl == "undefined" ||
      longUrl.trim().length == 0
    ) {
      res.status(400).send({ status: false, message: "Please enter longUrl" });
      return;
    }
    if (!validUrl.isUri(longUrl.trim())) {
      res
        .status(400)
        .send({ status: false, message: "Given url is not valid" });
      return;
    }
    const trimmedLongUrl = longUrl.trim();
    const isUrlShortened = await urlModel.findOne({ longUrl: trimmedLongUrl });
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
      longUrl: trimmedLongUrl,
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
    let getCachedUrlCode = await GET_ASYNC(`${url}`);
    if(getCachedUrlCode){
      let urlDetailObj = JSON.parse(getCachedUrlCode)
      return res.status(302).redirect(urlDetailObj.longUrl);
    }
    const dbUrl = await urlModel.findOne({ urlCode: url });
    if (!dbUrl) {
      return res.status(404).send({
        status: false,
        message: "url code is not found",
      });
    } else {
      await SET_ASYNC(`${url}`, JSON.stringify(dbUrl));
      return res.status(302).redirect(dbUrl.longUrl);
      
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
