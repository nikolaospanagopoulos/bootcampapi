
//GET ALL BOOTCAMPS
// GET api/v1/bootcamps
//public

const getBootcamps = (req,res,next) => {
    res.status(200)
    .json({success:true,msg:'show all bootcamps'})
}



//GET one bootcamp
// GET api/v1/bootcamps/:id
//public

const getBootcamp = (req,res,next) => {
    res.status(200).json({success:true,msg:`display bootcamp ${req.params.id}`}
)}

//create one bootcamp
// POST api/v1/bootcamps/
//private
const createBootcamp = (req,res,next) => {
    res.status(200).json({success:true,msg:`create bootcamp `}    
)}

//update one bootcamp
//PUT api/v1/bootcamps/
//private
const updateBootcamp = (req,res,next) => {
    res.status(200).json({success:true,msg:`update bootcamp ${req.params.id}`}    
)}

//delete one bootcamp
//DELETE api/v1/bootcamps/
//private
const deleteBootcamp = (req,res,next) => {
    res.status(200).json({success:true,msg:`delete bootcamp ${req.params.id}`})
}

export {getBootcamps,getBootcamp,createBootcamp,updateBootcamp,deleteBootcamp}