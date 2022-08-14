import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'

const OrderHistory = () => {
    
    const state = useContext(GlobalState)
    const [history] = state.userAPI.history
    
    const [display,setDisplay] = useState([])
    const [sortedDisplay, setSortedDisplay] = useState([])
    const [userId] = state.userAPI.userId
    const [isAdmin] = state.userAPI.isAdmin
    
    useEffect(() => {
        if(history){
            let listToDisplay = []
            if(isAdmin)
            {
                history.forEach(item => {
                    item.vendors.forEach(vendor => {
                        if(vendor.vendor === userId && vendor.isShipped){
                        // setDisplay(display => [...display, item])
                        listToDisplay.push(item)
                        }
                    })
                })
                setDisplay(listToDisplay)
            }
            else{
                setDisplay(history)
            }
        }
    },[history, isAdmin,userId])


    useEffect(() => {
      
        if(display.length > 1)
        {
            let sorted = display.sort((a, b) => (new Date(b.createdAt) - 
            new Date(a.createdAt)))
            setSortedDisplay(sorted)
            
        }
        else setSortedDisplay(display)

    }, [display])
    return (
        <div className="history-page">
            <h2>History</h2>
            <h4>You have {sortedDisplay?.length} hostorical orders</h4>
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
                            sortedDisplay?.map((item) => (
                                <tr key={item._id}>
                                    <td>{item._id}</td>
                                    <td>{new Date(item.createdAt).toUTCString().substring(0,17)} {new Date(item.createdAt).getHours()}h:{new Date(item.createdAt).getMinutes()}</td>
                                    <td><Link to={`/history/${item._id}`}>View</Link></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
        </div>
    )
}

export default OrderHistory
