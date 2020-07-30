import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom';
import { List, Avatar, Row, Col } from 'antd';
import axios from 'axios';


function VideoDetailPage(props) {
  // http://localhost:3000/video/5f22330b522ee31a9cb2038c에 아이디 부분을 가져온다. 
  const videoId = props.match.params.videoId;
  const variable = { videoId: videoId };
  const [videoDetail, setVideoDetail] = useState([]);
  
  useEffect(() => {
    axios.post('/api/video/getVideoDetail', variable)
      .then(response => {
        if(response.data.success){
          setVideoDetail(response.data.videoDetail);
        } else {
          alert('비디오 정보를 가져오지 못했습니다');
        }
      });
  }, [])

  if(videoDetail.writer){
    return (
      <div>
        <Row gutter={[16, 16]}>
          <Col lg={18} xs={24}>
            <div style={{ width: '100%', padding: '3rem 4rem' }}>
              <video style={{ width: "100%" }} src={`http://localhost:5000/${videoDetail.filePath}`} controls/>
              <List.Item
                actions
              >
                <List.Item.Meta
                  avatar={<Avatar src={videoDetail.writer.image} />}
                  title={videoDetail.writer.name}
                  description={videoDetail.description}
                />      
              </List.Item>
              {/* Comments */}
            </div>
          </Col>
          <Col lg={6} xs={24}></Col>
        </Row>
      </div>
    )
  } else {
    return <div> loading ... </div>
  }
}

export default withRouter(VideoDetailPage);
