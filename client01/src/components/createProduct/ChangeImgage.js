import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { GlobalState } from '../../GlobalState'
import Loading from '../homepages/utils/loading/Loading'
// import {useDispatch} from 'react-redux'
// import CustomAlert from '../loading/CustomAlert'
// import * as Actions from '../store/actions'
import './ChangeImage.css'
const ChangeImgage = ({currentUserId, handleAddImage, otherImagesHandler}) => {
    const state = useContext(GlobalState)
    const [images, setImages] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token

    // const dispatch = useDispatch();

    const styleUpload = {
        display: images? 'block': 'none'
    }

    const onSubmit = async(e) => {
        e.preventDefault()

        // let formData = new FormData()
        // formData.append("otherImage", saveFile)
        // // setIsLoading(true)
        // try{
        //     // const res = await axios.patch(`/user/update/otherImages/${currentUserId}`, formData,
        //     //  {
        //     //     headers: {'content-type': 'multipart/form-data'}
        //     // }
        //     // )
        //     handleAddImage()
        //     // dispatch(Actions.fetchUser(currentUserId))
        // }catch(err){
        //     setAlertMessage(err.message)
        //     setSeverity("error")
        //     return setOpen(true)
        // }
       
        otherImagesHandler(images)
        handleAddImage()
        
        // setAlertMessage("image changed")
        // setSeverity("success")
        // setOpen(true)
    }

    const onUpload = async(e) => {
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

        }catch(err){
            alert(err.message)
        }
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
        }catch(err){
            alert(err.response.data.msg)
        }
    }
  return (
    <div className="popup-box">
        <div className="box">
            <span className="close-icon" onClick={() => handleAddImage()}>x</span>
            <div className="image__cardContainer_">
            <form className="upload_" encType="multipart/form-data">
                <input type='file' name='file' id='file_up_' onChange={(e) => onUpload(e)}/>
                {
                    isLoading? 
                    <div id="file_img_">
                        <Loading />
                    </div> 
                    : <div id="file_img_" style={styleUpload}>
                        <img src={images ? images.url : ''} alt=''/>
                        <span onClick={handleDestroy}>X</span>
                    </div>
                }
            </form> 
            <div
            //  style={{display:"flex", flexDirection:"row", justifyContent:"space-between", width:"60%"}}
            className='row_btn_'
             >
                <Link to="" id="btn_save" type="submit" onClick={onSubmit}>Save</Link>
                <Link to="" id="btn_cancel" onClick={() => handleAddImage()}>Cancel</Link>
            </div>
            
            </div>
            {/* <CustomAlert alertMessage={alertMessage} isOpen={open} severity={severity} handleClose={handleClose}/> */}

        </div>
    </div>
  )
}

export default ChangeImgage