import express from "express"
import cors from "cors"

import { connectDB } from "./config/db.js"
import { config } from "./config/config.js"

const app = express()

app.use(cors())
app.use(express.json())


app.get("/", (req, res) =>{
    res.json({status: 'ok'})
})



connectDB()

app.listen(config.PORT, ()=>{
    console.log(`Server is running on port ${config.PORT}`)
})