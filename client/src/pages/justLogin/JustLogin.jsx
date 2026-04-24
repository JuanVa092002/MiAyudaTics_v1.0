import React from 'react'
import LoginForm from '@/components/loginForm/LoginForm'

export default function JustLogin() {
  return (
    <main className="bg-background min-h-screen flex flex-col justify-center items-center px-6 font-public-sans text-on-background">
      <LoginForm />
    </main>
  )
}
