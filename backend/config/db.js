import mongoose from "mongoose"

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://sujal310:foodie123@cluster0.aglyiwq.mongodb.net/MithoMunch')
        .then(() => console.log('DB CONNECTED'))
}