import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
}, { timestamps: true }); 

export default mongoose.model("Task", TaskSchema);
