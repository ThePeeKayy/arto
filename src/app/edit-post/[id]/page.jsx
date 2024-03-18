'use client'
import React, { useEffect, useState } from 'react'
import Form from '../../../../components/Form'
import Underline from '../../../../assets/underline.png'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
const EditPage = ({params}) => {
  const router = useRouter();
  const {data:session} = useSession();
  const [imgUrls, setImgUrls] = useState([])
  const [listing,setListing] = useState({
      title:'',
      description:'',
      price:'',
      category:'Drawing',
      author:'',
      imgUrls:[],
      qtyavail:''
  })

  useEffect(()=>{
  const fetchListing = async () => {
    const response = await fetch(`/api/listing/${params.id}`);
    const data = await response.json();
      setListing({
        title:data.title,
        description:data.description,
        price:data.price,
        category:data.category,
        imgUrls:data.imgurls,
        author:data.author,
        qtyavail:data.qtyavail
    })
  };
      if (params.id && !listing.title)fetchListing()
  },[]);

  const editListing = async (event) => {
    event.preventDefault();
    try {
      
      const response = await fetch(`/api/listing/${params.id}`,{
        method:'PATCH',
        body:JSON.stringify({
            title:listing.title,
            description:listing.description,
            price:listing.price,
            category:listing.category,
            imgUrls:imgUrls,
            qtyavail:listing.qtyavail,
            username:session?.user.name,
        })
      });
  
      if(response.ok) {
        router.push(`/profile/${session.user.id}`);
        toast.success('post edited')
      }
  } catch (error) {
    console.log(error);
  } finally {
  }

  };
  return (
    <div className='flex justify-center flex-col'>
      <h1 className='form-title ml-7'>Edit Listing</h1>
        <Image src={Underline} className='h-[25px] mt-[-8px] ml-6' width={230} alt='underline' />
        <div className='p-3 mx-4 mt-5 border-[4px] border-white rounded-3xl mb-8'>
        <Form 
          type='Edit' 
          listing={listing} 
          setListing={setListing} 
          handleSubmit={editListing}
          imgUrls={imgUrls}
          setImgUrls={setImgUrls}
        />
      </div>
      
    </div>
  )
}

export default EditPage