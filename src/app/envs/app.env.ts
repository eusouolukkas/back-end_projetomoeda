import "dotenv/config";

export const appEnv = {
    port: process.env.PORT,
    url: process.env.MONGO_URL,
    key: process.env.SECRET_KEY,
}