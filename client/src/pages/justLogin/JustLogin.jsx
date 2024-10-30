import React from 'react'
import LoginLayout from '../../layouts/loginLayout/LoginLayout'
import LoginForm from '../../components/loginForm/LoginForm'


export default function JustLogin() {
  return (
    <LoginLayout>
        <div>
            <LoginForm/>
        </div>
    </LoginLayout>
  )
}
