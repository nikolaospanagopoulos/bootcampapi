import Bootcamp from "../models/bootcampModel.js";
import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/async.js";
import geocoder from '../utils/geocoder.js'
//GET ALL BOOTCAMPS
// GET api/v1/bootcamps
//public

const getBootcamps = asyncHandler(async (req, res, next) => {
  let query;



  //make it so that select,sort are not matched in our query
   
   const reqQuery = {...req.query}
   //fields to exclude
   const removeFields = ['select','sort','page','limit']
   removeFields.forEach(param => delete reqQuery[param])

  
  let querySrt = JSON.stringify(reqQuery)
  //regex so that we can put $ before mongoose queries
  querySrt = querySrt.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`)


  query = Bootcamp.find(JSON.parse(querySrt))


   //select fields
   if(req.query.select){
     const fields = req.query.select.split(',').join(' ')
     query = query.select(fields)
   }

   //sort
   if(req.query.sort){
     const sortBy = req.query.sort.split(',').join(' ')
     query = query.sort(sortBy)
   }else{
     query = query.sort('-createdAt')
   }

   //pagination
   const page = parseInt(req.query.page,10) || 1;
   const limit = parseInt(req.query.limit,10) || 25; //how many results we want
   const startIndex = (page - 1) * limit
   const endIndex = page * limit
   const total = await Bootcamp.countDocuments()
   query = query.skip(startIndex).limit(limit)



  const bootcamps = await query

  //on the front end we want to see previous and next page only when they exist
  const pagination = {};
   
  if(endIndex < total){
    pagination.next = {   
      page:page+1, 
      limit
    }
  }

  if(startIndex > 0 ){ 
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, pagination,data: bootcamps });
});

//GET one bootcamp
// GET api/v1/bootcamps/:id
//public

const getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  //if the id doesn't exist but is formatted correctly
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id},404`)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

//create one bootcamp
// POST api/v1/bootcamps/
//private
const createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

//update one bootcamp
//PUT api/v1/bootcamps/
//private
const updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true, //we want to get updated data
    runValidators: true,
    useFindAndModify: true,
  }); //the id and what we want to insert
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id},404`)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

//delete one bootcamp
//DELETE api/v1/bootcamps/
//private
const deleteBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id},404`)
    );
  }
  res.status(200).json({ success: true, data: {} });
});


//get bootcamps within a radious
//GET api/v1/bootcamps/radious/:zipcode/:distance
//private
const getBootcampsInRadious = asyncHandler(async (req, res, next) => {
    const {zipcode,distance} = req.params;
    //get long/lat from geocoder
    const loc = await geocoder.geocode(zipcode)
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;
    //calc radious with radians
    //devide distance by radius of earth
    //earth radius = 3,963m
    const radius = distance/3963

    const bootcamps = await Bootcamp.find({
      location:{$geoWithin : {$centerSphere: [[lng,lat],radius]}}
    })
    res.status(200).json({
      success:true,
      coung:bootcamps.length,
      data:bootcamps
    })


  });
  
  export {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadious
  };
  