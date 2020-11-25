import mongoose from 'mongoose';


const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useCreateIndex:true,
        useFindAndModify:true,
        useUnifiedTopology:true
    })
    console.log(`mongoDB connected: ${conn.connection.host}`.cyan.underline.bold)
}

export default connectDB