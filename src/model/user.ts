import mongoose, { Model } from "mongoose";
import { User } from "../utils/Interfaces";

const Schema = mongoose.Schema;

const userSchema = new Schema<User>({
    fName:{
        type:String,
        required:true,
    },
    lName:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    }
})

const UserModel: Model<User> = mongoose.model<User>('User', userSchema);

export default UserModel;