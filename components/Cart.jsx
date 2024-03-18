'use client'
import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useStateContext } from '../context/StateContext'
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai"
import {TiDeleteOutline} from 'react-icons/ti'
import Link from 'next/link'
import toast from "react-hot-toast"
import { getStripe } from '../utils/getStripe'
import Image from 'next/image'

export default function Cart() {
    const {showCart, setShowCart, toggleCartItemQuantity, cartItems, setCartItems,onRemove, totalPrice, setTotalPrice,totalQuantity,setTotalQuantities} = useStateContext()
    
    const handleCheckout = async () => {
        const stripe = await getStripe();
        const response = await fetch('/api/stripe', {
          method:'POST',
          headers: {
            'Content-type':'application/json'
          },
          body:JSON.stringify(cartItems)
    
        })

        if (response.statusCode== 500) return;
    
        const data = await response.json();
        toast.loading('Redirecting...')
        stripe.redirectToCheckout({sessionId:data.id})
      }
    
    return (
        <Transition.Root show={showCart} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setShowCart}>
            <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                    as={Fragment}
                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                    leaveFrom="translate-x-0"
                    leaveTo="translate-x-full"
                >
                    <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                            <Dialog.Title className="text-lg font-medium text-gray-900">Shopping cart</Dialog.Title>
                            <div className="ml-3 flex h-7 items-center">
                            <button
                                type="button"
                                className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                                onClick={() => setShowCart(false)}
                            >
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="flow-root">
                            <ul role="list" className="-my-6 divide-y divide-gray-200">
                                {cartItems.map((product) => (
                                <li key={product.id} className="flex py-6">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <Image
                                        src={product.imageSrc}
                                        alt={product.imageAlt}
                                        fill={true}
                                        className="h-full w-full object-cover object-center"
                                    />
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                            <Link href={`/listing/${product.id}`}>{product.title}</Link>
                                        </h3>
                                        <p className="ml-4">${product.price}</p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                                    </div>
                                    <div className="flex justify-around mt-4">
                                        <div className=''>
                                            <p className='flex flex-row gap-5'>
                                                <span className='mt-1' onClick={()=>toggleCartItemQuantity(product.id,'dec')}><AiOutlineMinus /></span>
                                                <span className=''>{product.quantity}</span>
                                                <span className='mt-1' onClick={()=>toggleCartItemQuantity(product.id,'inc')}><AiOutlinePlus /></span>
                                            </p>
                                        </div>
                                        <button type="button" className="remove-item" onClick={()=>onRemove(product)}>
                                            <TiDeleteOutline/>
                                        </button>
                                        </div>
                                    </div>
                                </li>
                                ))}
                            </ul>
                            </div>
                        </div>
                        </div>

                        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                            <p>Subtotal</p>
                            <p>${totalPrice}</p>
                        </div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                            <p>Total quantity</p>
                            <p>{totalQuantity}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                        <div className="mt-6">
                            <button
                            onClick={cartItems.length && handleCheckout}
                            className="flex w-full items-center justify-center rounded-md border border-transparent bg-pink-200 px-6 py-3 text-base font-medium text-black shadow-sm hover:bg-pink-300"
                            >
                            Checkout
                            </button>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                            <p>
                            or{' '}
                            <button
                                type="button"
                                className="font-medium text-pink-400 hover:text-pink-300"
                                onClick={() => setShowCart(false)}
                            >
                                Continue Shopping
                                <span aria-hidden="true"> &rarr;</span>
                            </button>
                            </p>
                        </div>
                        </div>
                    </div>
                    </Dialog.Panel>
                </Transition.Child>
                </div>
            </div>
            </div>
        </Dialog>
        </Transition.Root>
  )
}
