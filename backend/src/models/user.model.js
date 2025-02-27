import mongoose, { mongo } from 'mongoose'

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    profileImage:{
        type: String,
        default: ""
    },
    // team:{
    //     type: String,
    //     required: true
    // },
    // teamId:{
    //     type: String,
    //     required: true,
    //     minlength: 3,
    //     maxlength: 4 
    // }
},{timestamps: true})

const User = mongoose.model('User', userSchema)
export default User