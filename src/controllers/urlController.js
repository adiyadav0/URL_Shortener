const urlModel=require('../models/urlModel');



const getUrl=async(req, res)=>{
    try{
    const url=req.params.urlCode;
    const dbUrl=await urlModel.findOne({urlCode:url});
    if(dbUrl){return res.status(302).send({
        status: true,
        data:dbUrl.longUrl
      })}else{return res.status(400).send({
        status: false,
        message: "url is not valid"
      })}
    
    }catch(err){
        return res.status(500).send({
            status: false,
            message: err.message
          })
    }
}
module.exports.getUrl=getUrl