import React, { useContext } from 'react'
import {Switch, Route} from 'react-router-dom'
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
        <Switch>
            <Route path='/' exact component={Products}/>
            <Route path='/details/:id' exact component={ProductDetails}/>

            <Route path='/login' exact component={isLogged? NotFound : Login}/>
            <Route path='/register' exact component={isLogged? NotFound : Register}/>
            <Route path='/registerVendor' exact component={isLogged? NotFound : RegisterVendor}/>
            <Route path='/cart' exact component={isLogged? Cart : NotFound}/>
            <Route path='/history' exact component={isLogged? OrderHistory : NotFound} />
            <Route path='/history/:id' exact component={isLogged? OrderDetails : NotFound} />
            <Route path='/activeOrders' exact component={isLogged? ActiveOrders : NotFound} />
            <Route path='/activeOrders/:id' exact component={isLogged? OrderDetails : NotFound} />
            <Route path='/category' exact component={isLogged && isAdmin? Categories: NotFound} />

            <Route path='/create_product' exact component={isAdmin? CreateProduct : NotFound}/>
            <Route path={`/edit_product/:id`} exact component={isAdmin? CreateProduct: NotFound} />

            <Route path='/*' exact component={NotFound}/>
        </Switch>
    )
}

export default Pages
