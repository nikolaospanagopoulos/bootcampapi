import Bootcamp from '../models/bootcampModel.js'
import ErrorResponse from '../utils/errorResponse.js'


//GET ALL BOOTCAMPS
// GET api/v1/bootcamps
//public

const getBootcamps = async (req,res,next) => {
    try{
        const bootcamps = await Bootcamp.find()
        res.status(200).json({success:true,count:bootcamps.length,data:bootcamps})
    }catch(err){
        next(err)
    }
}



//GET one bootcamp
// GET api/v1/bootcamps/:id
//public

const getBootcamp = async(req,res,next) => {
    try{
        const bootcamp = await Bootcamp.findById(req.params.id)
        //if the id doesn't exist but is formatted correctly
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id},404`))
        }

        res.status(200).json({success:true,data:bootcamp})
    }catch(err){
        //res.status(400).json({success:false})
        next(err)
    }
    
}

//create one bootcamp
// POST api/v1/bootcamps/
//private
const createBootcamp = async(req,res,next) => {

    try{
        const bootcamp = await Bootcamp.create(req.body)
        res.status(201).json({
        success:true,
        data:bootcamp})
    }catch(err){
        next(err)
    }


    
    
}

//update one bootcamp
//PUT api/v1/bootcamps/
//private
const updateBootcamp = async (req,res,next) => {
    try{
        let bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
            new:true, //we want to get updated data
            runValidators:true,
            useFindAndModify:true
        })//the id and what we want to insert
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id},404`))
        }
        res.status(200).json({success:true,data:bootcamp})
    }catch(err){
        next(err)
    }
    
}

//delete one bootcamp
//DELETE api/v1/bootcamps/
//private
const deleteBootcamp = async(req,res,next) => {
    try{
        let bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id},404`))
        }
        res.status(200).json({success:true,data:{}})
    }catch(err){
        next(err)  
    }
    
}

export {getBootcamps,getBootcamp,createBootcamp,updateBootcamp,deleteBootcamp}