import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "../../errors/AppError";
import { appEnv } from "../../envs/app.env";

interface IPayload {
  sub: string;
}

export const ensureAuthenticated = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token missing", 401);
  }
  
  const [, token] = authHeader.split(" ");
  
  if (!token) throw new AppError("Token missing!", 401);  
  
  try {
    const { sub: userId } = verify(token, appEnv.key as string) as IPayload;
    req.userId = userId;    

    return next();
  } catch {
    throw new AppError("Invalid token!", 401);
  }
};
