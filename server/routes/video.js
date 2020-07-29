const express = require('express');
const router = express.Router();
const { Video } = require('../models/Video');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');


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

var upload = multer({ storage: storage }).single("file");

router.post('/uploadfiles', (req, res) => {
  // req를 통해 받은 비디오 파일을 서버에 저장한다. 
  upload(req, res, err => {
    if(err) {
      return res.json({ success: false, err});
    }
    return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename })
  });
});

router.post('/uploadVideo', (req, res) => {
  // 비디오 정보들을 mongoDB에 저장한다. 
  const video = new Video(req.body) // 모든 variables의 정보를 가져온다. 
  video.save((err, doc) => {
    if(err) return res.json({ success: false, err })
    res.status(200).json({ sucess: true })
  })
});

router.post('/thumbnail', (req, res) => {
  // 썸네일을 생성하고 비디오 러닝타임도 가져온다. 
  let thumbsFilePath =""; // 파일주소
  let fileDuration =""; // 동영상 러닝 타임

  // 비디오 정보 가져오기
  ffmpeg.ffprobe(req.body.filePath, function(err, metadata){
    console.dir(metadata);
    console.log(metadata.format.duration);

    fileDuration = metadata.format.duration;
})


  // 썸네일 생성
  ffmpeg(req.body.filePath) // 업로드한 동영상의 주소를 가져와서 
    .on('filenames', function (filenames) { // 비디오의 썸네일 파일 이름을 생성
      console.log('Will generate ' + filenames.join(', '))
      thumbsFilePath = "uploads/thumbnails/" + filenames[0];
    })
    .on('end', function () { // 썸네일 생성 후 할일
      console.log('Screenshots taken');
      return res.json({ success: true, thumbsFilePath: thumbsFilePath, fileDuration: fileDuration})
    })
    .screenshots({ // 옵션
      // Will take screens at 20%, 40%, 60% and 80% of the video
      count: 3, // 3개의 썸네일
      folder: 'uploads/thumbnails', // 저장 폴더 위치
      size:'320x240', // 썸네일 사이즈 
      // %b input basename ( filename w/o extension )
      filename:'thumbnail-%b.png' // 생성되는 썸네일의 파일 이름
    });
});

module.exports = router;