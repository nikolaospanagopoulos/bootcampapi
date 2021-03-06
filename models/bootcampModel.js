import mongoose from 'mongoose'
import slugify from 'slugify'
import geocoder from '../utils/geocoder.js'
const BootcampSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please add a name'],
        unique:true,
        trim:true,
        maxlength:[50, 'Name cannot be more than 50 characters']
    },
    slug:String,
    description:{
        type:String,
        required:[true,'please add a description'],
        maxlength:[500, 'Description cannot be more than 50 characters']
    },
    website:{
        type:String,
        match:[
           /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
           'Please enter a valid url with http or https'
        ]
    },
    phone:{
        type:String,
        maxlength:[20,'A phone number cannot be more than 20 characters']
    },
    email:{
        type:String,
        match:[
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'please add a valid email address'
        ]
    },
    address:{
        type:String,
        required:[true,'Please add an address']
    },
    location:{
        type:{
            type:String,
            enum:['Point']
        },
        coordinates:{
            type:[Number],
            index:'2dshpere'
        },
        formattedAddress:String,
        street:String,
        city:String,
        state:String,
        zipcode:String,
        country:String
    },
    careers:{  
        //array of strings
        type:[String],
        required:true, 
        enum:[   //only available values it can have
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating:{
        type:Number,
        min:[1,'Rating must be at least 1'],
        max:[10,'Rating cannot be more than 10']
    },
    averageCost:Number,
    photo:{
        type:String,
        default:'no-photo.jpg'
    },
    housing:{
        type:Boolean,
        default:false
    },
    jobAssistance:{
        type:Boolean,
        default:false
    },
    jobGuarantee:{
        type:Boolean,
        default:false
    },
    acceptGi:{
        type:Boolean, 
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    }

},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
 


//create bootcamp slug from the name


BootcampSchema.pre('save',function(next){
    this.slug = slugify(this.name,{lower:true})
    next()
}),
//geocode and creae location field

BootcampSchema.pre('save',async function(next){
    const loc = await geocoder.geocode(this.address)
    this.location = {
        type:'Point',
        coordinates: [loc[0].longitude,loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street:loc[0].streetName,
        city:loc[0].city,
        state:loc[0].stateCode,
        zipcode:loc[0].zipcode,
        country:loc[0].countryCode,
    }
    //Do not save address in the database
    this.address = undefined;
    next()
})


//cascade delete all the courses of a bootcamp when the bootcamp is deleted
BootcampSchema.pre('remove',async function (next){
    await this.model('Course').deleteMany({bootcamp:this._id})
    next()
})


//populate with virtual courses for each bootcamp
BootcampSchema.virtual('courses',{
    ref:'Course',  //referrence to model
    localField:'_id',
    foreignField:'bootcamp', //where we want to write this
    justOne:false
})

const Bootcamp = mongoose.model('Bootcamp',BootcampSchema)

export default Bootcamp