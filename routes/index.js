// Routes Quotes VideoUpload
const express = require('express');
const router = express.Router();
const images = require('../helpers/images')
const Video = require('../models/video')

const UserController = require('../controllers/userController')
const VideoController = require('../controllers/videoController');
const Authentication = require('../middlewares/authentication.js')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/user', UserController.findAll)
router.post('/register', UserController.register)
router.post('/login', UserController.login)

router.post('/upload',
  images.multer.single('image'), 
  images.sendUploadToGCS,
  (req, res) => {
    console.log('ini req.filenya', req.file)
    console.log("masuk sini upload post video", req.body)
    let obj = {
      link: req.file.cloudStoragePublicUrl,
      name: req.body.name
    }
    Video.create(obj)
    .then(videodb=>{
      console.log(videodb, 'masuk db')
    })
    .catch(err=>{
      console.log(err)
    })
    res.send({
      status: 200,
      message: 'Your file is successfully uploaded',
      link: req.file.cloudStoragePublicUrl
    })
    console.log("setelah res send upload")
  })

router.get('/video', VideoController.findVideo)
// router.use(Authentication)
// router.get('/videos', VideoController.displayListVideoByUserId)
// router.post('/videos', VideoController.create);
// router.delete('/videos/:id', VideoController.deleteIndividualVideo)



module.exports = router;