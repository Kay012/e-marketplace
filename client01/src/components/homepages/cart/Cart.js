import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
// import { Link } from 'react-router-dom';
import { GlobalState } from '../../../GlobalState'
// import PayPalButton from './PayPalButton'

const Cart = () => {

    const state = useContext(GlobalState);
    const [cart, setCart] = state.userAPI.cart
    const [total, setTotal] = useState(0)
    const [totalQuantity, setTotalQuantity] = useState(0)
    const [token] = state.token
    const [socket] = state.userAPI.socket
    const getHistory = state.userAPI.getHistory
    // const [callback, setCallback] = state.userAPI.callback
    


   

    

    useEffect(() => {
        
       
        const getTotal = () => {
            const total = cart.reduce((prev, item) =>{
                return prev + (item.price * item.quantity)
            }, 0)

            setTotal(total)
           
        }
        const getTotalQuantity =  () => {
            const tot = cart.reduce((prev, item) =>{
                return prev + (item.quantity)
            }, 0)

            setTotalQuantity(tot)

        }
        
        getTotal()
        getTotalQuantity()
    },[cart])

    const addToCart = async (cart) => {
        try{

            await axios.patch('/user/addcart',{cart: [...cart]}, {
                headers:{Authorization: token}
            } ) 
            
        }catch(err){
            alert(err.response.data.msg)
        }
        
        
    }

    const increment = (id) => {
        cart.forEach(item => {
            if(id === item._id){
                item.quantity = item.quantity + 1
            }
        })
        setCart([...cart])
        addToCart(cart)
    }

    const decrement = (id) => {
        cart.forEach(item => {
            if(id === item._id){
                item.quantity = item.quantity <= 1? 1 : item.quantity - 1
            }
        })
        setCart([...cart])
        addToCart(cart)
    }

    const removeProduct = (id) => {
        if(window.confirm("Do you want to delete this product")){
            cart.forEach((item, index) => {
                if(item._id === id){
                    cart.splice(index, 1)
                }
            })
            setCart([...cart])
            addToCart(cart)
        }
        
    }

    const tranSuccess = async() => {
        // console.log(payment)
        // const {paymentID, address} = payment;
        try{
            const res = await axios.post('/api/checkout', {cart, total, totalQuantity}, {
                headers: {Authorization: token}
            })
            
            setCart([])
            addToCart([])
            alert("You have successfully placed an order.")
            getHistory(token);
            if(socket)
            {
                socket.emit("sendNewOrder",(res.data.sendVendors))
            }
        }catch(err){
            alert(err.response.data.msg)
        }
        
        
        
        
    }

    if(cart.length === 0){
        return <h2 style={{textAlign: 'center', fontSize: '5rem'}}>Cart Empty</h2>
    }
    return ( 
        <div>
            {
                cart.map(product => (
                    <div className='cart details' key={product._id}>
                        <img src={product.images.url} alt="" className='img_container'/>
                        <div className='details_box'>
                            <h2>{product.title}</h2>
                            {/* <h6>#id: {product.product_id}</h6> */}
                            <span>R {product.price * product.quantity}</span>
                            <p>{product.decription}</p>
                            <p>{product.content}</p>
                            {/* <p>Sold: {product.sold}</p> */}

                            <div className='amount'>
                                <button onClick={() => decrement(product._id)}> - </button>
                                <span>{product.quantity}</span>
                                <button onClick={() => increment(product._id)}> + </button>
                            </div>
                            <div className="delete" onClick={() => removeProduct(product._id)}>X</div>
                            
                        </div>
                    </div>
                ))
            }
            <div className="total">
                <h3>Total: R {total}</h3>
                <h3>Quantity: {totalQuantity}</h3>
                {/* <PayPalButton total={total} tranSuccess={tranSuccess}/> */}
                <button onClick={tranSuccess}>Checkout</button>
            </div>
        </div>
    )    
}

export default Cart
