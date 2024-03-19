'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { MdCancel } from "react-icons/md";

const ImageShow = ({imgUrls,setImgUrls, currentImages}) => {
    const [currentId, setCurrentId] = useState(0)
    const [loaded,setLoaded] = useState(false)
    function unpadBase64(paddedBase64String) {
      const lastNonPaddingCharIndex = paddedBase64String.indexOf('=') === -1 ? 
        paddedBase64String.length : 
        paddedBase64String.indexOf('=');
      const originalBase64String = paddedBase64String.slice(0, lastNonPaddingCharIndex);
      
      return originalBase64String;
    }
    useEffect(() => {
      if (currentImages.length && !loaded) {
        currentImages.forEach(imageString => {
        const unpadded = unpadBase64(imageString)
        setImgUrls(prevState => [...prevState,unpadded])
        setLoaded(true)
      })}
    }, [currentImages,loaded, setImgUrls])
    
    const handleClick =(index)=>{
        setCurrentId(index)
    }

    const handleDelete =(chosenurl)=>{
      setImgUrls((prevState)=>prevState.filter((url)=>url !== chosenurl))
    }

  return (
    <div className='flex flex-col gap-5'>
    <div className='flex items-center flex-col bg-white rounded-xl shadow-md p-7 sm:min-w-[390px] min-h-[380px] h-[45vw] gap-2'>
        <p className='pb-5'>Images</p>
        <div className= {`sm:w-[33vw] h-[33vw]  sm:min-w-[240px] min-h-[240px] relative rounded-lg bg-yellow-50 flex justify-center items-center`}>
            
            {imgUrls.length > currentId ? <Image src={imgUrls[currentId]} alt='Image' fill={true} objectFit='cover'/>:<></>}
        </div>
    </div>
    <div className='flex flex-row items-center gap-5 bg-white rounded-xl shadow-md p-5 sm:min-w-[390px] h-[120px]'>
    <p className='font-bold'>All Images:</p>
      
      {imgUrls.length ? imgUrls.map((imgUrl,index)=>(
              <div className='mt-15 overflow-hidden h-[100px] w-[100px] relative flex' key={index} onClick={()=>handleClick(index)}>
              <Image src={imgUrl} fill={true} objectFit='cover' alt={`Image ${index}`} />
              <MdCancel className='absolute right-1 top-1 z-10 h-5 w-5 bg-red-500 rounded-full' onClick={()=>handleDelete(imgUrl)} />
          </div>
              ))
        :<></> 
      }
  </div>
  </div>
  )
}

export default ImageShow