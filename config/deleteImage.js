const fs = require('fs')

const deleteImage = (path)=>{
    fs.unlink(path, (err)=>{
        if(err)
            console.log("Couln't delete " + path)
    })
    return true
}

module.exports = deleteImage