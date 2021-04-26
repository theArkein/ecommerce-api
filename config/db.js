var mongoose = require('mongoose')
const uri = "mongodb+srv://dbKhetaan:Khetaan%40DB@cluster0.zm6bm.mongodb.net/haatbazaar?retryWrites=true&w=majority";

var db = ()=>{
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, 'useFindAndModify': false })
    .then(()=>{console.log("Successfully connected to DB")})
    .catch(err => console.log(err));
}

let keys = { createdAt: 1 };
let options = { 
    expireAfterSeconds: 20, 
    partialFilterExpression: { status: 1 }
};

module.exports = db