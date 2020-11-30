import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import mongoose from 'mongoose'
import colors from 'colors'
import dotenv from 'dotenv'
import Bootcamp from './models/bootcampModel.js'
import Course from './models/courseModel.js'
//load env variables
dotenv.config({path:'./config/config.env'})


//connect to database
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:true,
    useUnifiedTopology:true
})

//read json files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'))
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'))
//import into db

const importData = async () => {
    try{
        await Bootcamp.create(bootcamps)
        await Course.create(courses)
        console.log('data imported'.blue.inverse)
    }catch(err){
        console.error(err)
    }
}

//delete data
const deleteData = async () => {
    try{
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        console.log('data destroyed'.red.inverse)
    }catch(err){
        console.error(err)
    }
}

if(process.argv[2] === '-i'){
    importData()
}else if(process.argv[2] === '-d'){
    deleteData()
}