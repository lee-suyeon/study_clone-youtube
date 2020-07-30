const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
  writer: {
    // 아이디만 넣어도 model/User를 참조하여 user의 모든 정보를 가져올 수 있다. 
    type: Schema.Types.ObjectId, 
    ref: 'User'
  },
  title: {
    type: String,
    maxlength: 50
  },
  description: {
    type: String
  },
  privacy: {
    type: Number,
  },
  filePath : {
      type: String,
  },
  catogory: String,
  views : {
      type: Number,
      default: 0 
  },
  duration :{
      type: String
  },
  thumbnail: {
      type: String
  }
}, {timestamps: true }); // 만든날짜, 업데이트 날짜 표시 

const Video = mongoose.model('Video', videoSchema);
module.exports = { Video };
