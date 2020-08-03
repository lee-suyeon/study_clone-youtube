import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { List, Avatar, Row, Col } from 'antd';
import axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';
import LikeDislikes from './Sections/LikeDislikes';


function VideoDetailPage(props) {
  const user = useSelector(state => state.user);
  // http://localhost:3000/video/5f22330b522ee31a9cb2038c에 아이디 부분을 가져온다. 
  const videoId = props.match.params.videoId;
  const variable = { videoId: videoId };
  const [videoDetail, setVideoDetail] = useState([]);
  const [comments, setComments] = useState([]);
  
  useEffect(() => {
    axios.post('/api/video/getVideoDetail', variable)
      .then(response => {
        if(response.data.success){
          setVideoDetail(response.data.videoDetail);
        } else {
          alert('비디오 정보를 가져오지 못했습니다');
        }
      });

    // 모든 댓글의 정보를 가져온다. 
    axios.post('/api/comment/getComments', variable)
      .then(response => {
        if(response.data.success){
          setComments(response.data.comments);
          console.log('모든정보',response.data.comments);
        } else {
          alert('커멘트 정보를 가져오지 못했습니다');
        }
      });
  }, [])

  // 댓글을 화면에 표현
  const refreshFunction = (newComment) => {
    setComments(comments.concat(newComment));
  }



  if(videoDetail.writer){
    // console.log('1', videoDetail.writer._id)
    // // 5f1fc3f1e0755951843b468e
    // console.log('2',  user.userData._id)
    console.log('2',  user.userData._id)
    // // 5f2172aa3b385f4f44114497
 
    // 유저가 자신의 동영상 일때 구독 버튼 숨김
    const subscribeButton = videoDetail.writer._id !== user.userData._id 
    &&  <Subscribe userTo={videoDetail.writer._id} userFrom={user.userData._id} /> 
    // sroovy : 5f2172aa3b385f4f44114497
    // test
    return (
      <div>
        <Row gutter={[16, 16]}>
          <Col lg={18} xs={24}>
            <div style={{ width: '100%', padding: '3rem 4rem' }}>
              <video style={{ width: "100%" }} src={`http://localhost:5000/${videoDetail.filePath}`} controls/>
              <List.Item
                actions={[ <LikeDislikes
                video
                userId={user.userData._id} 
                videoId={videoId}/>, subscribeButton ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={videoDetail.writer.image} />}
                  title={videoDetail.writer.name}
                  description={videoDetail.description}
                />      
              </List.Item>
              <Comment refreshFunction={refreshFunction} commentList={comments}/>
            </div>
          </Col>
          <Col lg={6} xs={24}>
            <SideVideo />
          </Col>
        </Row>
      </div>
    )
  } else {
    return <div> loading ... </div>
  }
}

export default withRouter(VideoDetailPage);
