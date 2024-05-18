import React, { useState } from 'react'
import axios from "axios";
const Login = () => {
  const [logindata, setLogindata]=useState({email:"", username:"", password:""});

  const handleLogin=async()=>{
    try {
      console.log(logindata)
      const res= await axios.post('http://localhost:5000/api/v1/user/loginuser',logindata,{withCredentials:true})
      if(!res) throw new Error('No Response!!')
      const res_data= res.data.data;
    console.log(res.data.data)
    alert("login sucess")
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='w-full h-screen flex flex-col justify-center items-center bg-gray-500 gap-10'>
      <input type="text" placeholder='email' onChange={(e)=>{setLogindata({...logindata,email:e.target.value})}}/> 
      <input type="text" placeholder='username' onChange={(e)=>{setLogindata({...logindata,username:e.target.value})}}/> 
      <input type="password" placeholder='password' onChange={(e)=>{setLogindata({...logindata,password:e.target.value})}}/>
      <input type="submit"  onClick={handleLogin}/>
    </div>
  )
}

export default Login
