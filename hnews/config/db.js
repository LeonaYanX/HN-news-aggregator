const mongoose = require('mongoose');

const connectDb = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB connected succesfully.');
    }catch(err){
        console.error('DB connection failed', err);
        process.exit(1);
    }
}

module.exports = connectDb;