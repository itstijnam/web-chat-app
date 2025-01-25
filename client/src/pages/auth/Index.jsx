import { useState } from 'react'
import './Index.scss'
import victory from '/victory-hand.png'
import { apiClient } from '../../lib/api-client'
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '../../utils/constants'
import {useNavigate} from 'react-router-dom';
import { useAppStore } from '../../store/Index'

function Auth() {
  const navigate = useNavigate()
  const {setUserInfo} = useAppStore()
  const [login, setLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [popUpMessage, setPopUpMessage] = useState('')
  const loginPageHandler = (textType) => {
    if (textType === 'login') {
      setLogin(true)
    } else if (textType === 'signup') {
      setLogin(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true });
      if (res.data.success) {
        console.log(res.data.user)
        setPopUpMessage(res.data.message)
        setEmail('');
        setPassword('');
        if(res.data.user.id){
          setUserInfo(res.data.user)
          if(res.data.user.profileSetup) navigate('/chat');
          else navigate('/profile')
        }
      }
    } catch (error) {
      setPopUpMessage(error.response.data.message)
      console.log(error)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password.toString() === confirmPassword.toString()) {
      try {
        const res = await apiClient.post(SIGNUP_ROUTE, { email, password }, { withCredentials: true });
        if (res.data.success) {
          setPopUpMessage(res.data.message)
          setEmail('');
          setPassword('');
          setConfirmPassword('')
          setUserInfo(res.data.user)
          navigate('/profile');
        }
      } catch (error) {
        setPopUpMessage(error.response.data.message)
        console.log(error)
      }
    } else {
      setEmail('');
      setPassword('');
      setConfirmPassword('')
      setPopUpMessage('Password and Confirm Passwaord should match')
    }
  }
  return (
    <div className='auth'>
      <div className='authB2'>
        <div className='authB3'>
          <div className='authB4'>
            <div className='authB5'>
              <h1>WELCOME</h1>
              <img src={victory} alt="" />
            </div>
            <p className='text-red-600'>Fill in the details to get started with the best chat app!</p>
          </div>
          <div className='formPageNavigation'>
            <p><span onClick={() => { loginPageHandler('login') }}>Login</span> <span onClick={() => loginPageHandler('signup')}>Signup</span></p>
            {
              !login &&
              <div>
                <form onSubmit={handleSignup} className='loginForm'>
                  <input type="email" name='email' className='' placeholder='Email' value={email} onChange={(e) => { setEmail(e.target.value) }} />
                  <input type="password" name='password' className='' placeholder=' Password' value={password} onChange={(e) => { setPassword(e.target.value) }} />
                  <input type="password" name='confirmPassword' className='' placeholder=' Confirm Password' value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} />
                  {
                    popUpMessage &&
                    <p className='errorPopup'>{popUpMessage}</p>
                  }
                  <button type='submit'>Create Account</button>
                </form>
              </div>
            }
            {
              login &&
              <div>
                <form onSubmit={handleLogin} className='loginForm'>
                  <input type="email" name='email' className='' placeholder='Email' value={email} onChange={(e) => { setEmail(e.target.value) }} />
                  <input type="password" name='password' className='' placeholder=' Password' value={password} onChange={(e) => { setPassword(e.target.value) }} />
                  {
                    popUpMessage &&
                    <p className='errorPopup'>{popUpMessage}</p>
                  }
                  <button type='submit' className='loginBtn'>Login</button>
                </form>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth