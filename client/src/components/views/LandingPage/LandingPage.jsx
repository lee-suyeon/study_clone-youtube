import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom';
import axios from 'axios';

function LandingPage(props) {


  const onClickLogout = () => {
    axios.get('api/users/logout')
      .then(response => {
        if(response.data.success){
          props.history.push('/login') // landingpage로 이동
        } else {
          alert('Failed to logout');
        }
      });
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '100vh'
    }}>
      <h2>시작 페이지</h2>
      <button onClick={onClickLogout}>Logout</button>
    </div>
  )
}

export default withRouter(LandingPage);
