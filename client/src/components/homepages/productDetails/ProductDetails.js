import React,{useContext, useState, useEffect} from 'react'
import {Link, useParams} from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'
import ProductItem from '../utils/productItem/ProductItem'

const ProductDetails = () => {
    const params = useParams()
    const state = useContext(GlobalState)
    const [products] = state.productsAPI.products
    const [productDetails, setProductDetails] = useState([])
    const addCart = state.userAPI.addCart
    const [images, setImages] = useState(false)
    const [addImage, setAddImage] = useState(false)
    const [existingFileIndex, setExistingFileIndex] = useState(null)
    // const [otherImages, setOtherImages] = useState([])

    useEffect(() => {
        if(params){
            products.forEach(product => {
                if(product._id === params.id){
                    setProductDetails(product)
                    setImages(product.images)
                }
                
            });
        }
    }, [params, products])
    if(productDetails.length===0) return null;

    const handleAddImage = () =>{
        setAddImage(!addImage)
    }

    const handleReplaceImage = (index) => {
        setExistingFileIndex(index)
       
        setImages(productDetails.otherImages[index])
    }
    
    return (
        <React.Fragment>
        <div className='details'>
            
            {/* <div style={{display:"flex", flexDirection:"column"}}> */}
            <div className="upload">
                <div className='file_up'>
                    <div className='file_img'>
                        <img src={images?.url} alt=''/>

                    </div>
                </div>
               
                <div className="imgs" >
                    <div className='img' style={existingFileIndex===null? {borderRadius:"2px", opacity:0.9, borderBottom:"2px solid black"}: {border:"1px solid #ddd"}} onClick={() => {setImages(productDetails.images); setExistingFileIndex(null);}} >
                    <img src={productDetails.images.url} alt=''/>
                    </div>

                    {
                        productDetails.otherImages?.length>0 &&
                        <div className='img' style={existingFileIndex===0? {borderRadius:"2px", opacity:0.9, borderBottom:"2px solid black"}: {border:"1px solid #ddd"}} onClick={() => productDetails.otherImages?.length>0? handleReplaceImage(0) : handleAddImage()}>
                        {/* <img src="" alt=""/> */}
                        {/* <div style={{justifyContent:"center", alignItems:"center"}}> */}
                            <img src={productDetails.otherImages[0].url} alt=''/>
                            {/* </div> */}

                        </div>


                    }
                    
                    {
                        productDetails.otherImages?.length>1 &&
                        <div className='img' style={existingFileIndex===1? {borderRadius:"2px", opacity:0.9, borderBottom:"2px solid black"}: {border:"1px solid #ddd"}} onClick={() => productDetails.otherImages?.length>1? handleReplaceImage(1) : handleAddImage()}>
                            <img src={productDetails.otherImages[1].url} alt=''/>
                        </div>  
                    }
                    
                </div>
            </div>
            
            <div className='details_box'>
                <div className='row'>
                    <h2>{productDetails.title}</h2>
                    {/* <h6>#id: {productDetails._id}</h6> */}
                </div>
                <span>R {productDetails.price}</span>
                <p>{productDetails.description}</p>
                <p>{productDetails.content}</p>
                <p>Sold: {productDetails.sold}</p>
                <Link to='/cart' className='cart' onClick={() => addCart(productDetails)}>Buy Now</Link>
            </div>
        </div>

        <div>
            <h2>Related Products</h2>

            <div className='products'>
                {products.filter(item => productDetails._id !== item._id).map(product => (
                    product.category === productDetails.category?
                    <ProductItem key={product._id} product={product}/>: null
                ))}
            </div>
        </div>
        </React.Fragment>
    )
}

export default ProductDetails
