import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_actions';

export default function (SpecificComponent, option, adminRoute = null) {
  
  //null -> 아무나 출입이 가능한 페이지
  // true -> 로그인한 유저만 출입이 가능한 페이지
  // false -> 로그인한 유저는 출입 불가능한 페이지

  function AuthenticationCheck(props) {
    const dispatch = useDispatch();

      // 서버에서 유저의 상태를 요청한다. 
      useEffect(() => {
        dispatch(auth()).then(response => {
          console.log(response)

          // 로그인 하지 않은 상태
          if(!response.payload.isAuth){
            if(option){
              props.history.push('/');
            }
          } else { // 로그인 한 상태
            if(adminRoute && !response.payload.isAdmin){ // 일반 유저가 adminpage에 접근하려고 할 때 
              props.history.push('/')
            } else { 
              if(option === false){
                props.history.push('/');
              }
            }
          }
        })
      }, [])

      return (
        <SpecificComponent />
      )
  }
  return AuthenticationCheck
}