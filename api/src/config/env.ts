import dotenv from 'dotenv'
dotenv.config()

export const CONFIG = {
    PORT: Number(process.env.PORT) || 7700,
    JWT_SECRET: String(process.env.JWT_SECRET),
    DB:{
        HOST: process.env.DB_HOST,
        USER: process.env.DB_USER,
        PASSWORD: process.env.DB_PASSWORD,
        DATABASE: process.env.DB_NAME,
    }
}