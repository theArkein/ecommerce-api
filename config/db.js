var mongoose = require('mongoose')
const DBURI = process.env.DBURI
var db = ()=>{
    mongoose.connect(DBURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, 'useFindAndModify': false })
    .then(()=>{console.log("Successfully connected to DB")})
    .catch(err => console.log(err));
}

module.exports = db