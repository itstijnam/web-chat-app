import React, { useEffect, useState } from 'react';
import './CreateChannel.scss';
import { useAppStore } from '../../../../../../store/Index';
import { CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS_ROUTES, HOST } from '../../../../../../utils/constants';
import { apiClient } from '../../../../../../lib/api-client';

function CreateChannel() {
    const { setSelectedChatType, setSelectedChatData, addChannel } = useAppStore();
    const [newChannelModal, setNewChannelModal] = useState(false);
    const [allContacts, setAllContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]); // Multiple selected contacts
    const [channelName, setChannelName] = useState('');
    const [errorMessagePop, setErrorMessagePop] = useState('')

    const newChannelDialogueHandler = () => {
        setNewChannelModal(!newChannelModal);
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await apiClient.get(GET_ALL_CONTACTS_ROUTES, { withCredentials: true });
                setAllContacts(res.data.contacts);
            } catch (error) {
                console.error('Error fetching contacts:', error);
            }
        };
        getData();
    }, []);

    const handleContactSelection = (contactId) => {
        setSelectedContacts((prevSelected) => {
            if (prevSelected.includes(contactId)) {
                return prevSelected.filter((id) => id !== contactId); // Remove if already selected
            } else {
                return [...prevSelected, contactId]; // Add if not selected
            }
        });
    };

    const createChannel = async () => {
        try {
            if (channelName.length > 0 && selectedContacts.length > 0) {
                const res = await apiClient.post(
                    CREATE_CHANNEL_ROUTE,
                    {
                        name: channelName,
                        members: selectedContacts, // Directly send selectedContacts array
                    },
                    { withCredentials: true }
                );
    
                if (res.data.success) { // Fix incorrect `res.status.success`
                    setChannelName("");
                    setSelectedContacts([]);
                    setNewChannelModal(false);
                    addChannel(res.data.channel);
                }
            }
        } catch (error) {
            setErrorMessagePop(error?.response?.data?.message || "An error occurred.");
            console.log(error);
        }
    };
    

    return (
        <div className='newDM'>
            <div onClick={newChannelDialogueHandler} className='plusIcon'>
                + 
            </div>
            {errorMessagePop}
            {newChannelModal && (
                <div className='dialogueBox'>
                    <div className='searchNewUser'>
                        <input
                            type='text'
                            className='dialogueInput'
                            value={channelName}
                            onChange={(e) => setChannelName(e.target.value)}
                            placeholder='Channel Name'
                        />
                    </div>
                    <div className='contactsList'>
                        <h4>Select Contacts:</h4>
                        {allContacts.map((contact, index) => (
                            <div key={index} className='contactItem'>
                                <label>
                                    <input
                                        type='checkbox'
                                        checked={selectedContacts.includes(contact.value)} 
                                        onChange={() => handleContactSelection(contact.value)}
                                    />
                                    {contact.label}
                                </label>
                            </div>
                        ))}
                    </div>
                    <div>
                        <button className='createChannelBtn' onClick={createChannel}>
                            Create Channel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateChannel;
