import mongoose from "mongoose"
import dotenv from 'dotenv'

dotenv.config();
const uri = process.env.URL_MONGODB;
export const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Liên kết CSDL thành công")
        // delete_all_collection()
    } catch (error) {
        console.log("Error: ", error)
    }
}

export const closeDBConnection = async () => {
    try {
        await mongoose.connection.close();
        console.log("Đã ngắt kết nối CSDL");
    } catch (error) {
        console.log("Error: ", error);
    }
};

export const delete_all_collection = async () => {
    const collections = await mongoose.connection.db.listCollections().toArray()
    for (const { name } of collections) {
        await mongoose.connection.db.dropCollection(name);
        console.log(`Drop collection ${name}`)
    }
}