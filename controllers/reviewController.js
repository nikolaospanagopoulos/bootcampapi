import ErrorResponse from '../utils/errorResponse.js'
import asyncHandler from '../middleware/async.js'
import Review from '../models/reviewModel.js'
import Bootcamp from '../models/bootcampModel.js'

//get reviews
//get api/v1/reviews
//get api/v1/bootcamps/:bootcampId/reviews
const getReviews = asyncHandler(async (req,res,next) => {
    
    if(req.params.bootcampId){
        const reviews = await Review.find({bootcamp:req.params.bootcampId})

        return res.status(200).json({
            success:true,
            count:reviews.length,
            data:reviews
        })
    }else{
        res.status(200).json(res.advancedResults)

        }
    
    
})
//get review
//get api/v1/reviews/:id
//public
const getReview = asyncHandler(async (req,res,next) => {
    const review = await Review.findById(req.params.id)
    .populate({
        path:'bootcamp',
        select:'name description'
    })

    if(!review){
        return next(new ErrorResponse(`No review found with the id of ${req.params.id}`,404))
    }

    res.status(200).json({
        success:true,
        data:review
    })
})



//add review
//post api/v1/bootcamp/:bootcampId/reviews
//public
const addReview = asyncHandler(async (req,res,next) => {
     req.body.bootcamp = req.params.bootcampId
     req.body.user = req.user.id

     const bootcamp = await Bootcamp.findById(req.params.bootcampId)

     if(!bootcamp){
         next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`,404))
     }

    const review = await Review.create(req.body) 

    res.status(201).json({
        success:true,
        data:review
    })
})



//update review
//put api/v1/reviews/:id
//public
const updateReview = asyncHandler(async (req,res,next) => {
    

    let review = await Review.findById(req.params.id)

    if(!review){
        return next(new ErrorResponse(`No review with the id of ${req.params.id}`,404))
    }

    //make sure review belongs to user or user is admin

    if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`Not authorized to  update the review`,401))
    }


    review = await Review.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })


   res.status(200).json({
       success:true,
       data:review
   })
})



//delete review
//delete api/v1/reviews/:id
//public
const deleteReview = asyncHandler(async (req,res,next) => {
    

    const review = await Review.findById(req.params.id)

    if(!review){
        return next(new ErrorResponse(`No review with the id of ${req.params.id}`,404))
    }

    //make sure review belongs to user or user is admin

    if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`Not authorized to  update the review`,401))
    }


    await review.remove()


   res.status(200).json({
       success:true,
       data:{}
   })
})


export {getReviews,getReview,addReview,updateReview,deleteReview} 