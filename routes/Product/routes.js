var express = require('express')
var router = express.Router()

router.get('/list', function (req, res) {
    let products = [
        {'name': 'Item 1'},
        {'name': 'Item 2'},
        {'name': 'Item 3'},
    ]
    res.json({
        'success': true,
        'data': products 
    })
})

module.exports = router