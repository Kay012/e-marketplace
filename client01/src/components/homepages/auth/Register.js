import axios from 'axios';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';


const Register = () => {

    const [user, setUser] = useState({
        username: '',email: '', password: ''
    })

    const onChangeInput = (e) => {
        const {name, value} =e.target;
        setUser({...user, [name]: value})
    }

    const registerSubmit = async(e) => {
        e.preventDefault()
        try{
            await axios.post('/user/register', user)
            localStorage.setItem('firstRegister', true)

            window.location.href='/';
        }catch(err){
            alert(err.response.data.msg)
        }
    }


    return (
        <div className='login-page'>
            <form onSubmit={registerSubmit}>
                <h2>Customer Registration</h2>
                {/* <button>As a Customer?</button> */}
                
                <Link to='/registerVendor'> Register As a Vendor?</Link>
                
                {/* <button style={{marginLeft:'10px'}}>As a Vendor?</button> */}
            <input type='text' name='username' required
                placeholder='Name' value={user.name} 
                onChange={onChangeInput} autoComplete='on'/>

                <input type='email' name='email' required
                placeholder='Email' value={user.email} 
                onChange={onChangeInput} autoComplete='on'/>

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

export default Register
