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


export {getReviews,getReview}