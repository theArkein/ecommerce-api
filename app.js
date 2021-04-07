// import required dependencies
var express = require('express')
var bodyParser = require('body-parser')
var multer  = require('multer')
var cors = require('cors')
var morgan = require('morgan')
require('dotenv').config()

// initiate express app instance
var app = express()

// DB Connection
require('./config/db')()

// Use middlewares

// CORS Enabled for all requesting sources
app.use(cors())
// Request Logs
app.use(morgan('tiny'))
// Parse request body 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// Parse multi-part form data
app.use(multer().any())

// Default route
app.get('/', (req,res)=>{
    res.json({
        'name': 'Haatbazaar',
        'description': 'multi vendor ecommerce api',
        'version': '1.0',
        'baseurl': '/api/v1'
    })
})

// Initiate other routes router
require('./routes/router')(app)


// App listening to requests
app.listen(process.env.PORT, ()=>{
    console.log("App listening to port: ", process.env.PORT)
})