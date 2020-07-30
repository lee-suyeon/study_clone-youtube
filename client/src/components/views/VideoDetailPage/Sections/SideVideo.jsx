import React, { useState, useEffect } from 'react'
import axios from 'axios';
import moment from 'moment';

function SideVideo() {
  const [sideVideo, setSideVideo] = useState([]);


  // 모든 비디오 데이터 불러오기 
  useEffect(() => {
    axios.get('/api/video/getVideos')
      .then(response => {
        if(response.data.success){
          setSideVideo(response.data.videos);
        } else {
          alert('비디오 가져오기를 실패 했습니다.')
        }
      })
  }, [])

  const renderSideVideo = sideVideo.map((video, index) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);

    return <div key={`No.${index}`} style={{ display: 'flex', marginTop: '1rem', padding: '0 2rem' }}>
    <div style={{ width: '40%', marginRight: '1rem' }}>
      <a href={`/video/${video._id}`} style={{ color:'gray' }}>
        <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail" />
      </a>
    </div>
    <div style={{ width: '50%' }}>
      <a href={`/video/${video._id}`} style={{ color:'gray' }}>
        <h3 style={{ fontSize: '1rem', color: 'black'}}>{video.title}</h3>
          <div>{video.writer.name}</div>
          <div>{video.views}</div>
          <div>{minutes} : {seconds}</div>
      </a>
    </div>
  </div>
  })


  return (
    <React.Fragment>
      <div style={{ marginTop: '3rem'}}>
        {renderSideVideo}
      </div>
    </React.Fragment>


    
  )
}

export default SideVideo
