// import required dependencies
var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
var morgan = require('morgan')

// initiate dependencies 
require('dotenv').config()

// initiate express app instance
var app = express()

// Initiate Router
require('./routes/router')(app)

// Use middlewares
// CORS Enabled for all requesting sources
app.use(cors())
// Logger
app.use(morgan('tiny'))


// Parse request body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Default route
app.get('/', (req,res)=>{
    res.json({
        'name': 'Haatbazaar',
        'description': 'multi vendor ecommerce api',
        'version': '1.0',
        'baseurl': '/api/v1'
    })
})
// App listening to requests
app.listen(process.env.PORT, ()=>{
    console.log("App listening to port: ", process.env.PORT)
})