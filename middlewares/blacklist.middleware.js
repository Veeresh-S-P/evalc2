const {TokenModel}=require("../models/token.model")

const blacklist=async(req,res,next)=>{
    const check = await TokenModel.find({token:req.cookies.token})

    if(check.length>0){
        res.status(400).json({ok:false})
    }else{
        next()
    }
}

module.exports={blacklist}