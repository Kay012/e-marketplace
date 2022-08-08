import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'

const ActiveOrders = () => {
    
    const state = useContext(GlobalState)
    const [history] = state.userAPI.history
    const [display,setDisplay] = useState([])
    const [userId] = state.userAPI.userId
    const [token] = state.token
    // const [socket] = state.userAPI.socket
    // const getUser = state.userAPI.getUser
    const [notifications, setNotifications] = state.userAPI.notifications
    const [sortedDisplay, setSortedDisplay] = useState([])
    
    useEffect(() => {
        if(history){
            history.forEach(item => {
                item.vendors.forEach(vendor => {
                    if(vendor.vendor === userId && !vendor.isShipped){
                        const isIncluded = notifications.includes(item._id)
                        if(isIncluded) setDisplay(display => [...display, {...item, isNew:true}])
                        else setDisplay(display => [...display, item])
                    }
                })
            })
        }
    },[history, notifications, userId])

    useEffect(()=>{

        if(token){
            const clearNotifications = async () => {
                await axios.delete('/api/clearNotifications', {
                    headers:{Authorization:token}
                })
            }
            if(notifications){
                clearNotifications()
                setNotifications([])
            }
        }
    },[token, notifications, setNotifications])


    useEffect(() => {
        // setIsLoading(true)
        if(display?.length > 1)
        {
            setSortedDisplay(display.sort((a, b) => (new Date(b.createdAt) - 
            new Date(a.createdAt)
            )))
        }
        else setSortedDisplay(display)
        // setIsLoading(false)

    }, [display])


    
    return (
        <div  className="history-page">
            <h2>Pending Orders</h2>
            <h4>You have {sortedDisplay.length} pending orders</h4>
            <Link id="hstory" to='/history'>view history</Link>
                <table>
                    <thead>
                        <tr>
                            <th>Payment ID</th>
                            <th>Date of Purchase</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            sortedDisplay.map((item) => (
                                <tr key={item._id}>
                                    <td style={{color: item.isNew? "black":"gray" }}>{item._id}</td>
                                    <td style={{color: item.isNew? "black":"gray" }}>{new Date(item.createdAt).toUTCString().substring(0,17)} {new Date(item.createdAt).getHours()}h:{new Date(item.createdAt).getMinutes()}</td>
                                    <td><Link to={`/history/${item._id}`}>View</Link></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
        </div>
    )
}

export default ActiveOrders
