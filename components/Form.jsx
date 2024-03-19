'use client'
import React from 'react';

import { IoMdPhotos } from "react-icons/io";
import ImageShow from './ImageShow';
import SelectMenu from './SelectMenu';
import toast from "react-hot-toast";
const Form = ({type, listing,setListing,imgUrls,setImgUrls,handleSubmit}) => {
    const handleDragOver = (event) => {
        event.preventDefault();
      };

    const handleFileUpload = (event) => {
    const files = event.target.files;
    if (imgUrls.length > 3) {
        toast.error("You can upload up to 4 photos.");
        event.target.value = null;
    } else {
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                const imageUrl = reader.result;
                cropImage(imageUrl, (croppedImageUrl) => {
                    setImgUrls(prevState => [...prevState, croppedImageUrl]);
                });
            };
            reader.readAsDataURL(file);
        });
    }
};

const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (imgUrls.length > 3) {
        toast.error("You can upload up to 4 photos.");
        event.target.value = null;
    } else {
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                const imageUrl = reader.result;
                cropImage(imageUrl, (croppedImageUrl) => {
                    setImgUrls(prevState => [...prevState, croppedImageUrl]);
                });
            };
            reader.readAsDataURL(file);
        });
    }
};

const handleError = (e) => {
    toast.error('No images')
}

const cropImage = (imageUrl, callback) => {
    const image = new Image();
    image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxSize = 1200;
        let width = image.width;
        let height = image.height;
        if (width > maxSize || height > maxSize) {
            if (width > height) {
                height *= maxSize / width;
                width = maxSize;
            } else {
                width *= maxSize / height;
                height = maxSize;
            }
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(image, 0, 0, width, height);
        const croppedImageUrl = canvas.toDataURL('image/jpeg'); // You can change the format if needed
        callback(croppedImageUrl);
    };
    image.src = imageUrl;
};

    
    return (
        <form onSubmit={imgUrls.length ? handleSubmit : handleError}>
        <div className="space-y-3">
            <div className="relative border-b border-gray-900/10 pb-12 flex md:flex-row flex-col p-8 justify-between gap-8 md:gap-4">
                <div className="mt-3 min-w-[30vw] space-y-3 flex justify-between flex-col">
                    <div className=" bg-white rounded-xl shadow-md p-7 h-[140px]">
                        <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                            Listing Title
                        </label>
                        <div className="mt-2">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300  sm:max-w-full">    
                                <input
                                    required
                                    type="text"
                                    name="title"
                                    value={listing.title}
                                    maxLength={70}
                                    id="title"
                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 "
                                    placeholder="(Up to 70 chars)"
                                    onChange={(event)=>setListing({...listing, title:event.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className=" bg-white rounded-xl shadow-md p-7 h-[25vw] xl:h-[31vw]">
                        <label htmlFor="desc" className="block text-sm font-medium leading-6 text-gray-900">
                            Description
                        </label>
                        <div className="mt-2">
                            <div className="flex h-[10vw] md:h-[17vw] xl:h-[23vw] pb-[10%] md:pb-[50%] xl:pb-[70%] rounded-md shadow-sm ring-1 ring-inset ring-gray-300  sm:max-w-full ">    
                                <input
                                    required
                                    type="text"
                                    name="desc"
                                    value={listing.description}
                                    id="title"
                                    className="align-top h-[10vw] md:h-[17vw] xl:h-[23vw] pb-[10%] md:pb-[50%] xl:pb-[70%] block flex-1 border-0 bg-transparent pl-1 text-gray-900  placeholder:text-gray-400 sm:text-sm sm:leading-6 "
                                    placeholder="(Write desc here)"
                                    onChange={(event)=>setListing({...listing, description:event.target.value})}
                                />
                                
                            </div>
                        </div>
                    </div>

                    <div className="h-[140px] bg-white rounded-xl shadow-md p-7">
                        <SelectMenu currentCategory={listing.category} setListing={setListing}/>
                    </div>

                    <div className=" h-[140px]  bg-white rounded-xl shadow-md p-7">
                        <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                            Price
                        </label>
                        <div className="mt-2">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-full">    
                                <input
                                    required
                                    type="number"
                                    name="price"
                                    value={listing.price}
                                    id="price"
                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 "
                                    placeholder="(Price that will be shown)"
                                    onChange={(event)=>{
                                        if(event.target.value < 0){
                                            toast.error('No negative numbers')
                                            event.target.value=0
                                        }
                                        setListing({ ...listing, price: event.target.value })
                                        
                                        }
                                    }
                                    onKeyDown={(event) => {
                                        const input = event.target.value;
                                        const decimalIndex = input.indexOf('.');
                                        
                                        if (decimalIndex !== -1 && input.length - decimalIndex > 2 && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(event.key) || (input.length > 7 && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(event.key))) {
                                            event.preventDefault();
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className=" h-[140px]  bg-white rounded-xl shadow-md p-7">
                        <label htmlFor="qty" className="block text-sm font-medium leading-6 text-gray-900">
                            Quantity
                        </label>
                        <div className="mt-2">
                            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-full">    
                                <input
                                    required
                                    type="number"
                                    name="qty"
                                    value={listing.qtyavail}
                                    id="qty"
                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 "
                                    placeholder="Available Qty"
                                    onChange={(event)=>{
                                        if(event.target.value < 0){
                                            toast.error('No negative numbers')
                                            event.target.value=0
                                        }
                                        setListing({ ...listing, qtyavail: event.target.value })
                                        
                                        }
                                    }
                                    onKeyDown={(event) => {
                                        const input = event.target.value;
                                        const decimalIndex = input.indexOf('.');
                                        
                                        if (decimalIndex !== -1 && input.length - decimalIndex > 2 && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(event.key) || (input.length > 7 && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(event.key))) {
                                            event.preventDefault();
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    
                </div>
                <div className='sm:w-full h-[80%] mt-0 sm:mt-3 sm:mr-3 mr-0 space-y-5'>
                    <div className=" sm:min-w-[390px] min-w-[30vw] bg-white rounded-xl shadow-md p-7" onDragOver={handleDragOver} onDrop={handleDrop}>
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                            Photo
                        </label>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center">
                                <IoMdPhotos className="mx-auto h-12 w-12 text-gray-300" />
                                <div className="mt-4 flex text-sm leading-6 text-gray-600 whitespace-nowrap">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer rounded-md font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                    >
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileUpload}/>
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs leading-5 text-gray-600">(Up to four PNG, JPG, GIF)</p>
                            </div>
                        </div>
                    </div>
                    <ImageShow currentImages={listing.imgUrls} imgUrls={imgUrls} setImgUrls={setImgUrls}/>
                </div>
                <button 
                    type='submit' 
                    className='absolute right-[10%] md:w-[40px] w-[80%] md:right-8 bottom-[-37px] md:bottom-[-38px] bg-white rounded-xl shadow-lg whitespace-nowrap min-w-[150px] h-[50px] font-bold ring-1 hover:ring-[3px] hover:ring-pink-200 ring-inset ring-slate-300'
                >{`${type}`}</button>
            </div>
            
        </div>
        
        </form>
    )
}

export default Form