const mongoose = require('mongoose')
const Schema = mongoose.Schema

const videoSchema = new Schema ({
    link: {type: String},
    name: {type: String},
    videouserid: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
    },
    {
        timestamps: true
})

const VideoList = mongoose.model('Videolist', videoSchema)

module.exports = VideoList

