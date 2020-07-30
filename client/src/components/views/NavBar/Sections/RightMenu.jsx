import React from 'react'
import { Menu } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";

function RightMenu(props) {
  const user = useSelector(state => state.user)

  // 로그아웃 핸들러 
  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(respons => {
      if (respons.status === 200){
        props.history.push('/login');
      } else {
        alert('Logout Faild');
      }
    });
  }

  // 로그인 X
  if(user.userData && !user.userData.isAuth){
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <a href="/login">Sign in</a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register">Sign up</a>
        </Menu.Item>
      </Menu>
    )
  } else { // 로그인 O
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="upload">
          <a href="/video/upload">Video Upload</a>
        </Menu.Item>
        <Menu.Item key="logout">
          <a onClick={logoutHandler}>Logout</a>
        </Menu.Item>
      </Menu>
    )
  }
}

export default withRouter(RightMenu);
