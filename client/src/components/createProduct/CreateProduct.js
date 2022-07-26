import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { GlobalState } from '../../GlobalState'
import Loading from '../../components/homepages/utils/loading/Loading'
import { useHistory, useParams } from 'react-router'
import ChangeImgage from './ChangeImgage'

const initialState= {
    product_id: '',
    title: '',
    price: 0,
    description: 'Bazolimala, bazolimal. Everywhere I go they follow follow. Everything i do they follwo mama. They follow follow, they follow mams',
    content: 'Lyrics I am listening to at the moment, they might not make sense',
    category: '',
    // id: ''
}
const CreateProduct = () => {
    const state = useContext(GlobalState)
    const [product, setProduct] = useState(initialState)
    const [products] = state.productsAPI.products
    const [categories] = state.categoryAPI.categories
    const [images, setImages] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [onEdit, setOnEdit] = useState(false)
    const [token] = state.token
    const [callback, setCallback] = state.productsAPI.callback
    const [addImage, setAddImage] = useState(false)
    const [existingFileIndex, setExistingFileIndex] = useState(null)
    const [otherImages, setOtherImages] = useState([])
    const [mainImage, setMainImage] = useState("")

    const [isAdmin] = state.userAPI.isAdmin

    const params = useParams()
    const history = useHistory()

    useEffect(() => {
        if(params.id){
            products.forEach(product => {
                if (params.id === product._id){
                    setProduct(product)
                    setImages(product.images)
                    setMainImage(product.images)
                    setOtherImages(product.otherImages)
                    setOnEdit(true)
                }
            })
        }else{
            setProduct(initialState)
            setImages(false)
        }
    },[params, products])
    
    const handleChangeInput = async e => {
        e.preventDefault()
        const {name, value} = e.target
        setProduct({...product, [name]: value})
    }
    const handleUpload = async e => {
        e.preventDefault()
        try{
            if(!isAdmin) return alert("You not an Admin")

            const file = e.target.files[0]

            if(!file) return alert("No picture found")

            if (file.size > 1024 *1024)  {          //1b
                return alert("File size too large")
            }  

            if(file.type !== 'image/png' && file.type !== 'image/jpeg'){
                return alert("Incorrect file format")
            }
            let formData = new FormData()

            formData.append('file', file)
            setIsLoading(true)

            const res = await axios.post('/api/upload', formData, {
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })
            
            setImages(res.data)
            setIsLoading(false)
            
            if(existingFileIndex !== null){
               setOtherImages(prevState => [...prevState,res.data])
            }else  setMainImage(res.data)
           
        }catch(err){
            alert(err.response.data.msg)
        }
    }

    const handleSubmit = async e => {
        e.preventDefault()
        

        try{
            if(!isAdmin) return alert('You not Authorized to perform this operation')
            if(!images) return alert('No image uploaded')
            if (onEdit) {
                await axios.put(`/api/products/${product._id}`, {...product, images:mainImage,otherImages}, {
                    headers: {Authorization: token}
                })
            }
            else{
                try{
                    await axios.post('/api/products', {...product, images:mainImage, otherImages}, {
                        headers: {Authorization: token}
                    })
                }catch(err) {
                    return alert(err.response.data.msg)
                }
                
            }
            setCallback(!callback)
            setImages(false)
            setOnEdit(false)
            setMainImage("")
            setProduct(initialState)
            history.push('/')
            

        }catch(err){
            alert("Failed to submit")
        }
    }
    const handleAddImage = () =>{
        setAddImage(!addImage)
    }

    const handleReplaceImage = (index) => {
        setExistingFileIndex(index)
        setImages(otherImages[index])
        // setImages(require(`../../public/images/${currentUserId}/other/${otherImages[index]}`))
    }

    const handleDestroy = async e => {
        e.preventDefault()
        try{
            if (!isAdmin) {
                alert('Not Authorised')
            }
            setIsLoading(true)
            try{
                await axios.post('/api/destroy', {public_id: images.public_id}, {
                    headers: {Authorization: token}
                })
            }catch(err){
                alert(err.response.data.msg)
            }
            
            setIsLoading(false)
            setImages(false)
            if(existingFileIndex !== null){
                otherImages.splice(existingFileIndex,1)
            }else setMainImage("")

        }catch(err){
            alert(err.response.data.msg)
        }
    }
    const styleUpload = {
        display: images? 'block': 'none'
    }

    const otherImagesHandler = (img) => {
        setOtherImages(prevState => [...prevState, img])
    }

    return (
        <div className='create_product'>
            <div className="upload">
                <input type='file' name='file' id='file_up' onChange={handleUpload}/>
                {
                    isLoading? 
                    <div id="file_img">
                        <Loading />
                    </div> 
                    : <div id="file_img" style={styleUpload}>
                        <img src={images ? images.url :""} alt=''/>
                        <span onClick={handleDestroy}>X</span>
                    </div>
                }
                <div className="imgs">
                    <div className='img' style={existingFileIndex===null? {borderRadius:"2px", opacity:0.9, borderBottom:"2px solid black"}: {border:"1px solid #ddd"}}
                      onClick={() => {setImages(mainImage); setExistingFileIndex(null);}} >
                    <img src={mainImage?.url} alt=''/>
                    </div>

                    <div className='img' style={existingFileIndex===0? {borderRadius:"2px", opacity:0.9, borderBottom:"2px solid black"}: {border:"1px solid #ddd"}}
                     onClick={() => otherImages?.length>0? handleReplaceImage(0) : handleAddImage()}>
                        {/* <img src="" alt=""/> */}
                        {/* <div style={{justifyContent:"center", alignItems:"center"}}> */}
                        <img src={otherImages?.length>0?otherImages[0].url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe-j5PJRX4f6Ykaa2SrlVbJeiqGk0cRAzfUQ&usqp=CAU"} alt=''/>
                        {/* </div> */}
                        
                    </div>

                    <div className='img' style={existingFileIndex===1? {borderRadius:"2px", opacity:0.9, borderBottom:"2px solid black"}: {border:"1px solid #ddd"}}
                     onClick={() => otherImages?.length>1? handleReplaceImage(1) : handleAddImage()}>
                    <img src={otherImages?.length>1?otherImages[1].url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQe-j5PJRX4f6Ykaa2SrlVbJeiqGk0cRAzfUQ&usqp=CAU"} alt=''/>
                    </div>
                </div>
            </div>
            {/* <div style={{display:"flex", flexDirection:"column"}}> */}
            {/* <div className="upload">
                <input type='file' name='file' id='file_up' onChange={handleUpload}/>
                {
                    isLoading? 
                    <div id="file_img">
                        <Loading />
                    </div> 
                    : <div id="file_img" style={styleUpload}>
                        <img src={images ? images.url : ''} alt=''/>
                        <span onClick={handleDestroy}>X</span>
                    </div>
                }
            </div> */}
                {/* <div className="imgs" onClick={() => {setImages(product?.images?.url); setExistingFileIndex(null);}}>
                    <div className='img'  >
                    <img src={product?.images?.url} alt=''/>
                    </div>

                    <div className='img' onClick={() => otherImages?.length>0? handleReplaceImage(0) : handleAddImage()}>
                       
                        <img src={product?.images?.url} alt=''/>
                        
                    </div>

                    <div className='img' onClick={() => otherImages?.length>1? handleReplaceImage(1) : handleAddImage()}>
                    <img src={product?.images?.url} alt=''/>
                    </div>
                </div> */}
            {/* </div> */}
 
            <form onSubmit={handleSubmit}>
                {/* <div className="row">
                    <label htmlFor='product_id'>Product ID</label>
                    <input type='text' name='product_id' id='product_id' required
                    onChange={handleChangeInput} value={product._id} disabled={onEdit} />
                </div> */}
                <div className="row">
                    <label htmlFor='title'>Title ID</label>
                    <input type='text' name='title' id='title' required
                     onChange={handleChangeInput} value={product.title} />
                </div>
                <div className="row">
                    <label htmlFor='price'>Price</label>
                    <input type='text' name='price' id='price' required
                     onChange={handleChangeInput} value={product.price} />
                </div>
                <div className="row">
                    <label htmlFor='description'>Description</label>
                    <textarea type='text' name='description' id='description' required
                     onChange={handleChangeInput} value={product.description} rows='5' />
                </div>
                <div className="row">
                    <label htmlFor='content'>Content</label>
                    <textarea type='text' name='content' id='content' required
                     onChange={handleChangeInput} value={product.content} rows='7'/>
                </div>
                <div className="row">
                    <label htmlFor='product_id'>Categories:</label>
                    <select name='category' onChange={handleChangeInput} value={product.category}> 
                        <option value=''>Select a category</option>
                        {
                            categories.map(category => (
                                <option value={category._id} key={category._id}>
                                    {category.name}
                                </option>
                            ))
                        }
                    </select>
                </div>
                <button type="submit">{onEdit? "Update" : "Create"}</button>
            </form>
            {addImage && <ChangeImgage otherImagesHandler={otherImagesHandler} productId={product?._id} handleAddImage={handleAddImage} />}
        </div>
    )
}

export default CreateProduct
