import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/async.js";
import User from '../models/userModel.js'


// get all users
// get /api/v1/auth/users
//private

const getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)
  
   
  });
  


  // get one user
// get /api/v1/auth/users/:id
//private

const getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id)  
  
    res.status(200).json({
        success:true,
        data:user
    })
  });
  

  
//create user
// post /api/v1/auth/users
//private

const createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body)  
  
    res.status(201).json({
        success:true,
        data:user
    })
  });
  


//update user
// put /api/v1/auth/users/:id
//private

const updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })  
  
    res.status(200).json({
        success:true,
        data:user
    })
  });
  


  
//delete user
// put /api/v1/auth/users/:id
//private

const deleteUser = asyncHandler(async (req, res, next) => {
     await User.findByIdAndDelete(req.params.id)  
  
    res.status(200).json({
        success:true,
        data:{}
    })
  });
  

  export {getUsers,getUser,createUser,updateUser,deleteUser}