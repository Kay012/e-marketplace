import {useState, useEffect} from 'react'
import axios from 'axios'
// import { GlobalState } from '.././GlobalState'

const ProductsAPI = (token) => {
    // const state = useContext(GlobalState)
    const [products, setProducts] = useState([])
    const [callback, setCallback] = useState(false)
    const [category, setCategory] = useState('')
    const [sort, setSort] = useState('')
    const [search, setSearch] = (useState(''))
    const [page, setPage] = useState(1)
    const [result, setResult] = useState(0)
    const [isLoading,setIsLoading] = useState(false)
    // const [isAdmin] = state.userAPI.isAdmin
    useEffect(() => {
        const getProducts = async () => {
           
            let res;
// ;            if(token){
//                 if(isAdmin){
//                      res = await axios.get(`/api/vendor_products?limit=${page*6}&${category}&${sort}&title[regex]=${search}`,
//                     {headers:{Authorization:token}})
//                 }else{
//                     res = await axios.get(`/api/products?limit=${page*6}&${category}&${sort}&title[regex]=${search}`)
//                 }
//             }else{
            try{
                if(token){
                        res = await axios.get(`/api/vendor_products?limit=${page*6}&${category}&${sort}&title[regex]=${search}`,
                        {headers:{Authorization:token}})
                        setProducts(res.data.products)
                        setResult(res.data.result)

                    setIsLoading(false)
                }
                else{
                    res = await axios.get(`/api/products?limit=${page*6}&${category}&${sort}&title[regex]=${search}`)
                    setProducts(res.data.products)
                    setResult(res.data.result)
                }
            }catch(err){
                return alert(err.response.data.msg)
            }
                
        }
        getProducts()
    }, [callback, category, sort, search, page,token])
    return {
        products: [products, setProducts],
        callback: [callback, setCallback],
        category: [category, setCategory],
        sort: [sort, setSort],
        search: [search, setSearch],
        page: [page, setPage],
        result: [result, setResult]
    }
}

export default ProductsAPI
