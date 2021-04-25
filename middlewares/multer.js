const multer  = require('multer')
const fs  = require('fs')

// destination for saving medias
var storage = (folder)=>{
    let destination = 'images/' + folder
    return multer.diskStorage({
         destination: function (req, file, cb) {
           fs.mkdirSync(destination, { recursive: true })
           cb(null, destination)
         },
         filename: function (req, file, cb) {
              console.log(file.originalname)
              let name = file.originalname.split('.')
              cb(null, Date.now() + '.' + name[name.length-1] )
         }
     })
}
const customMulter = (folder)=>{
    return multer({storage: storage(folder)}).any()
}

module.exports = customMulter