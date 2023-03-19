import { Request, Response, NextFunction } from "express";

const CatchAsync = (func: (req: Request, res: Response, next?: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response,  next?: NextFunction) => {
    func(req, res, next).catch(next);
  };
};

export default CatchAsync;