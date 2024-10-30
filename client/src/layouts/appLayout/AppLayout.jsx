import React from 'react'
import NavApp from '../../components/navApp/NavApp'




export default function AppLayout({children}) {
  return (
    <div className='w-full flex flex-col items-center'>
      <NavApp/>
      <div className='w-full flex justify-center overflow-y-auto'>{children}</div>
    </div>
  )
}
