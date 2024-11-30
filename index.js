const express=require("express")
const app=express()
const cors=require("cors")
app.use(cors())
app.use(express.json())
// app.use("/",express.static("fuelsoilservices.ltd"))

const login = require("./api/login");
app.use("/api/user/login", login);
const register = require("./api/register");
app.use("/api/newuser/register", register);

const port=process.env.PORT || 3000
app.listen(port,()=>console.log(`running on port ${port}`))