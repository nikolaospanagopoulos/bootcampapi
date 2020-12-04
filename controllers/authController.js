import User from "../models/userModel.js";
import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/async.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto'
// register user
// post /api/v1/auth/register
//public access

const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  //create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  //CREATE TOKEN
  sendTokenResponse(user, 200, res);
});

// login user
// post /api/v1/auth/login
//public access

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //validate email and password

  if (!email || !password) {
    return next(new ErrorResponse(`Please provide an email and a password`));
  }

  //check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  //check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(user, 200, res);
});

//get the current logged in user

//api/v1/auth/me

//private

const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});


//update password

// put api/v1/auth/updatepassword

//private

const updatePassword = asyncHandler(async (req, res, next) => {
    const user =await User.findById(req.user.id).select('+password');

    //check current password
    if(!(user.matchPassword(req.body.currentPassword))){
        return next(new ErrorResponse('Password is incorrect',401))
    }
    user.password = req.body.newPassword
    await user.save()


    sendTokenResponse(user,200,res)
  });
  
  

//update user details

//put  //api/v1/auth/me

//private

const updateDetails = asyncHandler(async (req, res, next) => {

    const fieldsToUpdate = {
        name:req.body.name,
        email:req.body.email
    }



    const user = await User.findByIdAndUpdate(req.user.id,fieldsToUpdate,{
        new:true,
        runValidators:true
    });
    res.status(200).json({
      success: true,
      data: user,
    });
  });
  


//forgot password

//api/v1/auth/forgotpassword

//provate

const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("there is no user with that email", 404));
  }

  //get reset password token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  //create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `you are receiving this email because you have requested the reset of a password. please make a put request to : \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("email could not be sent", 500));
  }
});




//reset password

//api/v1/auth/resetpassword.:resettoken

//public
const resetPassword = asyncHandler(async (req, res, next) => {
    //get hashed token
    const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    });

    if(!user){
        return next(new ErrorResponse('Invalid token',400))
    }

    //set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save()

    sendTokenResponse(user, 200, res)
  });
  




//get token from model, create cookie and send response

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
export { register, login, getMe, forgotPassword,resetPassword,updateDetails,updatePassword };
