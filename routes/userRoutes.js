import express from 'express'
import {getUsers,getUser,updateUser,deleteUser,createUser} from '../controllers/userController.js'
import User from '../models/userModel.js'
import {protect,authorize} from '../middleware/auth.js'
import advancedResults from '../middleware/advancedResults.js'

const router = express.Router({mergeParams:true})


router.use(protect)
router.use(authorize('admin'))

router.route('/')
.get(advancedResults(User),getUsers)
.post(createUser)


router.route('/:id')
.get(getUser)
.put(updateUser)
.delete(deleteUser)

export default router