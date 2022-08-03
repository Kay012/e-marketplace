import React, { useContext } from 'react'
import {Routes, Route} from 'react-router-dom'
import Products from './products/Products'
import Cart from './cart/Cart'
import Login from './auth/Login'
import Register from './auth/Register'
import NotFound from './utils/not_found/NotFound'
import ProductDetails from './productDetails/ProductDetails'
import { GlobalState } from '../../GlobalState'
import OrderHistory from './history/OrderHistory'
import OrderDetails from './history/OrderDetails'
import Categories from './categories/Categories'
import CreateProduct from '../createProduct/CreateProduct'
import RegisterVendor from './auth/RegisterVendor'
import ActiveOrders from './history/ActiveOrders'



const Pages = () => {
    const state = useContext(GlobalState)
    const [isLogged] = state.userAPI.isLogged
    const [isAdmin] = state.userAPI.isAdmin

    return (
        <Routes>
            <Route path='/' exact element={<Products/>}/>
            <Route path='/details/:id' exact element={<ProductDetails/>}/>

            <Route path='/login' exact element={isLogged? <NotFound/> : <Login/>}/>
            <Route path='/register' exact element={isLogged? <NotFound/> : <Register/>}/>
            <Route path='/registerVendor' exact element={isLogged? <NotFound/> : <RegisterVendor/>}/>
            <Route path='/cart' exact element={isLogged? <Cart/> : <NotFound/>}/>
            <Route path='/history' exact element={isLogged? <OrderHistory/> : <NotFound/>} />
            <Route path='/history/:id' exact element={isLogged? <OrderDetails/> : <NotFound/>} />
            <Route path='/activeOrders' exact element={isLogged? <ActiveOrders/> : <NotFound/>} />
            <Route path='/activeOrders/:id' exact element={isLogged? <OrderDetails/> : <NotFound/>} />
            <Route path='/category' exact element={isLogged && isAdmin? <Categories/>: <NotFound/>} />

            <Route path='/create_product' exact element={isAdmin? <CreateProduct/> : <NotFound/>}/>
            <Route path={`/edit_product/:id`} exact element={isAdmin? <CreateProduct/>: <NotFound/>} />

            <Route path='/*' exact element={<NotFound/>}/>
        </Routes>
    )
}

export default Pages
