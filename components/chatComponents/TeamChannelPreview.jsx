'use client'
import React, { useEffect, useState} from 'react'
import {Avatar,useChatContext} from 'stream-chat-react'
import { useStateContext } from '../../context/StateContext'
import { useSession } from 'next-auth/react'

const TeamChannelPreview = ({ channel }) => {
    const {channel:activeChannel, client ,setActiveChannel} = useChatContext()
    const lastMessage = channel.state.messages[channel.state.messages.length - 1];
    const {setIsPreviewing, channelQuery, setActiveAuthor} = useStateContext()
    const {data:session} = useSession()
    const [currentChannel, setCurrentChannel] = useState({})
    let initial
    const fetchData = async () =>{
        try {
            await channel.delete()
        } catch (error) {
            
        }
            
        localStorage.removeItem('isCreating')
        localStorage.setItem('initial',false)
    }
    const isCreating = sessionStorage.getItem('isCreating');
    useEffect(() => {
        if ((!currentChannel && lastMessage && !isCreating)|| (!currentChannel && isCreating && channel?.data?.author !== session.user.name) ){ 
            setCurrentChannel(channel)
            setActiveChannel(channel)
        }
        initial = sessionStorage.getItem('initial')
        
        if ( !initial && !channelQuery && !isCreating && !lastMessage && typeof window !== 'undefined') {
            fetchData()
        }

        
    }, []);

    const DirectPreview = () => {
        const members = Object.values(channel.state.members).filter(({user})=>user.id !== client.userID)  
        return (
            <div className='w-full flex flex-row px-5 py-8'>
                <div className='flex items-center'>
                    <Avatar
                        image={channel.data.image}
                        name={members[0]?.user?.name || members[0]?.user?.id}
                        size={65}
                        alt='channel img'
                    />
                </div>
                <div className='flex flex-col px-3 justify-center'>
                    <p className='text-slate-400'>{`${members[0]?.user.name}`}</p>
                    <p className='font-bold text-lg'>{channel?.data?.title?.length > 24
                        ? `${channel.data.title.slice(0, 25)}...`
                        : channel.data.title
                    }</p>
                    <p className='text-lg'>{lastMessage ? lastMessage.text : 'No messages'}</p>
                </div>
            </div>
        )
    } 
    if (lastMessage || (isCreating && channel?.data?.author !== session?.user?.name)){
    return (
        <div 
            className={`${
            channel?.id ===activeChannel?.id
            ? 'bg-gray-100'
            : 'bg-white'} min-w-[40px] border-y-[1.5px] border-grey-50`}
            onClick={()=>{
                setActiveChannel(channel)
                setCurrentChannel(channel)
                setActiveAuthor(channel.data.author)
                setIsPreviewing(false)
            }}   
        >
            <DirectPreview/>
        </div>
    )}
}

export default TeamChannelPreview