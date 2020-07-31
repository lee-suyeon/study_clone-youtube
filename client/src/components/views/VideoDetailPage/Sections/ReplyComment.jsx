import React, { useState, useEffect } from 'react';
import SingleComment from './SingleComment';

function ReplyComment(props) {
  const [ChildCommentNumber, setChildCommentNumber] = useState(0)
  const [openReplyComments, setOpenReplyComments] = useState(false);
  
  useEffect(() => {
    let commentCount = 0;

    props.commentList.map(( comment) => {
      if(comment.responseTo === props.parentCommentId){
        commentCount++
      }
    })
    setChildCommentNumber(commentCount)
  }, [props.commentList, props.parentCommentId])

  let renderReplyComment = (parentCommentId) => 
    props.commentList.map((comment, index) => (
      <React.Fragment>
        {comment.responseTo === parentCommentId &&
          <div style={{ width: '80%', marginLeft: '40px' }}>
            <SingleComment refreshFunction={props.refreshFunction} key={index} comment={comment} videoId={props.videoId}/>
            <ReplyComment refreshFunction={props.refreshFunction} commentList={props.commentList} videoId={props.videoId} parentCommentId={comment._id}/>
          </div>
        }
      </React.Fragment>
    ))

  const onClickComment = () => {
    setOpenReplyComments(prev => !prev)
  }
  
  return (
    <div>
      {ChildCommentNumber > 0 &&
        <p style={{ fontSize: '14px', margin: 0, color: 'gray' }} onClick={onClickComment}>
          View {ChildCommentNumber} more comment(s)
        </p>
      }
      {openReplyComments &&
        renderReplyComment(props.parentCommentId)
      }
    </div>
  )
}

export default ReplyComment
