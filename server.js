const http = require('http')
require('dotenv').config()
const express = require('express')
const {Server} = require('socket.io')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const path = require('path')



//configuring app
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
    useTempFiles: true
}))

//Routes
app.use('/user', require('./routes/userRouter'))
app.use('/api', require('./routes/categoryRouter'))
app.use('/api', require('./routes/upload'))
app.use('/api', require('./routes/productRouter'))
app.use('/api', require('./routes/paymentRouter'))

//connecting to mongodb
//password = feHEPcGAmF3yAANA
const server = http.createServer(app)
const io = new Server(server,{
    cors:{
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

let users =[]

const addUser = (userId, socketId) => {
    !users.some(user => user.userId === userId) &&
    users.push({userId, socketId})
}

const removeUser = (socketId) => {
    
    users = users.filter(user => user.socketId !== socketId)
}

const getUser = (userId) => {
    return users.find(user => user.userId === userId)
}


io.on('connection', (socket) => {
    console.log(`User connected ,${socket.id}`)
    
    socket.on('addUser', userId => {
        addUser(userId, socket.id)
        console.log(`user added, ${userId}`)
        // console.log(users)
        io.emit('getUsers', users)
    })
    // io.emit('getUsers', users)

    socket.on('sendNewOrder', (vendors)=>{
       console.log("Sending orders", vendors)
        vendors.forEach(vendor => {
            const user = getUser(vendor)
            if(user)
            {
                io.to(user.socketId).emit("getNewOrder")
            }
        })
    })

    socket.on('disconnect',() => {
            removeUser(socket.id)
            console.log(`user removed, ${socket.id}`)
            // io.emit('getUsers', users)
            // console.log(users)
        })

    

})
    

const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true    
}, err => {
    if (err) throw err;
    else console.log('Connected to MongoDB')
})

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*', (req,res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log('Server running on port ', PORT)
})