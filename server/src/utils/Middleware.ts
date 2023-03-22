import {Response,NextFunction} from "express";

import Jwt from 'jsonwebtoken';
import { ExpressError } from './ExpressError';
import { User, UserRequest } from "./Interfaces";

export const userAuth = (req:UserRequest,res:Response,next:NextFunction) =>{

    const token = req.cookies.token;

    try {
        const user = Jwt.verify(token,"ChuckNorris") as User;
        req.user = user;
        next();
    } catch (err) {
        res.clearCookie('token');
        return next(new ExpressError('User not recognized', 403));
    }

} 