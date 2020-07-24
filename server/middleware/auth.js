const { User } = require('../models/user')

let auth = (req, res, next) => {
  // 인증 처리를 하는 곳

  // 클라이언트 쿠키에서 토큰을 가져온다. -> cookie parser
  let token = req.cookies.x_auth;

  // 토큰을 복호화 한 후 유저를 찾는다. 
  User.findByToken(token, (err, user) => {
    if(err) throw err;
    if(!user) return res.json({ isAuth: false, error: true }); // 유저가 없을 때
    req.token = token;
    req.user = user;
    next(); // 다음 동작으로 넘어 갈 수 있게 
  })

  // 유저가 있으면 인증 OK

  // 유저가 없으면 인증 fail
}

module.exports = { auth };