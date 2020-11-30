import ErrorResponse from '../utils/errorResponse.js'
import asyncHandler from '../middleware/async.js'
import Course from '../models/courseModel.js'
import Bootcamp from '../models/bootcampModel.js'
//get courses 
//get api/v1/courses
//get api/v1/bootcamps/:bootcampId/courses

const getCourses = asyncHandler(async (req,res,next) => {
    let query;
    if(req.params.bootcampId){
        query = Course.find({bootcamp:req.params.bootcampId})
    }else{
        query = Course.find().populate({
            path:'bootcamp',
            select:'name description'

        })
    }
    const courses = await query

    res.status(200).json({
        success:true,
        count:courses.length,
        data:courses
    })
})

//get one course
//get api/v1/courses/:id
//get api/v1/bootcamps/:bootcampId/courses

const getCourse = asyncHandler(async (req,res,next) => {
    const course = await Course.findById(req.params.id).populate({
        path:'bootcamp',
        select:'name description'
    })

    if (!course){
        return next(new ErrorResponse(`no course with the id of ${req.params.id}`),404)
    }
    res.status(200).json({
        success:true,
        
        data:course
    })
})


//add one course
//post api/v1/bootcamps/:bootcampId/courses
//private

const createCourse = asyncHandler(async (req,res,next) => {
    req.body.bootcamp = req.params.bootcampId;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if (!bootcamp){
        return next(new ErrorResponse(`no bootcamp with the id of ${req.params.bootcampId}`),404)
    }

    const course = await Course.create(req.body)

    res.status(200).json({
        success:true,
        
        data:course
    })
})

//update course
//put api/v1/courses/:id
//private

const updateCourse = asyncHandler(async (req,res,next) => {
   
   let course = await Course.findById(req.params.id)

    if (!course){
        return next(new ErrorResponse(`no course with the id of ${req.params.id}`),404)
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body,{
        new:true,
        runValidators:true
    })

    res.status(200).json({
        success:true,
        
        data:course
    })
})


//delete course
//put api/v1/courses/:id
//private

const deleteCourse = asyncHandler(async (req,res,next) => {
   
    let course = await Course.findById(req.params.id)
 
     if (!course){
         return next(new ErrorResponse(`no course with the id of ${req.params.id}`),404)
     }
 
     await course.remove()
 
     res.status(200).json({
         success:true,
         
         data:{}
     })
 })
export {getCourses,getCourse,createCourse,updateCourse,deleteCourse}