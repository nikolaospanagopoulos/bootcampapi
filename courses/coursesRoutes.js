import express from 'express'
import {getCourses,getCourse,createCourse, updateCourse, deleteCourse} from '../controllers/coursesController.js'

//include other resource routers



const router = express.Router({mergeParams:true})

router.route('/').get(getCourses).post(createCourse)
router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse)


export default router