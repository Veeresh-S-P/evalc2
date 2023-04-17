const express=require("express")
const {authorization}=require("../middlewares/jwt.middleware")
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const {TokenModel}=require('../models/token.model')

const {UserModel}=require('../models/user.model')
const {authorise}=require('../models/authorise.middleware')


const userRoute=express.Router();


userRoute.post("/signup", (req, res)=>{
    bcrypt.hash(req.body.pass, 5, async(err, hash)=>{
        try{
            const data=new UserModel({email:req.body.email,pass:hash,role:req.body.role});
            await data.save();
            res.status(200).json({ok:true, msg:"signup successfull"})
        }catch(e){
            console.log(e)
            res.status(200).json({ok:false, msg:"signup error"})
        }
    })
})

userRoute.post("/login",async (req,res)=>{
    const {email,pass} = req.body;
    try {
        let check = await UserModel.find({email})
        
        if(check.length>0){

    bcrypt.compare(pass, check[0].pass, (err, result)=> {
                if(err){
                    res.status(400).json({ok:false,err});
                            }
        if(result){
                    const token = jwt.sign({
                        userID: check[0]._id
                    }, 'token', { expiresIn: '1m' });

                    const refreshToken = jwt.sign({
                        userID: check[0]._id
                    }, 'refresh', { expiresIn: '5m' });

                    res.cookie("token", token);
                    res.cookie("refreshToken", refreshToken);
                    res.cookie("role",check[0].role);
                    res.status(200).json({ok:true,msg:"Logged in Successfully"});
                } else {
                    res.status(400).json({ok:false,err});
                }
            });

        } else {
            res.status(400).json({ok:false,msg:"Please register first"});
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({ok:false,msg:error._message});
    }
})

userRoute.get('/refress', (req,res)=>{
    const refresh=req.cookies.refreshToken;
    jwt.verify(refresh, 'refresh' , (err,decoded)=>{
if(err){
    res.send(err)
}
if(decoded){
    res.clearCookie("token")

    const token=jwt.sign({
        userID:decoded.userID
    }, 
    "token",{expiresIn:"1m"})
    res.cookie("token",token);
    res.status(200).json({ok:true,msg:"token updated successfully"});
}
    })
})

userRoute.get('/logout', async(req,res)=>{
    try{
        let blacklist=new TokenModel({token:req.body.token, refresh:req.body.refreshToken})
        await blacklist.save()
        request.clearCookie("token")
        request.clearCookie("refreshToken")
        res.status(200).json({ok:true,msg:"logedout successfully"});

    }catch(e){
        console.log(e)
    }
})



module.exports={userRoute}