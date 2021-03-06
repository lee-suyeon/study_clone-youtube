const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require('./models/User');
const { auth } = require('./middleware/auth');
const config = require('./config/key');

// application/x-www-form-urlencoded 분석해서 가져온다.
app.use(bodyParser.urlencoded({ extended: true }));
// application/json 타입을 분석해서 가져온다. 
app.use(bodyParser.json());
// 쿠키파서 사용하기 
app.use(cookieParser());

const mongoose = require("mongoose");
const connect = mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.use('/uploads', express.static('uploads')); // 화면에 썸네일 표시
app.use('/api/video', require('./routes/video'));
app.use('/api/subscribe', require('./routes/subscribe'));
app.use('/api/comment', require('./routes/comment'));
app.use('/api/like', require('./routes/like'));

/******************** REGISTER ********************/
app.post('/api/users/register', (req, res) => {
  // 회원 가입 할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다. -> user모델을 가져와야 한다. 
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err}) // 실패
    return res.status(200).json({ success: true }) // 성공
  }) // 몽고DB 메서드. 클라이언트로부터 받은 정보를 저장
})


/******************** LOGIN ********************/
app.post('/api/users/login', (req, res) => {
  // 요청된 이메일을 데이터 베이스에 있는지 찾는다. 
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "이메일에 해당하는 유저가 없습니다"
      })
    }
    // 요청한 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
      // 비밀 번호 까지 같다면 유저를 위한 token 생성
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);
        // 토큰을 저장한다. 쿠키, 로컬스토리지, 세션스토리지
        res.cookie('x_auth', user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id });
      });
    })
  })
});


/******************** Authentication  ********************/
app.get('/api/users/auth', auth, (req, res) => {
  // 여기 까지 미들웨어를 통과해 왔다는 얘기는 인증이 true일때
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.roll === 0 ? false : true, // roll이 0이면 일반 유저 0이 아니면 관리자 
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})


/******************** LOGOUT  ********************/
app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: ''}, (err, user) => {
    if(err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true
    })
  })
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))