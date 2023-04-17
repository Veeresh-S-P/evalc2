const mongoose=require("mongoose")
const connection=mongoose.connect("mongodb+srv://veeresh:veeresh@cluster0.lkb8reo.mongodb.net/blogs?retryWrites=true&w=majority")

module.exports={
    connection
}