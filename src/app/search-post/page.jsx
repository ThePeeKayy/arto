'use client'
import ProductCard from "../../../components/ProductCard";
import React, { useEffect, useState } from 'react'
import { useStateContext } from "../../../context/StateContext";
import { FaAngleLeft,FaAngleRight } from "react-icons/fa";
import Footer from "../../../components/Footer";
import toast from "react-hot-toast";

const SearchedProducts = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [products,setProducts] = useState([])
  const totalPages = Math.ceil(products.length / 16);
  const {query, category ,search,setSearch} = useStateContext() 
  const [isTransitioning, setIsTransitioning] = useState(0);

  const fetchData = async ()=>
    {const response = await fetch('/api/listing',{
      method:'POST',
      headers: {
        'Content-type':'application/json'
      },
      body:JSON.stringify({
        query:query,
        category:category,
      })
    })
    const result = await response.json()
    setProducts(result)}

  useEffect(() => {
    toast('Loading...',{
      duration:3000,
    })
    fetchData()
  }, [search, category])
  
  const handleNextPage = () => {
    setIsTransitioning(1);
    setTimeout(() => {
      setIsTransitioning(2);
      setCurrentPage(prevPage => prevPage + 1);
    }, 300); // Adjust the transition duration as needed (in milliseconds)    
    setTimeout(()=>{
      setIsTransitioning(0)
    },350)
  };

  const handlePrevPage = () => {
    setIsTransitioning(3);
    setTimeout(() => {
      setIsTransitioning(4);
      setCurrentPage(prevPage => prevPage - 1);
    }, 300); // Adjust the transition duration as needed (in milliseconds)    
    setTimeout(()=>{
      setIsTransitioning(0)
    },350)
  };

  return (
    <div className="min-h-[89vh] pb-8 mt-[50px]">
        
      <div className='relative'>
        
        <div className='relative flex justify-center items-center flex-col'>
          <div className='flex flex-row items-center'>
            <button className="hidden sm:block" disabled={currentPage === 0} onClick={!isTransitioning ? handlePrevPage:()=>{}}><FaAngleLeft size={40} className='rounded-full'/></button>

              <div style={{
                transform:(isTransitioning == 1 || isTransitioning ==4) ? 'translateX(-100%)' : (isTransitioning == 2 || isTransitioning ==3) ?'translateX(100%)':'translateX(0)',
                opacity: (isTransitioning) ? 0 : 1,
                transition: (isTransitioning == 2 || isTransitioning == 4)? 'transform 0.05s ease-out, opacity 0.05s ease-out':'transform 0.3s ease-out, opacity 0.3s ease-out',
              }}>
                <ProductCard products={ products.slice(currentPage * 16, (currentPage *16) + 16)} />
              </div>
              <button className="hidden sm:block" disabled={currentPage === totalPages - 1} onClick={!isTransitioning ? handleNextPage:()=>{}}><FaAngleRight size={40} className='rounded-full' /></button>
            </div>
            <div className=' flex items-center justify-center flex-row w-[30%] mt-5 bg-white gap-x-2 rounded-full sm:rounded-2xl'>
              <button className="sm:hidden block" disabled={currentPage === 0} onClick={!isTransitioning ? ()=>{
                window.scrollTo({top:0,behavior:'smooth'})
                handlePrevPage()
              }:()=>{}}>
                <FaAngleLeft size={40} className='rounded-full'/>
              </button>
              <span className=" font-bold gap-2 px-2 h-8 text-[20px]">{currentPage + 1}/{totalPages === 0 ? 1 : totalPages}</span>
              <button className="sm:hidden block" disabled={currentPage === totalPages - 1} onClick={!isTransitioning ? ()=>{
                window.scrollTo({top:0,behavior:'smooth'})
                handleNextPage()
              }:()=>{}}>
                <FaAngleRight size={40} className='rounded-full' />
              </button>

            </div>
          </div>
        </div>
      <Footer/>
    </div>
  );
}

export default SearchedProducts