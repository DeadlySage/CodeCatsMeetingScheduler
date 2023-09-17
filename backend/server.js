const express = require("express");
const mongoose = require("mongoose");
const app = express();
const uri = "mongodb+srv://Admin:4321admin@cluster0.lyj1ljm.mongodb.net/?retryWrites=true&w=majority"

async function connect(){
    try{
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    }catch (error){
        console.error(error);
    }

}

connect();
app.listen(3000, () => {
    console.log("Listening on port 3000");
});
