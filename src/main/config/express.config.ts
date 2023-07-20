import express from "express";
import { userRoutes } from "../../app/features/users/routes/user.routes";
import { coinsRoutes } from "../../app/features/coins/routes/coins.routes";

export const createServer = () => {
    const app = express();
    app.use(express.json());

    app.use("/users", userRoutes);
    app.use("/coins", coinsRoutes);

    return app;
}