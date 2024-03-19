'use client'
import React from 'react';
import { useStateContext } from "../../context/StateContext"

const TeamChannelList = ({children, loading}) => {
  const {isPreviewing} = useStateContext()
  if (loading) {
    return (
      <div className=" bg-white h-[89vh] sm:w-[24vw] w-[100vw] mt-[9vh]">
          <div>
            <p className="px-5 py-3 text-[23px] font-bold text-white">
              loading...
            </p>
          </div>
          
      </div>
    )
  }

  return (
    <div className={`bg-white h-[89vh] sm:w-[24vw] ${isPreviewing?'w-[100vw]':'sm:block hidden'} pt-[9vh]`}>
        <div>
          <p className="px-5 py-3 text-[23px] font-bold text-black">
            My Chats
          </p>
        </div>
        {children}
    </div>
  )
}

export default TeamChannelList