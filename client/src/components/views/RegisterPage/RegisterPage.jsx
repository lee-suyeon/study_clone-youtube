import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_actions';
import { withRouter } from 'react-router-dom';

function RegisterPage(props) {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onEmailHandler = (e) => {
    setEmail(e.target.value);
  }

  const onNameHandler = (e) => {
    setName(e.target.value);
  }

  const onPasswordHandler = (e) => {
    setPassword(e.target.value);
  }

  const onConfirmPasswordHandler = (e) => {
    setConfirmPassword(e.target.value);
  }
  
  const onSubmitHandler = (e) => {
    e.preventDefault();

    if(password !== confirmPassword){
      return alert('비밀번호가 일치하지 않습니다!');
    }

    let body = {
      name: name,
      email: email,
      password: password
    }
    dispatch(registerUser(body))
      .then(response => {
        if(response.payload.success){
          props.history.push('/login') // landingpage로 이동
        } else {
          alert('Failed to sign up');
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

        <label>Name</label>
        <input type="text" value={name} onChange={onNameHandler} />

        <label>Password</label>
        <input type="password" value={password} onChange={onPasswordHandler} />

        <label>Confirm Password</label>
        <input type="password" value={confirmPassword} onChange={onConfirmPasswordHandler} />

        <br />
        <button type="submit">회원 가입</button>
      </form>
    </div>
  )
}

export default withRouter(RegisterPage);
