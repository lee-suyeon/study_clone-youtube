import React, { useState, useEffect } from 'react'
import axios from 'axios';

function Subscribe(props) {
  const [subscribeNumber, setSubscribeNumber] = useState(0)  
  const [subscribed, setSubscribed] = useState(false)  

  let variable = { userTo: props.userTo }

  useEffect(() => {
    axios.post('/api/subscribe/subscribeNumber', variable)
      .then(response => {
        if(response.data.success){
          setSubscribeNumber(response.data.subscribeNumber)
        } else {
          alert('구독자 수 정보를 받아오지 못했습니다.')
        }
      })

    // 내가 구독했는지 알아야 하기 때문에 나의 id가 필요하다. 
    let subscribedVariable = {
      userTo: props.userTo,
      userFrom: props.userFrom // 로컬스토리지에 저장되어있는 userId를 받아온다. 
    }
    axios.post('/api/subscribe/subscribed', subscribedVariable)
      .then(response => {
        if(response.data.success){
          setSubscribed(response.data.subscribed);
        } else {
          alert('구독 정보를 받아오지 못했습니다.')
        }
      })
  },[])

  const onClickSubscribe = () => {
    let subscribeVariables = {
      userTo: props.userTo,
      userFrom: props.userFrom
    }

    if(subscribed) { // 구독중일때 -> 구독취소
      axios.post('/api/subscribe/unSubscribe', subscribeVariables)
        .then(response => {
          if(response.data.success){
            setSubscribeNumber(state => state - 1);
            setSubscribed(prev => !prev)
          } else {
            alert('구독 취소 실패')
          }
        })
    } else { // 구독중이 아닐 때 -> 구독하기
      axios.post('/api/subscribe/subscribe', subscribeVariables)
        .then(response => {
          if(response.data.success){
            setSubscribeNumber(state => state + 1);
            setSubscribed(prev => !prev)
          } else {
            alert('구독 실패')
          }
        })
    }
  }

  return (
    <div>
      <button
        onClick={onClickSubscribe}
        style={{
          backgroundColor: `${subscribed ? 'tomato' : 'powderblue'}`,
          borderRadius: '4px', color: 'white',
          padding: '10px 16px', fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
      }}>
        {subscribeNumber} {subscribed ? 'Subscribed' : 'Subscribe' }
      </button>
    </div>
  )
}

export default Subscribe
