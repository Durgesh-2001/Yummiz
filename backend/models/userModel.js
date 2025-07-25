import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {type: String,required: true},
    email: {type: String,required: true,unique: true},
    password: {type: String,required: true},
    mobile: {type: String,unique: true},  // Added mobile field
    otp: {type: String},  // Added OTP field
    otpExpiry: {type: Date}  // Added OTP expiry field
})

const userModel = mongoose.model('User', userSchema);
export default userModel;