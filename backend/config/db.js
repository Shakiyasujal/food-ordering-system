import mongoose from "mongoose"

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://sujal310:foodie123@cluster0.aglyiwq.mongodb.net/MithoMunch')
        // mongodb+srv://sujal310:foodie123@cluster0.aglyiwq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
        .then(() => console.log('DB CONNECTED'))
}