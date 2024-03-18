'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { MessageList, MessageInput, Window, useChannelActionContext, Avatar, useChannelStateContext, useChatContext } from 'stream-chat-react';
import Modal from './Modal';
import { useStateContext } from '../../context/StateContext';
import { GoArrowLeft } from "react-icons/go";
import { useSession } from 'next-auth/react';

export const GiphyContext = React.createContext({});

const ChannelInner = () => {
  const {data:session} = useSession()
  const [giphyState, setGiphyState] = useState(false);
  const { sendMessage} = useChannelActionContext();
  const [offered, setOffered] = useState(false)
  const {activeAuthor,modal,setModal} = useStateContext()

  const overrideSubmitHandler = (message) => {
    let updatedMessage = {
      attachments: message.attachments,
      mentioned_users: message.mentioned_users,
      parent_id: message.parent?.id,
      parent: message.parent,
      text: message.text,
    };
    
    if (giphyState) {
      updatedMessage = { ...updatedMessage, text: `/giphy ${message.text}` };
    }
    
    if (sendMessage) {
      sendMessage(updatedMessage);
      setGiphyState(false);
    }
  };

  return (
    <GiphyContext.Provider value={{ giphyState, setGiphyState }}>
      <div style={{background:'white', display: 'flex', width: '100%' }}>
        <Window>
          <TeamChannelHeader setOffered={setOffered} />
          <MessageList />
          <div className='flex flex-row'>
            <MessageInput overrideSubmitHandler={overrideSubmitHandler} />
            {!offered && activeAuthor !== session?.user?.name && <button onClick={()=>setModal(true)} className='bg-pink-100 rounded-lg mt-2 mr-7 w-28 h-[57px] font-bold'>Offer</button>}
          </div>
        </Window>
        {modal && <Modal setModal={setModal} />}
      </div>
    </GiphyContext.Provider>
  );
};

const TeamChannelHeader = ({setOffered}) => {
    const { channel,  watcher_count} = useChannelStateContext();
    const { client } = useChatContext();
    const router = useRouter()
    const { offer,setOffer,acceptedOffer, setAcceptedOffer,setIsPreviewing,setActiveAuthor } = useStateContext()

    useEffect(() => {
      if (channel && offer?.channelid == channel?.cid) {
        channel.update({productid:channel.data.productid,title:channel.data.title, author:channel.data.author, image:channel.data.image, offer:offer.offer})
      }
      setOffer(null)
      if (channel.data.offer ){
        setOffered(true)
      }
    }, [offer,channel?.data?.offer])
    
    useEffect(()=>{
        if (acceptedOffer) {
          channel.sendMessage({
            text: `Accepted offer for $${acceptedOffer}`,
            customType:'accept'
          })
        setAcceptedOffer(0)
      }
      setActiveAuthor(channel.data.author)
    },[acceptedOffer])

    const handleRedirect = () => {router.push(`/listing/${channel.data.productid}`)}

    const MessagingHeader = () => {
      const members = Object.values(channel.state.members).filter(({ user }) => user.id !== client.userID);
      const additionalMembers = members.length - 3;
      const getWatcherText = (watchers) => {
        if (watchers === 2) return `online`;
        return 'offline'
      };
      
        return (
          <div className='bg-white border-grey-50 border-b-2 flex flex-row'>
            <GoArrowLeft size={35} className='my-6 ml-3 sm:hidden block' onClick={()=>setIsPreviewing(true)}/>
            {members.map(({ user }, i) => (
              <div key={i} className='flex flex-row p-4 relative'>
                {watcher_count == 2 && <div className='bg-green-400 absolute h-4 w-4 rounded-full left-[53px] bottom-[14px]'/>}
                <Avatar  onClick={()=>handleRedirect()} image={channel.data.image} name={user.fullName || user.id} size={50} />
                <div>
                  <p className='font-bold whitespace-nowrap'>{channel.data.title}</p>
                  <p className={watcher_count !== 2?'text-slate-200':'text-slate-400'}>{getWatcherText(watcher_count)}</p>
                </div>
                {channel?.data?.offer && <p className='text-slate-400 whitespace-nowrap text-[20px] px-[30%] py-[11px]'>Accepted offer of ${channel.data.offer}</p>}
              </div>
            ))}
  
            {additionalMembers > 0 && <p className='team-channel-header__name user'>and {additionalMembers} more</p>}
            
          </div>
        );
      
  
    };
  
    return (
      <div>
        <MessagingHeader />
      </div>
    );
  };

  export default ChannelInner;