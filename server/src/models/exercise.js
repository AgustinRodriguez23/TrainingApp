import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true,
    trim: true
  },
  muscleGroup: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, { timestamps: true })

const exerciseModel = mongoose.model("Exercise", exerciseSchema)