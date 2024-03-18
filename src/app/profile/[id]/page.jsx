'use client'
import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

import ProductCard from "../../../../components/ProductCard"
import { FaAngleLeft,FaAngleRight } from "react-icons/fa";
import Footer from "../../../../components/Footer";
import profileBanner from '../../../../assets/defaultprofile.jpg'
import Image from "next/image"
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Page = ({params}) => {
    const {data:session} = useSession()
    const router = useRouter()
    const [userProducts, setUserProducts] = useState([])
    const [userData, setUserData] = useState(0)
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = Math.ceil(userProducts.length / 10);
    useEffect(() => {
        const fetchUserDetails = async ()=> 
        {
          const response = await fetch(`/api/profile/${params.id}`)
          const result = await response.json()
          setUserData(result)
        }

        const fetchData = async ()=>
        {
          const response = await fetch('/api/listing',{
          method:'POST',
          headers: {
            'Content-type':'application/json'
          },
          body:JSON.stringify({
            query:userData.username
          })
        })
        const result = await response.json()
        setUserProducts(result)
        }
        if (!userData) fetchUserDetails()
        if (userData) fetchData()
        
      }, [userData,params.id])

    const deleteFunction = async(id) =>{
      await fetch(`/api/listing/${id}`,{method:'DELETE'});
      const filteredProducts = userProducts.filter((product)=>product.productid !== id)
      setUserProducts(filteredProducts)
    }
    
    const handleDelete = (id)=> {
      toast((t) => (
        <span className="p-4 flex flex-col px-16">
          Are you sure you want to delete listing?
          <div className="flex flex-row justify-around mt-4">
          <button className='bg-pink-300 rounded-lg px-4 py-2 mx-2 font-[6px] ring-1 ring-slate-200' onClick={() => {
            toast.dismiss(t.id)
            deleteFunction(id)
          }}>
            Yes
          </button>
          <button className='bg-white rounded-lg px-4 py-2 mx-2 font-[6px] ring-1 ring-slate-200' onClick={() => {
            toast.dismiss(t.id)
          }}>
            No
          </button>
          </div>
        </span>
      ));
    };

    const handleEdit=(id) => {
      router.push(`/edit-post/${id}`)
  };

    return (
    <div className="min-h-[89vh] pb-8">
      <div>
        <div className='relative gap-y-8 flex justify-center items-center flex-col'>
          <div className="bg-black h-[250px] w-[100vw] object-cover relative">
            <Image src={profileBanner} alt='banner' fill={true} />
            <div className="z-10 absolute bottom-[-7%] left-[10%] rounded-full border-8 border-orange-100 overflow-hidden">
              <Image 
                src={userData?.image ?? '/_next/static/media/defaultprofile.3ae8e5ce.jpg'} 
                alt='prof pic' 
                width={120} 
                height={120} 
                className="rounded-full" 
              /> 
              
            </div>
            <h1 className="absolute z-10 text-black bottom-8 ml-[170px] left-[10%] text-4xl font-bold">{userData.username == 'Pk ProjectAccount1'?'Guest Account': userData.username}</h1>
            
          </div>
          <div>
            <ProductCard products={userProducts} handleEdit={params.id == session?.user?.id && handleEdit} handleDelete={params.id == session?.user?.id && handleDelete} />
          </div>
          <div className='flex items-center justify-center flex-row w-[30%] mt-5 rounded-[10px] sm:rounded-2xl'>
            <button disabled={currentPage === 0} onClick={()=>{setCurrentPage(prevPage=>prevPage-1)}}><FaAngleLeft size={30}/></button>
            <span className=" font-bold gap-2 px-12 h-8 text-[20px]">{currentPage + 1}/{totalPages == 0? 1 :totalPages}</span>
            <button disabled={currentPage === totalPages - 1} onClick={()=>{setCurrentPage(prevPage=>prevPage+1)}}><FaAngleRight size={30}  /></button>
          </div>
        </div>
      </div>
      
    <Footer/>

    </div>
    )
}

export default Page