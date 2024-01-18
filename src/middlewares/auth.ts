import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/UserModel";
import TokenBlackList from "../models/tokenBlackList";
import { IGetUserAuthInfoRequest } from "./definitionfile";

export const isLoggedIn = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token = req.header("x-auth-token");

  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  // Check for the "Bearer " prefix and remove it
  const bearerPrefix = "Bearer ";
  if (token.startsWith(bearerPrefix)) {
    token = token.slice(bearerPrefix.length);
  }

  try {
    const findToken = await TokenBlackList.findOne({ token });

    if (findToken) {
      res
        .status(401)
        .json({ error: "Access denied. Token has been blacklisted." });
      return;
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({ error: "Invalid token. User not found!" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
};

export const isAdmin = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user?.isAdmin) {
    console.log(req);
    res.status(403).json({ error: "ACCESS DENIED! Admin permission needed." });
    return;
  }

  next();
};

// export const checkSuspended = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<Response<any, Record<string, any>>> => {
//   try {
//     console.log(req)
//     if (!req.user || !req.user._id) {
//       // User is not authenticated
//       return res.status(401).json({
//         error: 'Unauthorized',
//         message: 'User not authenticated',
//       });
//     }

//     // Check user suspension status
//     const foundUser = await User.findById(req.user._id);

//     if (!foundUser || foundUser.suspended) {
//       // User is suspended or not found
//       return res.status(403).json({
//         error: 'Forbidden',
//         message: 'User account is suspended',
//       });
//     }

//     // User is not suspended, proceed to the next middleware or route handler
//     next();

//     // Return a resolved promise with a default response
//     return Promise.resolve(res.status(200).json({
//       message: 'User is not suspended',
//     }));
//   } catch (error) {
//     // Handle other errors gracefully
//     console.error('Error checking user suspension:', error);
//     return res.status(500).json({
//       error: 'Internal Server Error',
//       message: 'An unexpected error occurred',
//     });
//   }
// };
