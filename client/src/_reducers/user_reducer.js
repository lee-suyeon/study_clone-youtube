import { 
  LOGIN_USER, 
  REGISTER_USER,
  AUTH_USER
} from '../_actions/types';

export default function (state = {}, action){
  switch (action.type){
    case LOGIN_USER:
      console.log('login', action.payload);
      return {
        ...state,
        loginSuccess: action.payload
      }
    case REGISTER_USER:
      console.log('reg', action.payload);
      return {
        ...state,
        register: action.payload
      }
    case AUTH_USER:
      console.log('userData', action.payload);
      return {
        ...state,
        userData: action.payload
      }
    default:
      return state;
  }
}