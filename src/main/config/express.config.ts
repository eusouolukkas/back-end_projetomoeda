import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import cors from "cors";
import { userRoutes } from "../../app/features/users/routes/user.routes";
import { coinsRoutes } from "../../app/features/coins/routes/coins.routes";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../app/errors/AppError";

export const createServer = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.use("/users", userRoutes);
  app.use("/coins", coinsRoutes);

  app.use(
    (err: Error, request: Request, response: Response, next: NextFunction) => {
      if (err instanceof AppError) {
        return response.status(err.statusCode).json({
          message: err.message,
        });
      }
      return response.status(500).json({
        status: "error",
        message: `Internal server error - ${err.message}`,
      });
    }
  );

  return app;
};
