import mongoose from 'mongoose'

// Connect to the MongoDB database

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('Database Connected'))
        await mongoose.connect(`${process.env.MONGODB_URI}/lms`)
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
}
export default connectDB