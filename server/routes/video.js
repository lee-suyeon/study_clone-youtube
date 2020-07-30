const express = require('express');
const router = express.Router();
const multer = require('multer');
var ffmpeg = require('fluent-ffmpeg');

const { Video } = require("../models/Video");
//const { Subscriber } = require("../models/Subscriber");
//const { auth } = require("../middleware/auth");

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
})

var upload = multer({ storage: storage }).single("file")


router.post("/uploadfiles", (req, res) => {
  // req를 통해 받은 비디오 파일을 서버에 저장한다. 
  upload(req, res, err => {
    if (err) {
      return res.json({ success: false, err })
    }
    return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
  })
});


router.post("/thumbnail", (req, res) => {
  // 썸네일을 생성하고 비디오 러닝타임도 가져온다. 
  let thumbsFilePath =""; // 파일주소
  let fileDuration =""; // 동영상 러닝 타임

  // 비디오 정보 가져오기
  ffmpeg.ffprobe(req.body.filePath, function(err, metadata){
    fileDuration = metadata.format.duration;
  })

  // 썸네일 생성
  ffmpeg(req.body.filePath)
    .on('filenames', function (filenames) { // 업로드한 동영상의 주소를 가져와서 
      console.log('Will generate ' + filenames.join(', ')) // 비디오의 썸네일 파일 이름을 생성
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


router.post("/uploadVideo", (req, res) => {
  // 비디오 정보들을 mongoDB에 저장한다. 
  const video = new Video(req.body)  // 모든 variables의 정보를 가져온다. 
  video.save((err, video) => {
    if(err) return res.status(400).json({ success: false, err })
    return res.status(200).json({
      success: true 
    })
  })
});


router.get("/getVideos", (req, res) => {
  // 비디오를 DB 에서 가져와서 클라이언트에 보낸다. 
  Video.find() // 비디오에 모든 정보를 가져온다. 
    .populate('writer') // 모든 'wirter' 정보를 가져온다. (참조된 User정보까지) 
    .exec(( err, videos ) => {
      if(err) return res.status(400).send(err);
      res.status(200).json({ success: true, videos })
    })
});


router.post("/getVideoDetail", (req, res) => {
  // 클라이언트에서 보내준 videoId로 찾는다. 
  Video.findOne({ "_id" : req.body.videoId })
    .populate('wirter')
    .exec(( err, videoDetail) => {
      if(err) return res.status(400).send(err)
      return res.status(200).json({ success: true, videoDetail })
    })  
});

module.exports = router;