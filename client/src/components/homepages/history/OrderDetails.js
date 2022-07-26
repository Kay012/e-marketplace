import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { GlobalState } from '../../../GlobalState'

const OrderDetails = () => {
    const state = useContext(GlobalState)
    const [history] = state.userAPI.history
    const [isAdmin] = state.userAPI.isAdmin
    const [userId] = state.userAPI.userId
    const [orderDetails, setOrderDetails] = useState([])
    const [orderItems, setOrderItems] = useState([])
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [total, setTotal] = useState(0.0)
    const params = useParams()

    useEffect(() => {
        const access = (item) => {
            let q = 0;
            let t = 0;
            let toDisplay = [];
            if(isAdmin){
                item.items.forEach(item =>{
                    if(item.vendorId === userId){
                        q  += item.quantity;
                        t += (item.price * item.quantity);
                        toDisplay.push(item)
                    }
                    
                    
                })
            }else{
                item.items.forEach(item =>{
                    q  += item.quantity;
                    t += (item.price * item.quantity);
                    toDisplay.push(item)
                    
                })
            }
            
            
            setTotalQuantity(q)
            setTotal(t)
            setOrderItems(toDisplay)
        }
        if(params.id){
            history.forEach(item => {
                // console.log(item)
                
                if(item._id === params.id) {
                    setOrderDetails(item)
                    access(item)
                    
                    // let q = 0;
                    // let t = 0
                    // item.items.forEach(item =>{
                    //     q  += item.quantity;
                    //     t += (item.price * item.quantity);
                        
                    // })
                    // setOrderDetails(item)
                    // setTotalQuantity(q)
                    // setTotal(t)
                    // setOrderItems(item.items)
                }
            });
        }
    }, [params, orderDetails, history, isAdmin, userId])



    if(orderDetails.length === 0)  return <div>Ke di Shit</div>
    return (
        <div className='history-page'>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        {/* <th>Postal Code</th> */}
                        <th>Order Time</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                            {/* <td>{orderDetails.address.recipient_name}</td>
                            <td>{orderDetails.address.line1 + " - " + orderDetails.address.city}</td>
                            <td>{orderDetails.address.postal_code}</td>
                            <td>{orderDetails.address.country_code}</td> */}
                            <td>{orderDetails.customerName}</td>
                            <td>{orderDetails.deliveryAddress}</td>
                            {/* <td>{orderDetails.address.postal_code}</td> */}
                            <td>{new Date(orderDetails.createdAt).toUTCString().substring(0,17)} {new Date(orderDetails.createdAt).getHours()}h:{new Date(orderDetails.createdAt).getMinutes()}</td>
                    </tr>
                </tbody>
            </table>


            <table style={{margin: '30px 0px'}}>
                <thead>
                    <tr>
                        <th></th>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        orderItems.map(item => (
                            // setTotalQuantity(state => state + item.quantity)
                            // setTotal(total => total + (item.price * item.quantity))
                            <tr key={item._id}>
                                <td>{<img src ={item.imageUrl} alt='' />}</td>
                                <td>{item.title}</td>
                                <td>{item.quantity}</td>
                                <td>R {item.price}</td>
                            </tr>
                                                
                        ))  
                    }
                    <tr>
                        <td><b>Totals</b></td>
                        <td></td>
                        <td><b>{totalQuantity}</b></td>
                        <td><b>R {total}</b></td>
                    </tr>
                    
                </tbody>
            </table>

        </div>
    )
}

export default OrderDetails
