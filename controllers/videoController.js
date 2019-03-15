const User = require('../models/user')
const Video = require('../models/video')


class VideoController {
    
    //find all video from DB
    static findVideo(req,res) {
        console.log("Masuk ke static findAll")
        Video.find({})
            .then(lists => {
                console.log("Hasil pencarian video: ", lists )
                res.status(200).json({
                    msg: `List Video by all users`,
                    data: lists
                })
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({
                    msg: 'ERROR find video: ',error
                })        
            })
    }

    
    
    //save video link by userId
    static create(req,res) {
        console.log("Masuk ke method create Cek Input", req.body)
        Video.create({
            link: req.body.link,
            name: req.body.name,
            videouserid: req.body.userId
        })
        .then(videolist => {
            let newVideo = videolist
            console.log("created", videolist)
            User.findOneAndUpdate({
                _id: videolist.videouserid
            }, {$push: {listsVideo: videolist._id}})
            .then(user => {
                console.log("Hasil push new video:", user)
                res.status(200).json({
                    msg: 'Videolist is successfully being added',
                    data: newVideo
                })
            })
            .catch(error => {
                res.status(500).json({
                    msg: 'ERROR Push Video: ',error
                })
            })
        })
    }

    //show uploaded video by userId
    static displayListVideoByUserId (req,res) {
        console.log("masuk ke display video", req.loggedInUser)
        Video.find({
            videouserid: req.loggedInUser._id
        })
        .then(videolists => {
            console.log("User ditemukan, hasil pencarian user: ", videolists)
            //get all videos
            Video.find({})
            .then(lists => {
                console.log("Hasil pencarian video: ", lists )
                res.status(200).json({
                    msg: `List Video by user ${req.loggedInUser.email}`,
                    data: lists
                })
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({
                    msg: 'ERROR Populate VideoList after create: ',error
                })        
            })
        })
        .catch(error =>{
            res.status(500).json({
                msg: 'ERROR Display list of Video ', error
            })
        })       
    }

    //remove and delete favorites quote by userId
    static deleteIndividualVideo(req,res) {
        Video.findOne({
            _id: req.params.id
        })
        .then(videolist =>{
            console.log("Video yang akan diremove dan delete:", videolist, req.loggedInUser)
            User.findOneAndUpdate({
                _id:videolist.videouserid
            }, {$pull: {listsVideo: videolist._id}})
            .then(videoToDelete => {
                console.log("Hasil update user untuk delete video:", videoToDelete)
                Video.findOneAndDelete({
                    _id: req.params.id
                })
                .then(videoDelete => {
                    console.log("Hasil delete: ", videoDelete)
                    res.status(200).json({
                        msg: 'Video has been deleted',
                        data: videoDelete
                    })
                })
                .catch (error => {
                    res.status(500).json({
                        msg: "Error Delete Video", error
                    })
                })
            })
            .catch(error => {
                res.status(500).json({
                    msg: 'ERROR removing video from user ',error
                })
            })
        })
        .catch( error =>{
            res.status(500).json({
                msg: 'ERROR finding video to delete ',error
            })
        })
    }
}

module.exports = VideoController