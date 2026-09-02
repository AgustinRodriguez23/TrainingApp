import express from "express"
import cors from "cors"

import { requireAuth } from "./middlewares/auth.middleware.js";
import { connectDB } from "./config/db.js"
import { config } from "./config/config.js"

import exerciseRoutes from "./routes/exercise.routes.js" 
import routineRoutes from "./routes/routine.routes.js"
import authRoutes from "./routes/auth.routes.js";


const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/exercises", requireAuth, exerciseRoutes)
app.use("/api/routines", requireAuth, routineRoutes)

app.get("/", (req, res) =>{
    res.json({status: 'ok'})
})



connectDB()

app.listen(config.PORT, ()=>{
    console.log(`Server is running on port ${config.PORT}`)
})