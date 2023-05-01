const multer = require('multer');


const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,'./upload')
    },

    filename: function (req, file, cb) {

        var extensionsGet = file.originalname;
        extensionsGet = extensionsGet.split('.');
        extensionsGet = extensionsGet[1];

        if (extensionsGet === "png" || extensionsGet === "jpg" || extensionsGet === "jpeg") {
            if (file) {
                cb(null, new Date() + file.originalname)
            }
        } else {
            cb({
                statusCode: 403,
                statusMsj: file.originalname + " Image Not saported. Upload valid image"
            });
        }


        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // console.log("file",file)
        // cb(null, file.fieldname + '-' + uniqueSuffix)
      }
})


const upload = multer({ storage: storage })


module.exports = upload;