import axios from 'axios'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client';
const UserAPI = (token) => {
    const [isLogged, setIsLogged] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [cart, setCart] = useState([])
    const[history, setHistory] = useState([])
    const [callback, setCallback] = useState(false)
    const [userId, setUserId] = useState("")
    const [notifications, setNotifications] = useState([])
    const [socket, setSocket] = useState(null)
    

    useEffect(() => {
        if(token){
            getUser(token)
        }
    }, [token])

    const getUser = async (token) => {
        try{
            const res = await axios.get('/user/infor', {
                headers:{Authorization: token}
            })
            setIsLogged(true)
            res.data.role===1? setIsAdmin(true): setIsAdmin(false)
            setCart(res.data.cart)
            setUserId(res.data._id)
            setNotifications(res.data.notifications)

            const sockt = io("wss://e-marketplace1.herokuapp.com");
            sockt.emit("addUser", (res.data._id))
            
            setSocket(sockt)

            // getHistory(res.data.role)
            // console.log(res.data.role)
            
        }catch(err){
            alert(err)
        }
    }

    useEffect(() => {
        if(token){
            
            getHistory(token);
        }

    },[token])
    const getHistory = async(token) => {
        const res = await axios.get('/user/history', {headers:{Authorization: token}})
        setHistory(res.data)
    }

    const clearNotifications = async (paymentId) => {
        await axios.patch('/api/clearNotifications', {paymentId}, {
            headers:{Authorization:token}
        })
        notifications.forEach((item, index) => {
            if(item === paymentId){
                notifications.splice(index, 1)
            }
        })
        setNotifications([...notifications])
    }

    const addCart = async (product) => {
   
        if(!isLogged) return alert("Please Login to continue buying")

        const check = cart.every( item => {
            return item.product_id !== product.product_id
        })
        if(check){
            setCart([...cart, {...product, quantity: 1}])
            
            await axios.patch('/user/addcart',{cart: [...cart, {...product, quantity: 1}]}, {
                headers:{Authorization: token}
            } )
  
        }else{
            alert("This Product has been added to cart.")
        }
    }
    return {
        isLogged: [isLogged,setIsLogged],
        isAdmin: [isAdmin,setIsAdmin],
        cart: [cart, setCart],
        userId: [userId, setUserId],
        addCart: addCart,
        getHistory: getHistory,
        getUser:getUser,
        history: [history, setHistory],
        notifications: [notifications, setNotifications],
        clearNotifications: clearNotifications,
        socket: [socket, setSocket],
        callback: [callback, setCallback]
        
    }
}

export default UserAPI
