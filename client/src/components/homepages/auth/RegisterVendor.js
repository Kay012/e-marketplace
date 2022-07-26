import axios from 'axios';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';


const RegisterVendor = () => {

    const [user, setUser] = useState({
        vendorName: '', contact:null, email: '', password: ''
    })

    const onChangeInput = (e) => {
        const {name, value} =e.target;
        setUser({...user, [name]: value})
    }

    const registerSubmit = async(e) => {
        e.preventDefault()
        try{
            await axios.post('/user/register_vendor', user)
            localStorage.setItem('firstRegister', true)

            window.location.href='/';
        }catch(err){
            alert(err.response.data.msg)
        }
    }


    return (
        <div className='login-page'>
            <form onSubmit={registerSubmit}>
                <h2>Vendor Registration</h2>
                <Link to='/register'>Register As a Customer?</Link>
                <input type='text' name='vendorName' required
                placeholder='Company Name' value={user.name} 
                onChange={onChangeInput} autoComplete='on'/>

                {/* <input type='text' name='username' required
                placeholder='Company Owner Name' value={user.name} 
                onChange={onChangeInput} autoComplete='on'/> */}


                <input type='email' name='email' required
                placeholder='Company Email' value={user.email} 
                onChange={onChangeInput} autoComplete='on'/>

                {/* <input type='email' name='email' required
                placeholder='Company Owner Email' value={user.email} 
                onChange={onChangeInput} autoComplete='on'/> */}

                <input type='number' name='contact' required
                placeholder='Company Contact Number' value={user.contact} 
                onChange={onChangeInput} autoComplete='on'/>

                {/* <input type='email' name='email' required
                placeholder='Company Owner Contact Number' value={user.email} 
                onChange={onChangeInput} autoComplete='on'/> */}

                

                {/* <input type='text' name='username' required
                placeholder='Company Owner Name' value={user.name} 
                onChange={onChangeInput} autoComplete='on'/> */}

                {/* <input type='text' name='username' required
                placeholder='Company Account Number' value={user.name} 
                onChange={onChangeInput} autoComplete='on'/> */}
{/* 
                <input type='text' name='username' required
                placeholder='Company Bank Name' value={user.name}
                onChange={onChangeInput} autoComplete='on'/>
                 */}
                {/* <input type='text' name='username' required
                placeholder='Company Bank Branch Code' value={user.name} 
                onChange={onChangeInput} autoComplete='on'/> */}

                <input type='password' name='password' required
                placeholder='Password' value={user.password} 
                onChange={onChangeInput} />

                <div className='row'>
                    <button type='submit'>Register</button>
                    <Link to='/login'>Login</Link>
                </div>
            </form>
        </div>
    )
}

export default RegisterVendor
