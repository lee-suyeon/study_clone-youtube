const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, // 공백 부분을 없애준다.
    unique: 1 // 이메일 중복 제거
  },
  password: {
    type: String,
    maxlength: 8,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: { // 관리자와 일반
    type: Number,
    defalut: 0,
  },
  image: String,
  token: { // 유효성 관리
    type: String
  },
  tokenExp: { // 토큰 유효기간
    type: Number
  }
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
