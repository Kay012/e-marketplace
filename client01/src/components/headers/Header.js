import React, {useContext, useState, useEffect} from 'react'
import  {GlobalState} from '../../GlobalState'

import Menu from '../icons/menu.svg'
import Close from '../icons/close.svg'
import Cart from '../icons/cart.svg'
import {Link} from 'react-router-dom'
import axios from 'axios'

const Header = () => {
    const state = useContext(GlobalState)
    const [isLogged] = state.userAPI.isLogged
    const [isAdmin] = state.userAPI.isAdmin
    const [cart] = state.userAPI.cart
    const [menu, setMenu] = useState(false)
    const [notifications] = state.userAPI.notifications
    const [socket] = state.userAPI.socket
    const getUser = state.userAPI.getUser
    const [token] = state.token

    useEffect(() => {
        let isMounted = true;
        const getOrder = () => {
            if(socket)
            {
                socket.on("getNewOrder", () =>{
                    if (isMounted) {
                        getUser(token)
                    }
                })
            }
        }
        getOrder()
        return () => { isMounted = false }
    },[socket, getUser,token])

    const logoutUser = async() => {
        await axios.get('/user/logout')
        localStorage.clear()
        window.location.href = "/";
    }

    const adminRouter = () => {
        return (
            <>
                <li><Link to='/create_product' onClick={() =>setMenu(!menu)}>Create Product</Link></li>
                <li><Link to='/category' onClick={() =>setMenu(!menu)}>Categories</Link></li>
            </>
        )
    }

    const loggedRouter = () => {
        return (
            <>
                {!isAdmin && <li><Link to='/history' onClick={() =>setMenu(!menu)}>My Orders</Link></li>}
                <li><Link to='/' onClick={() => {logoutUser();setMenu(!menu)}}>Logout</Link></li>
            </>
        )
    }

    const styleMenu ={
        left: menu? 0: '-100%'
    }
    
    return (
        <header>
            <div className='menu' onClick={() => setMenu(!menu)}>
                <img src={Menu} alt="" width="30"/>
            </div>

            <div className='logo'>
                <h1>
                    <Link to='/'>e-marketplace</Link>
                </h1>
            </div>

            <ul style={styleMenu}>
                <li><Link to='/' onClick={() =>setMenu(!menu)}>{isAdmin? 'Products': 'Shop'}</Link></li>
                {isAdmin && adminRouter()}
                {
                   isLogged? loggedRouter(): <li><Link to='/login' onClick={() =>setMenu(!menu)}>Login or Register</Link></li>
                }
                <li onClick={() => setMenu(!menu)}>
                   <img src={Close} alt='' width='30' className='menu'/>
                </li>
            </ul>

            {
                isAdmin? 
                <div className='cart-icon'>
                    <span>{notifications.length}</span>
                    <Link to='/activeOrders'>
                    <img src={Cart} alt='' width='30'/>
                    </Link>
                </div>
                : <div className='cart-icon'>
                    <span>{cart.length}</span>
                    <Link to='/cart'>
                    <img src={Cart} alt='' width='30'/>
                    </Link>
                </div>
            }

        </header>
    )
}

export default Header
