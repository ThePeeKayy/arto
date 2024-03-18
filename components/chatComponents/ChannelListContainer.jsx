'use client'

import {ChannelList, useChatContext} from 'stream-chat-react'
import ChannelSearch from './ChannelSearch'
import TeamChannelPreview from './TeamChannelPreview'
import TeamChannelList from './TeamChannelList'
import { useStateContext } from '../../context/StateContext'
import React, { useEffect, useState } from 'react'

const customChannelMessagingFilter = (channels) => {
  return channels.filter((channel) => channel.type=='messaging' )
}

const ChannelListContainer = () => {
  const {channelQuery} = useStateContext()
  const {client} = useChatContext()
  const [filter,setFilter] = useState({})
  
  useEffect(() => {
    if (channelQuery.length) {setFilter({
        members: { $in: [client.userID] },
        title: { $autocomplete: channelQuery }
    })} else {
      setFilter({members:{$in:[client.userID]}})
    }
  }, [channelQuery,client.userID])

  return (
    <div className='w-full'>
      <div className='ring-2 ring-slate-200 w-full relative'>
        <ChannelSearch/>
        <div className='w-full'>
        <ChannelList
          filters={channelQuery?filter:{members: { $in: [client.userID] }}}
          channelRenderFilterFn={customChannelMessagingFilter}
          List={(listProps)=>(
            <TeamChannelList 
              {...listProps} 
              type='messaging' 
            /> )}
          Preview={(previewProps)=>(
            <TeamChannelPreview 
              {...previewProps} 
              type='messaging' 
            />)}
          
        />
        </div>
      </div>
    </div>
  )
}

export default ChannelListContainer