'use client'

import React, {createContext, useContext, useState} from 'react';

const Context = createContext();

let foundProduct;
let index;

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantity,setTotalQuantities] = useState(0);
    const [qty,setQty] = useState(1);
    const [query,setQuery] =useState('')
    const [category,setCategory] = useState('')
    const [channelQuery, setChannelQuery] = useState('')
    const [offer,setOffer] = useState(null)
    const [acceptedOffer, setAcceptedOffer] = useState(0)
    const [isPreviewing, setIsPreviewing] = useState(true)
    const [activeAuthor,setActiveAuthor] = useState('')
    const [modal,setModal] = useState(false)
    const [guestSession,setGuestSession] = useState(false)


    const onAdd = (product, quantity) =>{
        setTotalPrice((prevTotalPrice)=>prevTotalPrice + product.price*quantity);
        setTotalQuantities((prevTotalQuantities)=>prevTotalQuantities + quantity);
        const checkProductInCart = cartItems.find((item) => item.id === product.id)
        if(checkProductInCart){
            const updatedCartItems = cartItems.map((cartProduct)=>{
                if (cartProduct.id === product.id) {
                    return {
                        ...cartProduct,
                        quantity:cartProduct.quantity + quantity
                    }
                }
            })

            setCartItems(updatedCartItems)
        } else {
            product.quantity = quantity
            setCartItems([...cartItems, {...product}])
        }
        console.log(`${qty} ${product.name} added to cart`)



    }

    const toggleCartItemQuantity =(id, value) => {
        foundProduct = cartItems.find((item)=> item.id === id)
        index = cartItems.findIndex((product)=>product.id === id)
        
        const newCartItems = cartItems.filter((item)=>item._id !==id)
        if (value == 'inc') {
            const newArray=[...newCartItems.slice(0,index),{...foundProduct,quantity:foundProduct.quantity +1}, ...newCartItems.slice(index+1)]
            setCartItems(newArray)
            //setCartItems([...newCartItems, {...foundProduct, quantity : fou3ndProduct.quantity + 1}])
            setTotalPrice((prevTotalPrice)=>prevTotalPrice + foundProduct.price)
            setTotalQuantities((prevTotalQuantities)=>prevTotalQuantities+1)
        } else if (value == 'dec') {
            if (foundProduct.quantity > 1) {
                //setCartItems([...newCartItems, {...foundProduct, quantity : foundProduct.quantity - 1}])
                const newArray=[...newCartItems.slice(0,index),{...foundProduct,quantity:foundProduct.quantity -1}, ...newCartItems.slice(index+1)]
                setCartItems(newArray)
            } else {
                const removedCartItem = cartItems.filter((item)=>item.id !==id)
                setCartItems(removedCartItem)
                
            }

            setTotalPrice((prevTotalPrice)=>prevTotalPrice - foundProduct.price)
            setTotalQuantities((prevTotalQuantities)=>prevTotalQuantities - 1)

        }   
    }

    const onRemove = (product) => {
        foundProduct = cartItems.find((item)=> item.id === product.id)        
        const newCartItems = cartItems.filter((item)=>item.id !== product.id)
        setCartItems(newCartItems)

        setTotalPrice((prevTotalPrice)=>prevTotalPrice- (foundProduct.price * foundProduct.quantity))
        setTotalQuantities((prevTotalQuantities)=>prevTotalQuantities - foundProduct.quantity)
    }

    const incQty = () => {
        setQty((prevQty)=>prevQty +1)
    }

    const decQty = () => {
        setQty((prevQty)=> {
            if(prevQty < 2){
                return 1
            }
            return prevQty - 1;
    })
    }

    const handleGuestMode =() =>{
        if (guestSession.name) {setGuestSession(false)} else if (!guestSession.name) {
            setGuestSession({
                name:'Pk ProjectAccount1',
                id:'0c62a4358e1b4c969ffe2d041646f78a',
                image:'https://lh3.googleusercontent.com/a/ACg8ocLmHkADKQKMDc__XWCuOJupyQypTLqFZi3wKC0SNydT=s96-c',
                streamtoken:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMGM2MmE0MzU4ZTFiNGM5NjlmZmUyZDA0MTY0NmY3OGEifQ.ieeWmU6a8NhO2ep4Sn4Z6XsCiD4kWDp8dEDIekSsxcg'
            })
        }
    }

    return (
        <Context.Provider
            value={{activeAuthor, setActiveAuthor,isPreviewing, setIsPreviewing,acceptedOffer, setAcceptedOffer,offer,setOffer,channelQuery,setChannelQuery, query, setQuery, category, setCategory, showCart, setShowCart, cartItems, totalPrice, totalQuantity,qty,incQty,decQty,onAdd, toggleCartItemQuantity, onRemove, setCartItems, setTotalPrice, setTotalQuantities,modal,setModal,handleGuestMode,guestSession}}
        >
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context)