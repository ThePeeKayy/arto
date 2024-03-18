'use client'
import  {useState } from 'react'
import Form from '../../../components/Form'
import Underline from '../../../assets/underline.png'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const CreatePage = () => {
    const router = useRouter();
    const {data:session} = useSession();
    const [submitting,setSubmitting] = useState(false);
    const [imgUrls, setImgUrls] = useState([])
    const [listing,setListing] = useState({
        title:'',
        description:'',
        price:'',
        category:'Drawing',
        imgUrls:[],
        qtyavail:'',
    })


  const createListing = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    
    try {
      
      const response = await fetch('/api/listing/new',{
        method:'POST',
        body:JSON.stringify({
            title:listing.title,
            description:listing.description,
            price:listing.price,
            category:listing.category,
            imgUrls:imgUrls,
            username:session?.user.name,
            qtyavail:listing.qtyavail
        })
      });
  
      if(response.ok) {
        toast.success('Post Created')
        router.push(`/`);
      }
  } catch (error) {
    console.log(error);
  } finally {
    setSubmitting(false);
}

};
  return (
    <div className='flex justify-center flex-col'>
      <h1 className='form-title ml-7'>Create Listing</h1>
        <Image src={Underline} className='h-[25px] mt-[-8px] ml-6' width={230} alt='underline' />
        <div className='p-3 mx-4 mt-5 border-[4px] border-white rounded-3xl mb-8'>
        <Form 
          type='Create' 
          listing={listing} 
          setListing={setListing} 
          handleSubmit={createListing}
          imgUrls={imgUrls}
          setImgUrls={setImgUrls}
        />
      </div>
      
    </div>
  )
}

export default CreatePage