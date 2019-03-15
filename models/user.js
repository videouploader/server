const mongoose = require('mongoose');

const hashPassword = require('../helpers/hashPassword');

const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: {
    type: String},
  password: {
    type: String,
    required: [true, 'Password required']
  },
  listsVideo: [{
    type: Schema.Types.ObjectId,
    ref: 'Videolist'}]
});

userSchema.pre('save', function (next) {
  if (this.password) {
      this.password = hashPassword(this.password)
  }
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User