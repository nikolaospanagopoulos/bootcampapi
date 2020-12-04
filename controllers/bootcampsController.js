import Bootcamp from "../models/bootcampModel.js";
import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/async.js";
import geocoder from "../utils/geocoder.js";
import path from "path";
//GET ALL BOOTCAMPS
// GET api/v1/bootcamps
//public

const getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
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
  //add user to req.body
  req.body.user = req.user.id;

  //checked for published bootcamp by user

  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  //if user is not admin they only add one bootcamp
  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `The user with id ${req.user.id} has already published a bootcamp`,
        400
      )
    );
  }

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
  let bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id},404`)
    );
  }

  //make sure user is bootcamp owner

  if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(
      new ErrorResponse(`User : ${req.params.id} is not authorized to update this bootcamp`,401)
    );
  }
  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
    new:true,
    runValidators:true,

  })

  res.status(200).json({ success: true, data: bootcamp });
});



//delete one bootcamp
//DELETE api/v1/bootcamps/
//private
const deleteBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id},404`)
    );
  }

  //make sure user is bootcamp owner

  if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(
      new ErrorResponse(`User : ${req.params.id} is not authorized to delete this bootcamp`,401)
    );
  }
  bootcamp.remove();
  res.status(200).json({ success: true, data: {} });
});





//upload photo for bootcamp
//put api/v1/bootcamps/:id/photo
//private
const bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id},404`)
    );
  }

  //make sure user is bootcamp owner

  if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(
      new ErrorResponse(`User : ${req.params.id} is not authorized to delete this bootcamp`,401)
    );
  }
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  const file = req.files.file;

  //make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image`, 400));
  }

  //CHECK FILESIZE
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image with a size smaller than ${process.env.MAX_FILE_UPLOAD},400`
      )
    );
  }

  //CREATE CUSTOM FILE NAME
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  console.log(file.name);

  //UPLOAD FILE

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload,500`));
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

//get bootcamps within a radious
//GET api/v1/bootcamps/radious/:zipcode/:distance
//private
const getBootcampsInRadious = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  //get long/lat from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;
  //calc radious with radians
  //devide distance by radius of earth
  //earth radius = 3,963m
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    success: true,
    coung: bootcamps.length,
    data: bootcamps,
  });
});

export {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadious,
  bootcampPhotoUpload,
};
