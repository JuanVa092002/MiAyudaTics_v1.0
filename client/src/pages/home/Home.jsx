import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <Link to="/loginMain">
      <button>ir al inicio de sesion</button>
      </Link>
      
    </div>
  )
}
