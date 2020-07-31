import React, { useState } from 'react'
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comment(props) {
  // 현재 비디오 id 가져오기. 
  const videoId = props.match.params.videoId;

  const user = useSelector(state => state.user);
  const [commentValue, setCommentValue] = useState("");

  const onChangeComment = (e) => {
    setCommentValue(e.currentTarget.value);
  }
  
  const onSubmitComment = (e) => {
    e.preventDefault();

    const variables = {
      content: commentValue,
      writer: user.userData._id, // 리덕스에서 user 정보 가져오기
      videoId: videoId
    }
    
    axios.post('/api/comment/saveComment', variables )
      .then(response => {
        if(response.data.success){
          console.log(response.data.result);
          props.refreshFunction(response.data.result); // VideoDetail로 전달
          setCommentValue('');
        } else {
          alert(' 커멘트를 저장하지 못했습니다. ')
        }
      })
  }

  return (
    <div>
      <br />
      <h3> Replies </h3>
      <hr />

      {/* Comment Lists */}
        {props.commentList && props.commentList.map(( comment, index) => (
          (!comment.responseTo &&
            <React.Fragment>
              <SingleComment refreshFunction={props.refreshFunction} key={index} comment={comment} videoId={videoId}/>
              <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} commentList={props.commentList} videoId={videoId}/>
            </React.Fragment>
          )
        ))}


      {/* Root Comment Form */}

      <form style={{ display: 'flex' }} onSubmit={onSubmitComment}>
        <textarea
          style={{ width: '100%', borderRadius: '5px' }}
          onChange={onChangeComment}
          value={commentValue}
          placeholder="코멘트를 작성해 주세요"
        />
        <br />
        <button style={{ width: '20%', height: '52px', }} onClick={onSubmitComment}>Submit</button>
      </form>
    </div>
  )
}

export default withRouter(Comment)
