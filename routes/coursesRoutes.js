import express from 'express'
import {getCourses,getCourse,createCourse, updateCourse, deleteCourse} from '../controllers/coursesController.js'
import Course from '../models/courseModel.js'
import advancedResults from '../middleware/advancedResults.js'
import {protect,authorize} from '../middleware/auth.js'

//include other resource routers



const router = express.Router({mergeParams:true})

router.route('/').get(advancedResults(Course,{
    path:'bootcamp',
    select:'name description'
}),getCourses).post(protect,authorize('publisher','admin'),createCourse)
router.route('/:id').get(getCourse).put(protect,authorize('publisher','admin'),updateCourse).delete(protect,authorize('publisher','admin'),deleteCourse)


export default router