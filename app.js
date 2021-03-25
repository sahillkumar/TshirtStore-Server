const mongoose = require("mongoose")
const express = require ("express")
const cors = require ("cors")
const bodyParser = require ("body-parser")
const cookieParser = require ("cookie-parser")
require('dotenv').config()

const app = express()

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const orderRoutes = require('./routes/order')
const paymentRoutes = require('./routes/payment')


//Database connection
mongoose.connect(process.env.DATABASE,
        {useNewUrlParser: true,useCreateIndex:true})
         .then(()=>{
             console.log("Db connected Successfully !!");
         })
         .catch(err=>{
             console.log("err is "+err)
         })

//Middlewares
app.use(bodyParser.json())
app.use(cors())
app.use(cookieParser())


// Routes
app.get("/",(req,res)=>{
    res.send("home page")
})

app.use('/api',authRoutes)
app.use('/api',userRoutes)
app.use('/api',categoryRoutes)
app.use('/api',productRoutes)
app.use('/api',orderRoutes)
app.use('/api',paymentRoutes)

const port = 8000 || process.env.PORT

 
// Starting a server
app.listen(port,()=>{
    console.log(`db successfully running at port ${port}`)
})
