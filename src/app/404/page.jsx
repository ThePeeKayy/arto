'use client'
import React from "react"
import { useRouter } from "next/navigation"

export default function Errorpage() {
    const router = useRouter()
    const handleHome = () => {
        router.push('/')
    }
    return(
        <div className="mx-auto flex w-full max-w-7xl flex-auto flex-col justify-center px-6 py-12 sm:py-32 lg:px-8 h-[91vh]">
          <p className="text-base font-semibold leading-8 text-indigo-600">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page/Product not found</h1>
          <p className="mt-6 text-base leading-7 text-gray-600">Sorry, we couldn’t find the page you’re looking for.</p>
          <div className="mt-10" onClick={handleHome}>
            <a href="#" className="text-sm font-semibold leading-7 text-indigo-600">
              <span aria-hidden="true">&larr;</span> Back to home
            </a>
          </div>
        </div>)

  
}
