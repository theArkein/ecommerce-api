var mongoose = require('mongoose')
const uri = "mongodb+srv://dbKhetaan:Khetaan%40DB@cluster0.zm6bm.mongodb.net/haatbazaar?retryWrites=true&w=majority";

var db = ()=>{
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true })
    .then(()=>{console.log("Successfully connected to DB")})
    .catch(err => console.log(err));
}

module.exports = db