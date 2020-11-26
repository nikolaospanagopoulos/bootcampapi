import ErrorResponse from '../utils/errorResponse.js'

const errorHandler = (err,req,res,next) => {
    let error = {...err}


    error.message = err.message
//TODO: FIRST CONSOLE.LOG FOR THE DEVELOPER
console.log(err.stack.red)


//mongoose bad object id

if(err.name === 'CastError'){
    const message = `Resource not found with id of ${err.value}`
    error = new ErrorResponse(message,404)
}

//duplicate key error
if(err.code === 11000){
    const message = 'Duplicate field entered'
    error = new ErrorResponse(message,400)
}

//validation error

if(err.name === 'ValidationError'){
    const message = Object.values(err.errors).map(val =>val.message);
    error = new ErrorResponse(message,400)
}

res.status(error.statusCode || 500).json({
    success:false,
    error:error.message || 'Server error'
})
}

export default errorHandler