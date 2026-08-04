import mongoose from "mongoose"

mongoose.set("strictQuery", true)
async function connectDb(url){
    try {
        return mongoose.connect(url)
            .then(console.log("MongoDb Connected Successfully..."))
    } catch (error) {
        console.log("Database Connection Error ", error)
    }
}

export default connectDb;