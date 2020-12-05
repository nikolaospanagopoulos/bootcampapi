import express from 'express'
import {addReview, getReview, getReviews} from '../controllers/reviewController.js'
import {protect,authorize} from '../middleware/auth.js'
import advancedResults from '../middleware/advancedResults.js'
import Review from '../models/reviewModel.js'

const router = express.Router({mergeParams:true})

router.route('/').get(advancedResults(Review,{
    path:'bootcamp',
    select:'name description'
}),getReviews).post(protect,authorize('user','admin'),addReview)


router.route('/:id').get(getReview)


export default router