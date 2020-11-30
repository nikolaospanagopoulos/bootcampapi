import { create } from 'domain'
import express from 'express'
import coursesRouter from '../courses/coursesRoutes.js'
const router = express.Router()
import {getBootcamp, getBootcamps,createBootcamp,updateBootcamp,deleteBootcamp,getBootcampsInRadious,bootcampPhotoUpload} from '../controllers/bootcampsController.js'

//route into other resource routes

router.use('/:bootcampId/courses',coursesRouter)

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadious) 

router.route('/:id/photo').put(bootcampPhotoUpload)

router.route('/').get(getBootcamps).post(createBootcamp)

router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp)







 
export default router  