import React,{useContext, useState} from 'react'

import {GlobalState} from '../../../GlobalState'
import ProductItem from '../utils/productItem/ProductItem'
import Loading from '../utils/loading/Loading'
import axios from 'axios'
import Filters from './Filters'
import LoadMore from './LoadMore'
const Products = () => {
    const state = useContext(GlobalState)
    const [products, setProducts] = state.productsAPI.products
    // const [product, setProduct] = state.productsAPI.products
    const [isAdmin] = state.userAPI.isAdmin
    // const [isLogged] = state.userAPI.isLogged
    const [callback, setCallback] = state.productsAPI.callback
    const [token] = state.token    
    const [isLoading, setIsLoading] = useState(false)
    const [isChecked, setIsChecked] = useState(false)



    const deleteProduct = async (product) => {
        try{
            setIsLoading(true)
            await axios.post('/api/destroy', {public_id: product.images.public_id}, {
                headers: {Authorization: token}
            })
            await axios.delete(`/api/products/${product._id}`, {
                headers: {Authorization: token}
            })
            setCallback(!callback)
            setIsLoading(false)
        }catch(err) {
            alert(err.response.data.msg)
        }
    }

    const handleCheck =(id) => {
        if(id){
            products.forEach(product => {
                if(product._id === id){
                    product.checked = !product.checked
                    setProducts([...products])
                }
            })
        }
        
    }
    const checkAll = () => {
        products.forEach(product => {
            product.checked = !product.checked
        })
        setProducts([...products])
        setIsChecked(!isChecked)
    }
    const deleteAll = () => {
        products.forEach(product => {
            if(product.checked) deleteProduct(product)
        })
    }
    if (isLoading) return <div ><Loading /></div>    
    return (
        <>
        <Filters />
        {
            isAdmin && <div className="delete-all">
                <span>Select All</span>
                <input type='checkbox' checked={isChecked} onChange={checkAll}/>
                <button onClick={deleteAll}>Delete ALL</button>
            </div>

        }
        <div className='products'>
            {products.map(product => (
                <ProductItem key={product._id} 
                product={product} isAdmin={isAdmin} token={token} 
                deleteProduct={deleteProduct} handleCheck={handleCheck}
                />
            ))}
        </div>
        <LoadMore />
        {products.length === 0 && <Loading /> }
        </>
    )
}

export default Products
