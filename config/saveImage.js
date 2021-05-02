const Jimp = require("jimp");

const saveImage = (data, path)=>{
    const buffer = Buffer.from(data, "base64");
    Jimp.read(buffer, (err, res) => {
        if (err) 
            return new Error(err);
        res.write(path);
    });
}

module.exports  = saveImage