import dotenv from 'dotenv'
import path from 'path'
import express from 'express'
dotenv.config({path:"./config/config.env"}) 
import morgan from 'morgan'
import fileupload from 'express-fileupload'
import colors from 'colors'
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'
import connectDB from './config/db.js'
import errorHandler from './middleware/error.js'
import bootcampRoutes from './routes/bootcampRoutes.js'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import courseRoutes from './routes/coursesRoutes.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import rateLimit from 'express-rate-limit'
import hpp from 'hpp'
import cors from 'cors'

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

//sanitize data
app.use(mongoSanitize())


//set security headers
app.use(helmet({ contentSecurityPolicy: false }))


//prevent xss
app.use(xss())
 
//rate limiting
const limiter = rateLimit({
    windowMs:10*60*1000,
    max:100
})

app.use(limiter)


app.use(hpp());
//enable cors
app.use(cors())


//set static folder
const __dirname = path.resolve()
app.use( express.static(path.join(__dirname, 'public')))




app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/bootcamps',bootcampRoutes)
app.use('/api/v1/courses',courseRoutes)
app.use('/api/v1/users',userRoutes)
app.use('/api/v1/reviews',reviewRoutes)
app.use(errorHandler)
const PORT = process.env.PORT || 5000

    const server = app.listen(PORT, ()=>console.log(`server runs on port ${PORT} in ${process.env.NODE_ENV}`.green.bold)) 

    //handle promise rejections

    process.on('unhandledRejection',(err,promise)=>{
        console.log(`error : ${err.message}`.red.bold)
        //close server
        server.close(()=>process.exit(1))
    })