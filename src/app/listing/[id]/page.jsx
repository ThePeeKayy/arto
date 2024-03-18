'use client'
import React, { useEffect, useState } from 'react'
import { CheckIcon } from '@heroicons/react/20/solid'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useStateContext } from '../../../../context/StateContext';
import Image from 'next/image'
import toast from 'react-hot-toast';


const ProductOverView = ({params}) => {
  const [index,setIndex] = useState(0)
  const [product,setProduct] = useState([])
  const [author,setAuthor] = useState([])
  const {data:session} = useSession()
  const {setShowCart,onAdd} = useStateContext()
  const router = useRouter()

  const redirectToChat = () => {
    if (session?.user?.name !== product.author){
    localStorage.setItem('img',product.imgurls[0].slice(0,-1))
    localStorage.setItem('author',product.author)
    localStorage.setItem('title',product.title)}
    localStorage.setItem('id',params.id)
    sessionStorage.setItem('isCreating',true)
    router.push(`/chat/${session.user.id}`)
  }

  const redirectToOffer = () => {
    if (session?.user?.name !== product.author){
    localStorage.setItem('img',product.imgurls[0].slice(0,-1))
    localStorage.setItem('author',product.author)
    localStorage.setItem('title',product.title)}
    localStorage.setItem('id',params.id)
    localStorage.setItem('offering',true)
    sessionStorage.setItem('isCreating',true)
    router.push(`/chat/${session.user.id}`)
  }

  useEffect(() => {
    const fetchData = async ()=>{
      try {
        const response = await fetch(`/api/listing/${params.id}`)
        const result = await response.json()
        setProduct(result)
      } catch (error) {
        console.log(error)
        router.push('/404')
      }
    }
    const fetchAuthor = async ()=>{
      try {
        const response = await fetch(`/api/listing/${params.id}`,{
          method:'POST',
          body:JSON.stringify({
            name:product.author
        })})
        const result = await response.json()
        setAuthor(result)
      } catch(error) {
        console.log(error)
      }
    }
    if (!product.author) fetchData()
    if (product.author) fetchAuthor()
  }, [product.author, params.id, router])

  const handleAddCart =(e) => {
    e.preventDefault()
    setShowCart(true)
    onAdd({
      id: params.id,
      title: product.title,
      href: `/listing/${params.id}`,
      category: product.category,
      price: parseFloat(product.price),
      imageSrc: product.imgurls[0].slice(0,-1),
    },1)
  }

  const handleEdit=(e) => {
    e.preventDefault()
    try {
      router.push(`/edit-post/${params.id}`)
    } catch (error) {
     console.log(error) 
    }
  };

  const handleVisitProfile = (e) =>{
    e.preventDefault()
    try {
      router.push(`/profile/${author.id}`)
    } catch (error) {
     console.log(error) 
    }
  }

  return (
    <div className="min-h-[89vh] bg-white">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        {/* Product details */}
        <div className="lg:max-w-lg lg:self-end">
          
          <h5 className='font-medium text-gray-500 hover:text-gray-900'>{product.category}</h5>

          <div className="mt-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{product.title}</h1>
          </div>
          <div className='bg-slate-100 flex flex-row pt-8 px-4 my-4'>
            <Image onClick={handleVisitProfile} className='pb-8' src={author ? author.image: ''} width={65} height={65} alt='author img'/>
            <h4 className='font-bold pl-10 pt-5'>{product.author}</h4>
      </div>
          <section aria-labelledby="information-heading">
            
            <div className="flex items-center">
              <p className="text-lg text-gray-900 sm:text-xl font-bold">${product.price}</p>
            </div>

            <div className="mt-4 space-y-6">
              <p className="text-base text-gray-500">{product.description}</p>
            </div>

            <div className="mt-6 flex items-center">
              <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" aria-hidden="true" />
              <p className="ml-2 text-sm text-gray-500">Ready to ship</p>
            </div>
            <div className="mt-6 flex items-center">
              <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" aria-hidden="true" />
              <p className="ml-2 text-sm text-gray-500">{product.qtyavail} pieces in stock </p>
            </div>
          </section>
        </div>

        {/* Product image */}
        <div className="mt-10 lg:col-start-2 lg:row-span-2 relative lg:mt-0 lg:self-center">
          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg">
            {product.imgurls && <Image src={product.imgurls[index].slice(0,-1)} fill={true} alt={`${product.title} image`} className="h-full w-full object-cover object-center" />}
          </div>
          <div className='flex flex-row justify-start ml-3'>
          {product.imgurls && product.imgurls.map((imgUrl,i)=>(
              <div className={`mt-4 overflow-hidden h-[120px] w-[120px] relative flex m-3 border-pink-400 ${i === index && 'border-4' } rounded-md `} key={i} onClick={()=>setIndex(i)}>
              <Image src={imgUrl.slice(0,-1)} layout='fill' objectFit='cover' alt={`Image ${index}`} />
          </div>
              ))
            }
            </div>
        </div>
        
                            
        {/* Product form */}
        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
            <form>
              <div className="sm:flex sm:justify-between">
                
              </div>
              
              <div className="mt-10 space-y-4">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-[#FF9494] px-8 py-3 text-base font-medium text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                  onClick={session?.user?.name !== product.author ? handleAddCart : handleEdit}
                >
                  {session?.user?.name !== product.author?'Add to Cart':'Edit Listing'}
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-[#FF9494] px-8 py-3 text-base font-medium text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                  onClick={()=>{session? redirectToChat(): toast.error('Not Signed In')}}
                >
                  {session?.user?.name !== product.author ? 'Chat with Seller' : 'Go to your Chat Page'}
                </button>
                {session && session.user.name!== product.author && <button
                  type="button"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-[#FF9494] px-8 py-3 text-base font-medium text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                  onClick={()=>{session? redirectToOffer(): toast.error('Not Signed In')}}
                >
                  Make an Offer
                </button>}
              </div>
              <div className="mt-6 text-center">
                <a href="#" className="group inline-flex text-base font-medium">
                  <ShieldCheckIcon
                    className="mr-2 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  <span className="text-gray-500 hover:text-gray-700">Arto Buyer Protection</span>
                </a>
              </div>
            </form>
        </div>
        
      </div>
    </div>
  )
}

export default ProductOverView;