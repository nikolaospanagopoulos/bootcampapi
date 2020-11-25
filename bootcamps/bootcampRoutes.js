import { create } from 'domain'
import express from 'express'
const router = express.Router()
import {getBootcamp, getBootcamps,createBootcamp,updateBootcamp,deleteBootcamp} from '../controllers/bootcampsController.js'


router.route('/').get(getBootcamps).post(createBootcamp)

router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp)








export default router