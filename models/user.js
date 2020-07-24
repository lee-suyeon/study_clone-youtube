const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');

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
    minlength: 5,
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

// 유저 모델에 유저 정보를 저장하기 전에 할 작업
userSchema.pre('save', function ( next ) {
  var user = this; // -> userSchema

  // 비밀 번호를 바꿀 때만 암호화하기 위한 조건
  if(user.isModified('password')){
    // 비밀번호를 암호화 시킨다. 
    // salt 생성(generate)
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if(err) return next(err); // 실패
  
      bcrypt.hash(user.password, salt, function(err, hash) { //hash : 암호화된 비밀번호
        if(err) return next(err);
        user.password = hash // 비밀번호를 암호화된 비밀번호로 바꿔준다. 1234 -> ****
        console.log("hash", hash);
        next();
      });
    });
  } else { // 비밀 번호를 바꾸지 않을 때는 다음으로 넘어간다. 
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  // plainPassword 1234567  암호화된 비밀번호 : $40233dkj3p5jkd
  // 암호화된 비밀번호를 복호화 할 수 없으니 plainPassword를 암호화해서 비교한다. 
  bcrypt.compare(plainPassword, this.password, function(err, isMatch){
    if(err) return cb(err);
    cb(null, isMatch)
  });
}

userSchema.methods.generateToken = function (cb) {
  var user = this; // -> userSchema
  // jsonwebtoken을 이용해서 token 생성하기
  var token = jwt.sign(user._id.toHexString(), 'secretToken')
  // user._id + 'secretToken' = token
  // decode : token - 'secretToken' = user._id 
  user.token = token;
  user.save(function(err, user){
    if(err) return cb(err)
    cb(null, user)
  });
}

userSchema.statics.findByToken = function ( token, cb) {
  var user = this;

  // 토큰을 복호화(decond) 한다. 
  jwt.verify(token, 'secretToken', function(err, decoded) {
    // 유저 아이디를 이용해서 유저를 찾은 다음에 클라이언트에서
    // 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
    user.findOne({"_id" : decoded, "token" : token}, function(err, user) {
      if(err) return cb(err)
      cb(null, user)
    });
  });
}



const User = mongoose.model('User', userSchema);

module.exports = { User };
