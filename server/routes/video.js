const express = require('express');
const router = express.Router();
// const { Video } = require('../models/Video');
const { auth } = require('../middleware/auth');
const multer = require('multer');


var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/') // 업로드한 파일을 저장하는 폴더 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`) // 저장할 파일 네임 형식 
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    if (ext !== '.mp4') { // 업로드 가능한 파일 형식
      return cb(res.status(400).end('only mp4 is allowed'), false);
    }
    cb(null, true)
  }
});

var upload = multer({ storage: storage }).single("file")

router.post('/uploadfiles', (req, res) => {
  // req를 통해 받은 비디오 파일을 서버에 저장한다. 
  upload(req, res, err => {
    if(err) {
      return res.json({ success: false, err});
    }
    return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename })
  })
})

module.exports = router;