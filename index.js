const express = require('express');
const app = express();
const port = 5000
const bodyParser = require('body-parser');
const { User } = require('./models/user');

const config = require('./config/key');

// application/x-www-form-urlencoded 분석해서 가져온다.
app.use(bodyParser.urlencoded({ extended: true }));
// application/json 타입을 분석해서 가져온다. 
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDb connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World! 안녕하세요'))

app.post('/register', (req, res) => {
  // 회원 가입 할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다. -> user모델을 가져와야 한다. 
  
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err}) // 실패
    return res.status(200).json({ success: true }) // 성공
  }) // 몽고DB 메서드. 클라이언트로부터 받은 정보를 저장
})



app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))