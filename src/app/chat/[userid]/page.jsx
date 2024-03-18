'use client'
import {StreamChat} from 'stream-chat'
import {Chat} from 'stream-chat-react'
import ChannelListContainer from '../../../../components/chatComponents/ChannelListContainer'
import ChannelContainer from '../../../../components/chatComponents/ChannelContainer'
import { useSession } from 'next-auth/react'
import 'stream-chat-react/dist/css/index.css'
import React, { useEffect } from 'react'
import { useStateContext } from '../../../../context/StateContext'

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY
const client = StreamChat.getInstance(apiKey)
const ChatPage =({params}) => {
  const {guestSession} = useStateContext()
  const {data:session} = useSession()
  const token = session ? session.token.token : null;
  useEffect(() => {
    if (token) {
      client.connectUser
      ({    
          id:params.userid,
          name:session.user.name,
          image:session.user.image
        }, token)
    }
    if (guestSession.name) {
      client.connectUser
      ({    
          id:guestSession.id,
          name:'Pk ProjectAccount1',
          image:guestSession.image
        }, guestSession.streamtoken)
    }
    localStorage.setItem('initial',true)
    
  }, [token, guestSession.id, guestSession.image, guestSession.name, guestSession.streamtoken, params.userid, session?.user?.image, session?.user?.name])
  
  

  return (
    <div className='flex w-full h-auto relative'>
      {(guestSession || session) && <Chat client={client} theme='default'>
        <div className="flex-grow-0 flex-shrink-0 border-[2px] border-grey-50">
          <ChannelListContainer />
        </div>
        <div/>
        <div className='sm:w-[79vw] w-[100vw] flex-grow-1 border-l-[0px] border-[2.5px] border-grey-50 bg-white'>
          <ChannelContainer/>
        </div>
      </Chat>}
    </div>
  )
}

export default ChatPage
