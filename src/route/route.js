const express = require("express");
const router = express.Router();
const urlController = require("../controllers/urlController");

router.post("/url/shorten", urlController.shortenUrl);
router.get("/:urlCode", urlController.getUrl);
router.all('/**', function(req,res){
    res.status(400).send({status:false,message:"Invaild params"})
})
module.exports = router;
