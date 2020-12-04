import dotenv from 'dotenv'
import path from 'path'
import express from 'express'
dotenv.config({path:"./config/config.env"}) 
import morgan from 'morgan'
import fileupload from 'express-fileupload'
import colors from 'colors'
import connectDB from './config/db.js'
import errorHandler from './middleware/error.js'
import bootcampRoutes from './routes/bootcampRoutes.js'
import cookieParser from 'cookie-parser'
import courseRoutes from './routes/coursesRoutes.js'
import authRoutes from './routes/authRoutes.js'

const app=express()

//body parser
app.use(express.json())  
connectDB()


//cookie parser
app.use(cookieParser())


//dev logging middleware

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}



app.use(fileupload())

//set static folder
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))




app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/bootcamps',bootcampRoutes)
app.use('/api/v1/courses',courseRoutes)
app.use(errorHandler)
const PORT = process.env.PORT || 5000

    const server = app.listen(PORT, ()=>console.log(`server runs on port ${PORT} in ${process.env.NODE_ENV}`.green.bold)) 

    //handle promise rejections

    process.on('unhandledRejection',(err,promise)=>{
        console.log(`error : ${err.message}`.red.bold)
        //close server
        server.close(()=>process.exit(1))
    })