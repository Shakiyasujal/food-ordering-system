import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    hearts: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    imageUrl: { type: String },
    totalSold: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

export default mongoose.model('Item', itemSchema)