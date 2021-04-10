// import required dependencies
var express = require('express')
var bodyParser = require('body-parser')
var multer  = require('multer')
var cors = require('cors')
var morgan = require('morgan')
const path = require('path');

require('dotenv').config()

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname )
    }
})

// initiate express app instance
var app = express()

// DB Connection
require('./config/db')()

// Use middlewares

// Serve Static Files
// app.use(express.static('images'));
app.use('/images', express.static(path.join(__dirname, 'images')))
// CORS Enabled for all requesting sources
app.use(cors())
// Request Logs
app.use(morgan('tiny'))
// Parse request body 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// Parse multi-part form data
app.use(multer({storage}).any())


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