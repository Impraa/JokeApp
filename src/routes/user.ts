import express, {Request,Response,NextFunction} from "express";
import UserModel from "../model/user";
import CatchAsync from "../utils/CatchAsync";
import { User } from "../utils/Interfaces";

const router = express.Router();

router.get('/register',(req:Request,res:Response) =>{
    res.render('Users/Register');
})

router.post('/register', CatchAsync(async (req,res) =>{
    const user:User = req.body.user;
    console.log(user);
})) 

export default router;