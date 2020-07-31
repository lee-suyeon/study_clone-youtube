const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema({
  writer : { // 댓글 작성한 사람
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  videoId: { // 댓글을 작성한 비디오 정보
    type: Schema.Types.ObjectId,
    ref: 'Video'
  },
  responseTo: { // 대댓글
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  content: { // 댓글 내용
    type: String
  }
}, {timestamps: true }); // 만든날짜, 업데이트 날짜 표시 

const Comment = mongoose.model('Comment', commentSchema);
module.exports = { Comment };
