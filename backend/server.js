const express=require('express')

require('dotenv').config()
require('./db/connection')
const bodyParser=require('body-parser')
const morgan = require('morgan')

const testRoute=require('./routes/testRoute')
const userRoute=require('./routes/registerRoute')
const empRoute=require('./routes/employeeRoute')
const attRoute=require('./routes/attendanceRoute')
const leaveRoute=require('./routes/leaveRequestRoute')
const reportRoute=require('./routes/reportRoute')
const cors=require('cors');


const app=express()


// app.get('/test',(req,res)=>{
//     res.send("this is an api server")
// })


//middleware
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use('/public/uploads',express.static('public/uploads'))
app.use(cors({ origin: 'http://localhost:3000' }));

//routes
app.use('/api',testRoute)
app.use('/api',userRoute)
app.use('/api',empRoute)
app.use('/api',attRoute)
app.use('/api',leaveRoute)
app.use('/api',reportRoute)


port=process.env.PORT || 8000

app.listen(port,()=>{
    console.log(`app is started at port ${port}`)
})