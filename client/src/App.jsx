import React, { useEffect, useState } from 'react'
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import Auth from './pages/auth/Index'
import Chat from './pages/chat/Index'
import Profile from './pages/profile/Index'
import { useAppStore } from './store/Index'
import { apiClient } from './lib/api-client'
import { GET_USER_INFO } from './utils/constants'


const PrivateRoute = ({children})=>{
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth"/>
}

const AuthRoute = ({children})=>{
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat"/> : children
}

function App() {
  const {userInfo, setUserInfo} = useAppStore();
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    const getUserData = async () =>{
      try {
        const res = await apiClient.get(GET_USER_INFO, {withCredentials: true})
        if(res.data.success){
          setUserInfo(res.data) 
        }
      } catch (error) {
        setUserInfo(undefined);
        console(error.response.data.message)
      } finally{
        setLoading(false)
      }
    }
    if(!userInfo){
      getUserData();
    }else {
      setLoading(false);
    }
  },[])

  if(loading){
    return <div>Loading.....</div>
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path='/auth' 
          element={
            <AuthRoute>
              <Auth/>
            </AuthRoute>
          }
          />
        <Route path='/chat' element={<PrivateRoute><Chat/></PrivateRoute>} />
        <Route path='/profile' element={<PrivateRoute><Profile/></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/auth"/> }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App