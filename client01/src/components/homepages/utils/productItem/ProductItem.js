import React, {useContext,} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GlobalState } from '../../../../GlobalState'

const ProductItem = ({product, isAdmin,deleteProduct, handleCheck, isLoading,}) => {

    // const [products] = state.productsAPI.products
    // const isAdmin = state.userAPI.isAdmin
    const state = useContext(GlobalState)
    const addCart = state.userAPI.addCart
    const navigate = useNavigate()

    

    
    return (
        <div className='product_card' >
            {
                isAdmin && <input type='checkbox' checked={product.checked} onChange={() => handleCheck(product._id)} />
            }
            <img src={product.images.url} alt='' onClick={() => isAdmin? navigate(`/edit_product/${product?._id}`): navigate(`/details/${product?._id}`)}/>

            <div className='product_box'>
                <h3>{product.title}</h3>
                <span>R{product.price}</span>
                <p>{product.description}</p>
            </div>

            <div className='row_btn'>
                {
                    isAdmin?
                    <>
                    <Link id='btn_delete' to='#!' onClick={() =>deleteProduct(product)}>
                        Delete
                    </Link>
                    {/* <Link id='btn_view' to={`/edit_product/${product._id}`}>
                        Edit
                    </Link>  */}
                    </>
                    :
                    <>
                    <Link id='btn_buy' to='#!' onClick={() => addCart(product)}>
                        Buy
                    </Link>
                    {/* <Link id='btn_view' to={`/details/${product._id}`}>
                        View
                    </Link> */}
                    </>

                }
                
            </div>
        </div>
    )
}

export default ProductItem
