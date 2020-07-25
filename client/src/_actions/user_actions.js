import axios from 'axios';
import { LOGIN_USER } from '../_actions/types';

export function loginUser(dataToSubmit) {
  // 서버에서 받은 데이터를 변수 request에 저장
  const request = axios.post('/api/users/login', dataToSubmit)
      .then(response => response.data)
  console.log('request', request);
  // reducer로 넘겨준다. prevState + action => nextState
  return {
      type: LOGIN_USER,
      payload: request
  }
}