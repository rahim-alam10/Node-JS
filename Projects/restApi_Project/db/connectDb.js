import mongoose from "mongoose"

mongoose.set("strictQuery", true)
async function connectDb(url){
    return mongoose.connect(url)
}

export default connectDb;
        


