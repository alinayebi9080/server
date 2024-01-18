import { Request, Response } from "express";

const index = (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
};

export  {index} ;
