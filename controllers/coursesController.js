import ErrorResponse from '../utils/errorResponse.js'
import asyncHandler from '../middleware/async.js'
import Course from '../models/courseModel.js'
import Bootcamp from '../models/bootcampModel.js'
//get courses 
//get api/v1/courses
//get api/v1/bootcamps/:bootcampId/courses

const getCourses = asyncHandler(async (req,res,next) => {
    
    if(req.params.bootcampId){
        const courses = await Course.find({bootcamp:req.params.bootcampId})

        return res.status(200).json({
            success:true,
            count:courses.length,
            data:courses
        })
    }else{
        res.status(200).json(res.advancedResults)

        }
    
    
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
    req.body.user = req.user.id;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if (!bootcamp){
        return next(new ErrorResponse(`no bootcamp with the id of ${req.params.bootcampId}`),404)
    }

    if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(
          new ErrorResponse(`User : ${req.user.id} is not authorized to create a course to bootcamp : ${bootcamp._id}`,401)
        );
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

    if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(
          new ErrorResponse(`User : ${req.user.id} is not authorized to update the course : ${course._id}`,401)
        );
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
 
     if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(
          new ErrorResponse(`User : ${req.user.id} is not authorized to delete the course : ${course._id}`,401)
        );
      }

     await course.remove()
 
     res.status(200).json({
         success:true,
         
         data:{}
     })
 })
export {getCourses,getCourse,createCourse,updateCourse,deleteCourse}