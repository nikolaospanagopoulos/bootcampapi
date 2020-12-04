const advancedResults = (model,populate) => async (req,res,next) => {
    let query;



    //make it so that select,sort are not matched in our query
     
     const reqQuery = {...req.query}
     //fields to exclude
     const removeFields = ['select','sort','page','limit']
     removeFields.forEach(param => delete reqQuery[param])
  
    
    let querySrt = JSON.stringify(reqQuery)
    //regex so that we can put $ before mongoose queries
    querySrt = querySrt.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`)
  
  
    query = model.find(JSON.parse(querySrt))
  
  
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
     const total = await model.countDocuments()
     query = query.skip(startIndex).limit(limit)

  if(populate){
      query = query.populate(populate)
  }
  
  
    const results = await query
  
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
  
    res.advancedResults = {
        success:true,
        count:results.length,
        pagination,
        data:results
    }
    next()
}

export default advancedResults