const express = require('express')
const multer = require('multer')
const ejs = require('ejs')
const path = require('path')

// Set Storrage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

// Init upload
const upload = multer({
    storage: storage,
    limits: {fileSize: 20971520},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb)
    }
}).single('myVideo')

// Check File type
function checkFileType(file, cb){

    // Allowed ext
    // const filetypes = /jpeg|jpg|png|gif/;

    const filetypes = /mp4|mpeg|3gp|flv/;

    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

    // check mine
    const mimetype = filetypes.test(file.mimetype)

    if (mimetype && extname) {
        return cb(null, true)
    } else {
        cb('Error: Images Only!')
    }
}

// Init app
const app = express()

// Setting port
const port = 3000


// EJS
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

// Public Folder
app.use(express.static('./public'))

app.get('/', (req, res) => {
    // res.render('index')
    res.render('index')
})
 
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            })
        } else {
            if (req.file === undefined) {
                res.render('index', {
                    msg: 'Error: No File Selected!',
                })
            } else {
                res.render('index', {
                   msg: 'File Uploaded',
                   file: `uploads/${req.file.filename}` 
                })
            }
        }

    })
})

app.listen(port, () => console.log('run forest run', port))