import express from 'express'
import {getReview, getReviews} from '../controllers/reviewController.js'
import {protect,authorize} from '../middleware/auth.js'
import advancedResults from '../middleware/advancedResults.js'
import Review from '../models/reviewModel.js'

const router = express.Router({mergeParams:true})

router.route('/').get(advancedResults(Review,{
    path:'bootcamp',
    select:'name description'
}),getReviews)


router.route('/:id').get(getReview)


export default router