'use client'

import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import logo from '../assets/logo.png'
import { useState,useEffect } from 'react';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'

import SelectMenu from './SelectMenu'
import { useStateContext } from '../context/StateContext'
import { IoMenu } from "react-icons/io5";
import { IoIosSearch,IoMdAddCircle } from "react-icons/io";
import { GoSortDesc } from "react-icons/go";
import { FaSignOutAlt } from "react-icons/fa";
import { CiChat1} from "react-icons/ci";
import { TiShoppingCart } from "react-icons/ti";
import { PiSignIn } from "react-icons/pi";

import { useRouter } from 'next/navigation'
import Cart from './Cart'
import toast from 'react-hot-toast'

const Nav = () => {
    const {data:session} = useSession();
    const [providers, setProviders] = useState(null);
    const [dropDown,setDropDown] =useState(false)
    const [menuOpen,setMenuOpen] =useState(false)
    const {category, setCategory,query, setQuery,showCart,setShowCart, guestSession, handleGuestMode, search, setSearch} = useStateContext()
    const router = useRouter()
    useEffect(()=>{
        const setUpProviders = async () => {
            const response = await getProviders();
            setProviders(response)
        };

        setUpProviders();
    },[])

    const handleSignOut = async () => {
        await signOut({ redirect: false }); 
        router.push('/');
      };

    const handleEnter = (event) =>{
        if (event.key === 'Enter') {
            setSearch(true)
            if (window.location.pathname !== '/search-post'){
                event.preventDefault();
                router.push('/search-post')}
        }
    }
    
    
    return (
        <>
        {showCart && <Cart />}
        <nav className='flex sm:justify-between justify-around h-auto pb-2 sm:mr-0 mr-[70px] sm:w-full w-[75%] relative' >
            <div className='flex gap-2 ml-6 mr-[70px] flex-center flex-row items-center'>
                <Link href='/' className='flex flex-row absolute top-[-10px] left-4'>
                    <Image src={logo} width={35} height='auto' alt='logo' style={{objectFit: "contain"}}/>
                    <p className='text-[75px] font-grunge'><span className='text-transparent md:text-black'>rto</span></p>
                </Link>
            </div>
            <div className='w-[40%] min-w-[285px] ml-[90px] md:ml-[70px]'>
        
                <div className="mt-3 flex rounded- shadow- w-[85%] sm:w-full  h-[70px] relative">
                    <div className="relative flex flex-grow-[5] items-stretch focus-within:z-10">
                        
                        <input
                            type="text"
                            value = {query}
                            id='searchInput'
                            className="block w-full rounded-none rounded-l-[57px] py-1.5 pl-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="Search for products..."
                            onChange={(e)=>setQuery(e.target.value)}
                            onKeyDown={handleEnter}
                        />
                    </div>
                    <button
                        type="button"
                        className="relative -ml-px inline-flex items-center gap-x-1 rounded-r-[57px] px-3 py-5 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 bg-white"
                        onClick={()=>{
                            setDropDown((prevState)=>!prevState)
                            setCategory('Painting')
                            if (category && dropDown) {setCategory('')}
                        }}
                    >
                        <GoSortDesc className="-ml-0.5 h-5 w-5 text-gray-400" aria-hidden="true"/>
                        {category?<span>{category}</span>:<span>Sort</span>}
                        
                    </button>
                    <button>
                        <Link onClick={()=>setSearch(true)} href='/search-post'>
                            <div className="sm:flex hidden items-center px-6 rounded-[57px] py-6 ml-3 ring-1 ring-inset ring-gray-300 bg-white">
                                <IoIosSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </div>
                        </Link>
                    </button>
                </div>

                {dropDown && <div className='p-5 z-10'>
                    <SelectMenu setCategory={setCategory} />
                </div>}
                
            </div>
            <div className='w-[30%] mr-0 lg:mr-[79px]'>
                {(session?.user || guestSession) ? (
                <>
                <div className='lg:flex gap-1 md:gap-2 mt-3 mr-8 hidden'>
                    <Link className='bg-white ring-1 ring-inset ring-gray-300 text-gray-600 font-bold h-[70px] w-[70px] rounded-[70px] p-6 flex-0.5 flex justify-center flex-row flex-nowrap' href={session?`/chat/${session.user.id}`:'/chat/0c62a4358e1b4c969ffe2d041646f78a'}><CiChat1 className='pb-[6px]' size={30} /></Link>
                    <Link onClick={guestSession ? ()=>toast.error('Only available with real account'):()=>{}} className='bg-white ring-1 ring-inset ring-gray-300 text-gray-600 font-bold h-[70px] w-[70px] rounded-[70px] p-6 flex-0.5 flex justify-center flex-row' href={session?"/create-post":'/'} ><IoMdAddCircle className='pb-[6px]' size={30}/></Link>
                    <div onClick={()=>setShowCart(true)} className='bg-white ring-1 ring-inset ring-gray-300 text-gray-600 font-bold h-[70px] w-[70px] rounded-[70px] p-6 flex-0.5 flex justify-center flex-row flex-nowrap'><TiShoppingCart size={30}/></div>
                    <button 
                        className='bg-white ring-1 ring-inset ring-gray-300 text-gray-600 font-bold h-[70px] min-w-[70px] w-[105%] rounded-[70px]  flex flex-0.5 flex-row flex-nowrap justify-center gap-1' 
                        onClick={guestSession?handleGuestMode:handleSignOut}
                    ><span className='pt-6 2xl:block hidden'>Signout</span><FaSignOutAlt className='mt-7'/></button>
                    <Link href={session?`/profile/${session.user.id}`:'/profile/0c62a4358e1b4c969ffe2d041646f78a'}>
                    <div style={{width: 68, height: 68, position: 'relative', overflow: 'hidden', borderRadius: '50%' }}>
                            <Image
                                src={session ? session?.user.image : guestSession.image}
                                fill={true}
                                sizes="68px,68px,68px"
                                alt='profile pic'
                            />
                        </div>
                    </Link>
                </div>
                <div className='flex gap-1 md:gap-2 mt-3 sm:pr-2 pr-[54px] lg:hidden justify-end '>
                    <button onClick={()=>setMenuOpen(true)} className='sm:mr-0 mr-8 bg-white ring-1 ring-inset ring-gray-300 text-gray-600 font-bold h-[70px] w-[70px] rounded-[70px] p-6 flex-0.5 flex justify-center flex-row flex-nowrap'><IoMenu size={30}/></button>
                    {menuOpen && <div className="fixed z-20 inset-0 overflow-y-auto flex items-start justify-end m-6">
                        <div className="fixed inset-0 bg-black opacity-25" onClick={()=>setMenuOpen(false)}/>
                           <div className="bg-white flex flex-col gap-y-2 opacity-full p-6 rounded-lg w-[300px] h-[430px] shadow-lg z-10">
                                <div className="flex items-center">
                                    <Link className='w-[70px]'href={session?`/profile/${session.user.id}`:'/profile/0c62a4358e1b4c969ffe2d041646f78a'}>
                                        <div style={{width: 68, height: 68, position: 'relative', overflow: 'hidden', borderRadius: '50%' }}>
                                            <Image
                                                src={session ? session?.user.image : guestSession.image}
                                                fill={true}
                                                sizes="68px,68px,68px"
                                                alt='profile pic'
                                            />
                                        </div>
                                    </Link>
                                    <span onClick={()=>router.push(session?`/profile/${session.user.id}`:'/profile/0c62a4358e1b4c969ffe2d041646f78a')} className="font-bold ml-2">Profile</span>
                                </div>
                                <div className="flex items-center">
                                    <Link className='bg-white ring-1 ring-inset ring-gray-300 text-gray-600 font-bold h-[70px] w-[70px] rounded-[70px] p-6 flex-0.5 flex justify-center flex-row flex-nowrap' href={session?`/chat/${session.user.id}`:'/chat/0c62a4358e1b4c969ffe2d041646f78a'}>
                                        <CiChat1 className='pb-[6px]' size={30} />
                                    </Link>
                                    <span onClick={()=>router.push(session?`/chat/${session.user.id}`:'/chat/0c62a4358e1b4c969ffe2d041646f78a')} className="font-bold ml-2">Chat</span>
                                </div>
                                <div className="flex items-center">
                                    <Link onClick={guestSession ? ()=>toast.error('Only available with real account'):()=>{}} className='bg-white ring-1 ring-inset ring-gray-300 text-gray-600 font-bold h-[70px] w-[70px] rounded-[70px] p-6 flex-0.5 flex justify-center flex-row' href={session?"/create-post":'/'}>
                                        <IoMdAddCircle className='pb-[6px]' size={30}/>
                                    </Link>
                                    <span onClick={()=>{session && router.push('/create-post')}} className="font-bold ml-2">Create Post</span>
                                </div>
                                <div className="flex items-center">
                                    <div onClick={()=>setShowCart(true)} className='bg-white ring-1 ring-inset ring-gray-300 text-gray-600 font-bold h-[70px] w-[70px] rounded-[70px] p-6 flex-0.5 flex justify-center flex-row flex-nowrap'>
                                        <TiShoppingCart size={30}/>
                                    </div>
                                    <span onClick={()=>setShowCart(true)} className="font-bold ml-2">Shopping Cart</span>
                                </div>
                                <div className="flex items-center">
                                    <button 
                                        className='bg-white ring-1 ring-inset ring-gray-300 text-gray-600 font-bold h-[70px] w-[70px] rounded-[70px] p-7 flex-0.5 flex justify-center flex-row flex-nowrap' 
                                        onClick={guestSession?handleGuestMode:handleSignOut}
                                    >
                                        <FaSignOutAlt/>
                                    </button>
                                    <span onClick={guestSession?handleGuestMode:handleSignOut} className="font-bold ml-2">Logout</span>
                                </div>
                            </div>
                    </div>}
                </div>
                </>
                ):(
                    <div className='mt-3 sm:pr-2 pr-[54px] flex flex-row gap-2'>
                        <button onClick={()=>setMenuOpen(true)} className='sm:mr-0 mr-8 lg:hidden bg-white ring-1 ring-inset ring-gray-300 text-gray-600 font-bold h-[70px] w-[70px] rounded-[70px] p-6 flex-0.5 flex justify-center flex-row flex-nowrap'><IoMenu size={30}/></button>
                        {menuOpen && <div className="fixed z-20 inset-0 overflow-y-auto flex items-start justify-end m-6">
                            <div className="fixed inset-0 bg-black opacity-25" onClick={()=>setMenuOpen(false)}/>
                            <div className="bg-white flex flex-col gap-y-2 opacity-full p-6 rounded-lg w-[300px] h-[190px] shadow-lg z-10">
                                <div className="flex items-center">
                                    {providers && Object.values(providers).map((provider) => (<div key={provider.name} className='flex items-center flex-row' onClick={()=>signIn(provider.id)}><button
                                            type='button'
                                            onClick={()=>signIn(provider.id)}
                                            className='bg-white ring-1 ring-inset ring-gray-300 text-gray-600 font-bold h-[70px] w-[70px] rounded-[70px] p-6 flex-0.5 flex justify-center flex-row flex-nowrap'
                                            ><PiSignIn size={30} />
                                        </button>
                                        <span onClick={()=>signIn(providers[0].id)} className="font-bold ml-2">Sign In</span>
                                        </div>))}
                                        
                                    </div>
                                    <div className="flex items-center">
                                        <div onClick={()=>setShowCart(true)} className='bg-white ring-1 ring-inset ring-gray-300 text-gray-600 font-bold h-[70px] w-[70px] rounded-[70px] p-6 flex-0.5 flex justify-center flex-row flex-nowrap'>
                                            <TiShoppingCart size={30}/>
                                        </div>
                                        <span onClick={()=>setShowCart(true)} className="font-bold ml-2">Shopping Cart</span>
                                    </div>
                                    
                                </div>
                        </div>}
                        <div className='hidden lg:flex flex-row gap-x-3'>
                        {providers && Object.values(providers).map((provider) => (<button
                            type='button'
                            key={provider.name}
                            onClick={()=>signIn(provider.id)}
                            className='bg-white ring-1 ring-inset ring-gray-300 text-gray-600 font-bold h-[70px] w-[160px] rounded-[57px] pb-1'
                            ><span className='text-sm'>Sign In</span>
                            </button>))}
                        <div onClick={()=>setShowCart(true)} className='bg-white ring-1 ring-inset ring-gray-300 text-gray-600 font-bold h-[70px] w-[70px] rounded-[70px] p-6 flex-0.5 flex justify-center flex-row flex-nowrap'><TiShoppingCart size={30}/></div>
                        </div>
                    </div>
                )}
            </div>
            
        </nav>
        </>
  )
}

export default Nav