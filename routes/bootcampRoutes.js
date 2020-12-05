import express from "express";
import coursesRouter from "./coursesRoutes.js";
import reviewRouter from "./reviewRoutes.js";
const router = express.Router();
import {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadious,
  bootcampPhotoUpload,
} from "../controllers/bootcampsController.js";
import advancedResults from "../middleware/advancedResults.js";
import Bootcamp from "../models/bootcampModel.js";
import { protect, authorize } from "../middleware/auth.js";
//route into other resource routes

router.use("/:bootcampId/courses", coursesRouter);
router.use("/:bootcampId/reviews", reviewRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadious);

router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);

export default router;
