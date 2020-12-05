import jwt from 'jsonwebtoken'
import asyncHandler from './async.js'
import ErrorResponse from '../utils/errorResponse.js'
import User from '../models/userModel.js'

//protect routes

const protect = asyncHandler(async(req,res,next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }else if(req.cookies.token){
        token = req.cookies.token
    }

//make sure token exists
if(!token){
    return next(new ErrorResponse('you are not authorized to access this route',401))
}
   try{
       const decoded = jwt.verify(token,process.env.JWT_SECRET)
       console.log(decoded)

       req.user = await User.findById(decoded.id)
       next()
   }catch(err){
    return next(new ErrorResponse('you are not authorized to access this route',401))
   } 
})


//GRANT ACCESS TO SPECIFIC ROLES

const authorize = (...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorResponse(`user role ${req.user.role} is not authorized to access this route`,403))
        }
        next()
    }
}


export {protect,authorize}