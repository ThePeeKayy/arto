'use client'

import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard';
import { FaAngleLeft,FaAngleRight } from "react-icons/fa";

const PopularProducts = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [products,setProducts] = useState([])
  const [isTransitioning, setIsTransitioning] = useState(0);
  const totalPages = Math.ceil(products.length / 8);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/listing',{
        method:'POST',
        headers: {
          'Content-type':'application/json'
        },
        body:JSON.stringify({
          query:'',
          category:'',
        })
      })
      const result = await response.json();
      setProducts(result);
    };
    fetchData();
  }, [currentPage])

  const handleNextPage = () => {
    setIsTransitioning(1);
    setTimeout(() => {
      setIsTransitioning(2);
      setCurrentPage(prevPage => prevPage + 1);
    }, 300); 
    setTimeout(()=>{
      setIsTransitioning(0)
    },350)
  };

  const handlePrevPage = () => {
    setIsTransitioning(3);
    setTimeout(() => {
      setIsTransitioning(4);
      setCurrentPage(prevPage => prevPage - 1);
    }, 300);    
    setTimeout(()=>{
      setIsTransitioning(0)
    },350)
  };

  

  return (
    <div className="mt-10">
      <div className='relative'>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Featured Products</h2>
          </div>
        </div>
        
        <div className='relative flex justify-center items-center flex-col overflow-hidden'>
          <div className='xl:h-[54vw] md:h-[70vw] h-[220vw] flex flex-row'>
          <button disabled={currentPage === 0} onClick={!isTransitioning ? handlePrevPage:()=>{}}><FaAngleLeft size={40} className='rounded-full'/></button>

            <div style={{
              transform:(isTransitioning == 1 || isTransitioning ==4) ? 'translateX(-100%)' : (isTransitioning == 2 || isTransitioning ==3) ?'translateX(100%)':'translateX(0)',
              opacity: (isTransitioning==1 || isTransitioning==3) ? 0 : 1,
              transition: (isTransitioning == 2 || isTransitioning == 4)? 'transform 0.05s ease-out, opacity 0.05s ease-out':'transform 0.3s ease-out, opacity 0.3s ease-out',
            }}>
              <ProductCard products={(isTransitioning == 2 || isTransitioning == 4) ? [] : products.slice(currentPage * 8, (currentPage * 8) + 8)} />
            </div>
            <button disabled={currentPage === totalPages - 1} onClick={!isTransitioning ? handleNextPage:()=>{}}><FaAngleRight size={40} className='rounded-full' /></button>

          </div>
          <div className='flex items-center justify-center flex-row w-[30%] mt-16 '>
            <span className=" font-bold gap-2 px-12 h-8 text-[20px]">{currentPage + 1}/{totalPages === 0 ? 1 : totalPages}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopularProducts;
