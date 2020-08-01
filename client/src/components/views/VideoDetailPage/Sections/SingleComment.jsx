import React, { useState } from 'react';
import { Comment, Avatar, Button, Input } from 'antd';
import { useSelector } from 'react-redux';
import axios from 'axios';
import LikeDislikes from './LikeDislikes';

const { TextArea } = Input;

function SingleComment(props) {
  const user = useSelector(state => state.user);

  const [openReply, setOpenReply] = useState(false);
  const [commentValue, setCommentValue] = useState('');

  const onClickOpenReply = () => {
    setOpenReply(prev => !prev);
  }

  const onChangeCommentValue = (e) => {
    setCommentValue(e.currentTarget.value);
  }

  const onSubmitComment = (e) => {
    e.preventDefault();

    const variables = {
      content: commentValue,
      writer: user.userData._id, // 리덕스에서 user 정보 가져오기
      videoId: props.videoId,
      responseTo: props.comment._id // 댓글 달 대상
    }
    
    axios.post('/api/comment/saveComment', variables )
      .then(response => {
        if(response.data.success){
          props.refreshFunction(response.data.result);
          setCommentValue('');
          setOpenReply(false);
          console.log('comment', response.data.result )
        } else {
          alert(' 커멘트를 저장하지 못했습니다. ')
        }
      })
  }
  
  const actions = [
    <LikeDislikes 
      userId={localStorage.getItem('userId')} 
      commentId={props.comment._id}
    />,
    <span onClick={onClickOpenReply} key="comment-basic-reply-to">Reply to</span>
  ]

  return (
    <div>
      <Comment
        actions={actions}
        author={props.comment.writer.name}
        avatar={<Avatar src={props.comment.writer.image} alt="image" />}
        content={<p>{props.comment.content}</p>}
      />
      {openReply &&
        <form style={{ display: 'flex' }} onSubmit={onSubmitComment}>
          <textarea
            style={{ width: '100%', borderRadius: '5px' }}
            onChange={onChangeCommentValue}
            value={commentValue}
            placeholder="코멘트를 작성해 주세요"
          />
          <br />
          <button style={{ width: '20%', height: '52px', }} onClick={onSubmitComment}>Submit</button>
        </form>
      }
    </div>
  )
}

export default SingleComment;