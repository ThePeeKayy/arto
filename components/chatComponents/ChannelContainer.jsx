import React, { useEffect,useState } from 'react';
import { Channel,  useChatContext } from 'stream-chat-react';
import ChannelInner from './ChannelInner';
import { useSession } from 'next-auth/react';
import { CustomMessage } from './CustomMessage';
import { useStateContext } from '../../context/StateContext';

const ChannelContainer = () => {
  const [channelHasOffer, setChannelHasOffer] = useState(false)
  const { setActiveChannel, client } = useChatContext();
  const { data: session } = useSession();
  const {isPreviewing,modal,setModal,guestSession} = useStateContext()

  const handleProduct = async (file) => {
    await client.connectUser({ id: session.user.id }, session.token.token);
    const result = await client.queryUsers({ name: author });
    const authorID = result.users[0].id;
    const filters = {
      member_count: 1,
      members: { $eq: [session ? session.user.id:guestSession.id, authorID] },
      title: title
    };
    const [existingChannel] = await client.queryChannels(filters);
    if (existingChannel) {
      if(existingChannel.data.offer) setChannelHasOffer(true)
      return setActiveChannel(existingChannel);
    } else{
      
      const newChannel = client.channel('messaging', title.replace(/\s/g, '') + session.user.id, {
        members: [session.user.id],
      });
      setActiveChannel(newChannel);
      newChannel.watch()
      const response = await newChannel.sendImage(file);
      const imageUrl = response.file;
      await newChannel.update({ image: imageUrl,title: title,
        author: author,productid:id})
      await newChannel.addMembers([{user_id:authorID, channel_role:"channel_moderator"}]);



    }
  };
  let id
  let img;
  let author;
  let title;
  let offering
  if (typeof window !== 'undefined') {
    img = localStorage.getItem('img');
    author = localStorage.getItem('author');
    title = localStorage.getItem('title');
    id = localStorage.getItem('id');
    offering = localStorage.getItem('offering')
  }
  

  function base64ToBlob(base64String) {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'image/jpeg' });
  }

  useEffect(() => {
    if (title) {
    const prefix = 'data:image/jpeg;base64,';
    const trimmedBase64String = img?.slice(prefix.length);
    const paddingLength = trimmedBase64String?.length % 4;
    const paddedBase64String = paddingLength === 0 ? trimmedBase64String : trimmedBase64String + '='.repeat(4 - paddingLength);
    const blob = base64ToBlob(paddedBase64String);
    const file = new File([blob], `${title}.jpg`, { type: 'image/jpeg' });
      handleProduct(file);
      localStorage.removeItem('img')
      localStorage.removeItem('author')
      localStorage.removeItem('title')
      if (!channelHasOffer && offering) setModal(true)
      localStorage.removeItem('offering')
      setChannelHasOffer(false)
    }
  }, [title]);

  

  return (
    <div className={isPreviewing ? 'sm:block hidden':''}>
      <Channel
        Message={(messageProps, i) => <CustomMessage key={i} {...messageProps} />}
      >
        <ChannelInner />
      </Channel>
    </div>
  );
};

export default ChannelContainer;
