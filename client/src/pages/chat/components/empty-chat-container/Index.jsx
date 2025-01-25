import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Index.scss'
import { useAppStore } from '../../../../store/Index';
import { HOST } from '../../../../utils/constants';

function EmptyChatContainer() {
  const [users, setUsers] = useState([]);
  const { onlineUsers, userInfo } = useAppStore();

  console.log('Online Users:', onlineUsers); // Logs the array of online user IDs

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${HOST}/api/auth/all-users`, {
          withCredentials: true,
        });
        if (res.data.success) {
          console.log('Fetched all users:', res.data.users);
          setUsers(res.data.users); // Store users in state
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers(); // Call the async function
  }, []);

  return (
    <div className='EmptyChatContainer'>
      <div className='ECC1'>
        <h1 className='Users'>All Users</h1>
        <ul>
          {console.log('users', users)}
          {users.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            return (
              <div className='onlineDiv' key={user._id} >
                <div className='userOnlineDetail'>
                  <div className='userOnlineImage'>
                    {
                      user.image ? (<>
                        <img src={`${HOST}/${user.image}`} alt="" />
                      </>) : (<div className='imageNotAvailable'>
                        <span>CN</span>
                      </div>)
                    }
                  </div>
                  {
                    user.firstName ? (<>{user.firstName} {user.lastName}</>) :
                      (<>{user.email}</>)
                  }
                </div>
                <div className='statusCheck'>
                  <div className="profileSetupCheck">
                    { user?.profileSetup ? (<span className='onlineGreenColor'>Profile Setup</span>) : (<span>Profile Pending</span>) }
                  </div>
                  <div className='onlineCheck'>
                    { isOnline ? (<span className='onlineGreenColor'>Online</span>) : (<span>Offline</span>) }
                  </div>
                </div>
              </div>
            );
          })}
        </ul>
      </div>
    </div>

  );
}

export default EmptyChatContainer;
