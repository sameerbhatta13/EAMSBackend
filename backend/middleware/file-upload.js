const multer=require('multer')
const fs=require('fs')
const path=require('path')

//storage location of file
const storage=multer.diskStorage({
    //set destination
    destination:(req,file,cb)=>{
        const fileDestination='public/uploads/'

        //check if directory exits or not
        if(!fs.existsSync(fileDestination)){
            fs.mkdirSync(fileDestination,{recursive:true}) //recursive make parent and child folders both and mkdirsync make a directory if folder doesnt exits
        }
        cb(null,fileDestination)
    },
    //set a custome filename while uploading
    filename:(req,file,cb)=>{
        //extract filename without extension
        const fileName=path.basename(file.originalname,path.extname(file.originalname))

        const extName=path.extname(file.originalname)
        //return new name
        cb(null,`${fileName}_${Date.now()}${extName}`)
        //
    }

})

//filter file format

const imageFilter=(req,file,cb)=>{
    //regular expression for file format allowed
    const validImageTypes=/\.(jpg|png|jpeg|jfif|svg|gif)$/i

    if(!file.originalname.match(validImageTypes)){
        return(new Error('you can upload image file only'),false)
    }
    cb(null,true)
}


//multer upload function initialization

exports.uploads=multer({
    storage:storage,
    fileFilter:imageFilter,
    limits:{
        fileSize:3000000  //3mb
    }
}) 

//middleware to handle multer
exports.handleMulterError=(err,req,res,next)=>{
    if(err instanceof multer.MulterError){
        return res.status(400).json({error:err.message})
    }
    else if(err){
        //unknown error
        return res.status(400).json({error:err.message})
    }
    next()
}

