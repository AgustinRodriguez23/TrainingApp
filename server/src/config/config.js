import dotenv from "dotenv"

dotenv.config()

const REQUIRED_ENV_VARS = ['PORT', 'NODE_ENV', 'MONGO_URI', 'JWT_SECRET']

for (const varName of REQUIRED_ENV_VARS) {
    if (!process.env[varName]) {
        throw new Error (`Missing required enviroment variable: ${varName}`)
    }
}

export const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET
}