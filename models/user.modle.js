const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    pass:{
        type:string,
        required:true,
    },
    role:{
        type:string,
        required:true,
        enum:["User","Moderator"]
    }
})

const UserModel=mongoose.model("user",userSchema)
module.exports={UserModel}