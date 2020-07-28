import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_actions';
import { withRouter } from 'react-router-dom';

function LoginPage(props) {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onEmailHandler = (e) => {
    setEmail(e.target.value);
  }

  const onPasswordHandler = (e) => {
    setPassword(e.target.value);
  }
  
  const onSubmitHandler = (e) => {
    e.preventDefault();

    console.log(email);
    console.log(password);
    let body = {
      email: email,
      password: password
    }
    dispatch(loginUser(body))
      .then(response => {
        if(response.payload.loginSuccess){
          props.history.push('/') // landingpage로 이동
        } else {
          alert('Error');
        }
      })
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '100vh'
    }}>
      <form style={{ display: 'flex', flexDirection: 'column'}}
        onSubmit={onSubmitHandler}>
        <label>Email</label>
        <input type="email" value={email} onChange={onEmailHandler} />
        <label>Password</label>
        <input type="password" value={password} onChange={onPasswordHandler} />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default withRouter(LoginPage);
