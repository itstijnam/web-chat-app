import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../store/Index'
import './Index.scss'
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import {FaTrash, FaPlus} from "react-icons/fa"
import {toast} from 'sonner';
import { apiClient } from '../../lib/api-client';
import { ADD_PROFILE_IMAGE_ROUTE, HOST, REMOVE_PROFILE_IMAGE_ROTUE, UPDATE_PROFILE_ROUTE } from '../../utils/constants';

function Profile() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [message, setMessage] = useState('')
  const fileInputRef = useRef(null);

  useEffect(()=>{
    if(userInfo?.profileSetup){
      setFirstName(userInfo?.firstName)
      setLastName(userInfo?.lastName)
    }
    if(userInfo?.image){
        setImage(`${HOST}/${userInfo.image}`)
    }
  },[userInfo])

  const validateProfile = () =>{
    if(!firstName){
      toast.error("First name is required")
      return false;
    }
    if(!lastName){
      toast.error("Last name is required")
      return false;
    }
    return true;
  }
  
  const saveChanges = async () => {
    if(validateProfile()){
      try {
        const res = await apiClient.post(UPDATE_PROFILE_ROUTE, {firstName, lastName}, {withCredentials:true});

        if(res.data.success){
          setUserInfo({...res.data});
          toast.success(res.data.message)
          navigate('/chat');
        }
      } catch (error) {
        toast.error(error.response.data.message)
      }
    }
  }

  const handleNavigate = ()=>{
    if(userInfo?.profileSetup){
      navigate('/chat')
    }else{
      setMessage('Please set profile data')
    }
  }

  const handleFileInputClick = ()=>{
    fileInputRef.current.click();
  }

  const handleImageChange = async (event)=>{
    const file = event.target.files[0]
    if(file){
        const formData = new FormData();
        formData.append("profile-image", file)
        const res =await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {withCredentials: true})
        if(res.data.status===200 && res.data.image){
          setUserInfo({...userInfo, image: res.data.image});
          setMessage('Image has been updated')
        }
    }
  }

  const handleDeleteImage = async ()=>{
    try {
      const res = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROTUE, {withCredentials:true})
      if(res.data.success){
        setUserInfo({...userInfo, image:null});
        setMessage(res.data.message);
        setImage(null);
      }
    } catch (error) {
      setMessage(error.response.data.message)
    }
  };
  return (
    <div className='profile'>
      <div className='p1'>
        <div className='artopDiv' onClick={handleNavigate}>
          <IoArrowBack className='Arrowback' />
        </div>
        <div className='MHT'>
          <div
          className='mouseHoveredC'
          onMouseEnter={()=> setHovered(true)}
          onMouseLeave={()=> setHovered(false)}
          >
            <div className='Image'>
                  {image? (

                      <img src={image} alt="profile" />
                    ):(
                      <div>
                        {firstName
                         ? firstName.split("").shift()
                        : userInfo.email.split("").shift}
                      </div>
                    )
                  }
            </div>
            {
              hovered && (
                <div className='forHoveredImage' onClick={image ? handleDeleteImage : handleFileInputClick}>
                  {
                    image ? <FaTrash className='faTrash'/> : <FaPlus className='faPlus'/>
                  }
                </div>
              )
            }
            <input type="file" ref={fileInputRef} className='hidden' onChange={handleImageChange} name='profile-image' accept='.png, .jpg, .jpeg, .svg, .webp'/>
          </div>
          <div className=''>
            <div>
              <input type="email" placeholder='Email' disabled value={userInfo.email} className=''/>
            </div>
            <div>
              <input type="text" name='firstName' placeholder='First Name'  value={firstName} onChange={(e)=>setFirstName(e.target.value)} className=''/>
            </div>
            <div>
              <input type="text" name='lastName' placeholder='Last Name'  value={lastName} onChange={(e)=>setLastName(e.target.value)} className=''/>
            </div>
            <div className="widthFullBtn">
              <button onClick={saveChanges}>Save Changes</button>
            </div>
            {
              message && <p> {message} </p>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile