const express = require("express");
const cookieParser = require('cookie-parser');
const { connection } = require("./db");
const { userRoute } = require("./routes/user.routes");
const { blogsRoute } = require("./routes/blogs.routes");
const { authorization } = require("./middlewares/jwt.middleware");
const { blacklist } = require("./middlewares/blacklist.middleware");

const app = express();
app.use(express.json());
app.use(cookieParser());


app.get("/",(req,res)=>{
    res.send("Welcome to backend homepage")
})

app.use("/user", userRoute);

app.use(blacklist);
app.use(authorization);
app.use("/blogs",blogRoute);

app.listen(1001,()=>{
    console.log("app is running at port 1001");
})

