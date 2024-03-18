'use client'
import Image from "next/image";
import React from 'react';

import { useRouter } from "next/navigation";

const ProductCard = ({ products,handleEdit, handleDelete }) => {
  const router = useRouter()
  const handleRedirect = (productID) => {
    router.push(`/listing/${productID}`)
  }

  return (
    <div className=" rounded-xl w-[75vw]">
      <div className="mx-auto max-w-7xl overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 lg:gap-x-8">
          {products.map((product, i) => {
            const hexString = product.imgurls[0];
            return (
              <a key={i} className="group text-sm">
                <div onClick={()=>handleRedirect(product.productid)} className="aspect-h-1 aspect-w-1 w-[full] overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                  <Image
                    src={hexString.slice(0,-1)}
                    width={1200}
                    height={1200}
                    alt='Product Image'
                    className=" object-cover object-center"
                  />
                </div>
                <h3 className="mt-4 font-medium text-gray-900">{product.title}</h3>
                <p className="italic text-gray-500">{product.category}</p>
                <p className="mt-2 font-medium text-gray-900">${product.price}</p>
                {handleEdit && 
                <div className="flex flex-row justify-around py-4">
                  <button className='bg-white rounded-xl xl:px-9 px-6  py-1' onClick={()=>handleEdit(product.productid)}>Edit</button>
                  <button className='bg-red-300 rounded-xl xl:px-7 px-4  py-1' onClick={()=>handleDelete(product.productid)}>Delete</button>
                 </div>
                }
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
