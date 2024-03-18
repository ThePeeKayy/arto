'use client'
import React, { useRef } from 'react';
import {
  Attachment,
  Avatar,
  messageHasReactions,
  MessageOptions,
  MessageRepliesCountButton,
  MessageText,
  MessageTimestamp,
  ReactionSelector,
  SimpleReactionsList,
  useChatContext,
  useMessageContext,
} from 'stream-chat-react';

import './CustomMessage.scss';
import { useSession } from 'next-auth/react';
import { useStateContext } from '../../context/StateContext';
export const CustomMessage = () => {
  const {
    isReactionEnabled,
    message,
    reactionSelectorRef,
    showDetailedReactions,
  } = useMessageContext();
  const {data:session} = useSession()
  const messageWrapperRef = useRef(null);
  const {setOffer, setAcceptedOffer,guestSession} = useStateContext()
  const canReact = isReactionEnabled;
  const hasReactions = messageHasReactions(message);
  const hasAttachments = message.attachments && message.attachments.length > 0;
  const {client} = useChatContext()

  return (
    <div className='message-wrapper'>
      {message.user?.name !== session?.user?.name && message.user.name !== guestSession.name  && <Avatar image={message.user?.image} />}
      <div className={(message.user?.name == session?.user?.name || message?.user?.name == 'Pk ProjectAccount1') ?`message-wrapper-own`:`message-wrapper-content`}>
      <MessageOptions messageWrapperRef={messageWrapperRef} />
        {message.customType == 'offer' && <div className='rounded-[16px] overflow-hidden bg-pink-100 p-4'>
          <div className='bg-slate-100 rounded-3xl overflow-hidden'>
          <MessageText/>
          </div>
          {message.user.id !== session?.user?.id &&<button 
            onClick={()=>
              {setOffer({
                offer:message.value,
                channelid:message.cid
              })
              const {delete_at, ...messageWithoutDeletedAt} = message
              if (message.customType === 'offer') {
                client.updateMessage({ ...messageWithoutDeletedAt,customType: null })
              }
              setAcceptedOffer(message.value)
            }
          }
            className='w-full font-bold pt-4'>
              <span className=' bg-white rounded-xl hover:bg-pink-400 hover:text-white p-2'>Accept Offer</span>
          </button>}
        </div>}
        {message.customType == 'accept' && 
          <div className='rounded-[16px] ring-1 ring-gray-200 bg-pink-50 p-6'>
            <div className='rounded-2xl overflow-hidden'>
              <MessageText />
            </div>
          </div>
        }
        {!message.customType && 
          <div className='rounded-[16px] overflow-hidden'><MessageText /></div>
        }
        {hasAttachments && <Attachment attachments={message.attachments} />}
        <div className='message-header'>
          <div className='message-header-timestamp'>
            <MessageTimestamp />
          </div>
        </div>
        {showDetailedReactions && canReact && (
          <ReactionSelector ref={reactionSelectorRef} />
        )}
        {hasReactions && <SimpleReactionsList />}
        <MessageRepliesCountButton reply_count={message.reply_count} />
      </div>
    </div>
  );
};