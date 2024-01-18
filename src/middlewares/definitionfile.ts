import { Request } from "express";
import { IUser } from "../models/UserModel";
export interface IGetUserAuthInfoRequest extends Request {
  user: IUser; // or any other type
}
