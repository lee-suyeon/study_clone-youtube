import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Tooltip, Button } from 'antd';
import { LikeOutlined, LikeFilled, DislikeOutlined, DislikeFilled } from '@ant-design/icons'

function LikeDislikes(props) {
  const [likeNumbers, setLikeNumbers] = useState(0);
  const [likeAction, setLikeAction] = useState(null);
  const [dislikeNumbers, setDislikeNumbers] = useState(0);
  const [dislikeAction, setDislikeAction] = useState(null);


  let variable = {}
  if(props.video){ // 비디오 좋아요 싫어요
    variable = {
      videoId: props.videoId,
      userId: props.userId
    }
  } else { // 댓글 좋아요 싫어요 
    variable = {
      commentId: props.commentId,
      userId: props.userId
    }
  }

  useEffect(() => {
    // 좋아요 정보 가져오기
    axios.post('/api/like/getLikes', variable )
      .then(response => {
        if(response.data.success){
          // 좋아요 수
          setLikeNumbers(response.data.likes.length);
          // 좋아요 상태
          response.data.likes.map(like => { // 모든 사람이 좋아요를 누른 데이터
            if(like.userId === props.userId){ // 모든 데이터 중에 내 아이디 === 내 유저 아이디 -> 내가 좋아요를 누른 상태
              setLikeAction('liked')
            }
          })
        } else {
          alert('Likes에 정보를 가져오지 못했습니다.')
        }
      })

    // 싫어요 정보 가져오기
    axios.post('/api/like/getDislikes', variable )
      .then(response => {
        if(response.data.success){
          // 싫어요 수
          setDislikeNumbers(response.data.dislikes.length);
          // 싫어요 상태
          response.data.dislikes.map(dislike => { // 모든 사람이 좋아요를 누른 데이터
            if(dislike.userId === props.userId){ // 모든 데이터 중에 내 아이디 === 내 유저 아이디 -> 내가 좋아요를 누른 상태
              setDislikeAction('disliked')
            }
          })
        } else {
          alert('Dislikes에 정보를 가져오지 못했습니다.')
        }
      })
  }, [])

  const onClickLike = () => {
    if(likeAction === null){ // 좋아요가 클릭이 안되있을때
      axios.post('/api/like/upLike', variable)
        .then(response => {
          if(response.data.success){
            setLikeNumbers(prev => prev + 1);
            setLikeAction('liked');
            console.log('dontlike',likeAction);
            if(dislikeAction !== null){
              setDislikeNumbers(prev => prev - 1);
              setDislikeAction('');
            }
          } else {
            alert('Like를 올리지 못하였습니다')
          }
        })
    } else { // 좋아요가 클릭 되어 있을 때
      axios.post('/api/like/unLike', variable)
        .then(response => {
          if(response.data.success){
            console.log('unlike',likeAction);
            setLikeNumbers(prev => prev - 1);
            setLikeAction(null);
          } else {
            alert('Like를 내리지 못하였습니다')
          }
        })
    }
  }

  const onDislike = () => {
    // 싫어요가 클릭이 안되있을 때
    if(dislikeAction === null){
      axios.post('/api/like/upDislike', variable)
        .then(response => {
          if(response.data.success){
            setDislikeNumbers(prev => prev + 1);
            setDislikeAction('disliked');
            if(likeAction !== null){ // like에 클릭되어있을 때 
              setLikeNumbers(prev => prev - 1);
              setLikeAction(null);
            }
          } else {
            alert('Dislike를 올리지 못하였습니다')
          }
        })
    } else {
      // 싫어요가 클릭 되어있을 때
      axios.post('/api/like/unDislike', variable)
        .then(response => {
          if(response.data.success){
            setDislikeNumbers(prev => prev - 1);
            setDislikeAction(null);
          } else {
          alert('Dislike를 내리지 못하였습니다')
          }
        })
    }
  }

  return (
    <div>
      <span key="comment-basic-like" style={{ marginRight: '0.3rem' }}>
        <Tooltip title="Like">
          <Button
            onClick={onClickLike}
            style={{ border: 'none'}}
            icon={likeAction === 'liked' ? <LikeFilled /> : <LikeOutlined />}
          />
        </Tooltip>
        <span style={{ paddingLeft: '8px', cursor: 'auto'}}>{likeNumbers}</span>
      </span>

      <span key="comment-basic-dislike">
        <Tooltip title="Dislike">
        <Button
            onClick={onDislike}
            style={{ border: 'none'}}
            icon={dislikeAction === 'disliked' ? <DislikeFilled /> : <DislikeOutlined />}
          />
        </Tooltip>
      <span style={{ paddingLeft: '8px', cursor: 'auto'}}>{dislikeNumbers}</span>
      </span>
    </div>
  )
}

export default LikeDislikes
