import React from 'react'
import { Outlet } from 'react-router-dom';

const LoginLayout = () => {
  return (
      <div className='bg-background-0 h-screen font-roboto flex'>
        
          <Outlet />
        </div>
    
  )
}

export default LoginLayout
