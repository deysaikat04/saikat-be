import { NextFunction, Request, Response } from "express";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";

export const SECRET_KEY: Secret = process.env.JWT_SECRET || "";

export interface CustomRequest extends Request {
  user: string | JwtPayload;
}

export function auth(req: Request, res: Response, next: NextFunction) {
  // Get token from header
  const token = (
    req.header("authorization") || req.header("Authorization")
  )?.split(" ")[1];
  // Check if not token
  if (!token) {
    return res
      .status(401)
      .json({ error: { message: "No token, authorization denied!" } });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded) {
      res.locals.user = decoded;
    }
    return next();
  } catch (err) {
    console.error("Something wrong with auth middleware");
    res.status(500).json({ msg: "Error while decoding token" });
  }
}
