'use client'

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useChannelActionContext, useChannelStateContext, useChatContext } from 'stream-chat-react';
const Modal = ({ setModal }) => {
    const [offer, setOffer] = useState(0)
    const { channel } = useChannelStateContext();
    const { sendMessage } = useChannelActionContext()
    const {client} = useChatContext()

    const handleConfirm = async () => {
      const messages = channel.state.messages;
      
      for (const message of messages) {
        const {delete_at, ...messageWithoutDeletedAt} = message
          if (message.customType === 'offer') {
           client.updateMessage({ ...messageWithoutDeletedAt,customType: null })
        }
      }

      await channel.sendMessage({
          text: `Offered amount: $${offer}`,
          customType:'offer',
          value:offer
      })
        setModal(false)
    }
  return (
    <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-6 rounded-lg w-[60vw] max-w-[700px] h-[25vh] shadow-lg z-10">
        <h2 className="text-xl font-bold mb-4">Enter Offer Amount</h2>
        <input
            required
            type="number"
            name="price"
            id="price"
            className="w-full border rounded-md p-2 mb-4"
            placeholder='Offer amount...'
            onChange={(event)=>{
                if(event.target.value < 0){
                    toast.error('No negative numbers')
                    event.target.value=0
                }
                setOffer(()=>event.target.value)
            }}
            onKeyDown={(event) => {
            const input = event.target.value;
            const decimalIndex = input.indexOf('.');
                                        
            if (decimalIndex !== -1 && input.length - decimalIndex > 2 && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(event.key) || (input.length > 7 && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(event.key))) {
                event.preventDefault();
            }
            }}
            />        
        {/* Buttons */}
        <div className="flex justify-end gap-x-4">
          <button className="inline-flex w-full justify-center rounded-md bg-pink-100 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2" onClick={() => {
            handleConfirm()
        }}>Confirm</button>
          <button className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0" onClick={() => setModal(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
