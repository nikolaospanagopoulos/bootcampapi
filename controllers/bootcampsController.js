import Bootcamp from "../models/bootcampModel.js";
import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/async.js";

//GET ALL BOOTCAMPS
// GET api/v1/bootcamps
//public

const getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
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

export {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
};
