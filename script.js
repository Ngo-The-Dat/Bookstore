import { mongoose, dotenv, user, address, product, category, coupon, order, order_details, cart, cart_details, review } from "./import.js"

dotenv.config();
const uri = process.env.URL_MONGODB;
async function connectDB() {
    try {
        await mongoose.connect(uri);
        console.log("connected")
        // delete_all_collection()
    } catch (error) {
        console.log("Error: ", error)
    }
}

async function delete_all_collection() {
    const collections = await mongoose.connection.db.listCollections().toArray()
    for (const { name } of collections) {
        await mongoose.connection.db.dropCollection(name);
        console.log(`Drop collection ${name}`)
    }
}

connectDB()
