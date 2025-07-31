import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
}, {timestamps:true});     // timestamps is used to capture the time of creation of user and the time of update of the user. it will add these 2 details

const user = mongoose.model("User", userSchema);

export default user;