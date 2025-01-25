import React from 'react'
import './Index.scss'
import {useAppStore} from '../../../../../../store/Index'
import {HOST, LOGOUT_ROUTE} from '../../../../../../utils/constants'
import {apiClient} from '../../../../../../lib/api-client'
import { useNavigate } from 'react-router-dom'

function ProfileInfo() {
    const {userInfo, setUserInfo} = useAppStore()
    const navigate = useNavigate()
    const logOutHandler = async ()=>{
        try {
            const res = await apiClient.post(LOGOUT_ROUTE,{}, {withCredentials:true})
            if(res.status.success){
                setUserInfo(null)
                navigate('auth')
            }
        } catch (error) {
            
        }
    }
  return (
    <div className='ProfileInfo'>
        <div className='PB1' onClick={()=>navigate('/profile')} >
            <div className="Image">
                <img src={`${HOST}/${userInfo.image}`} alt="" />
            </div>
            <span>{userInfo?.firstName} {userInfo?.lastName}</span>
        </div>
        <div className='userEmail'>
            {userInfo?.email}
        </div>

        <button onClick={logOutHandler} className='logoutBtn'>Logout</button>
    </div>
  )
}

export default ProfileInfo