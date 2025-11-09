import mongoose from "mongoose";


const commentSchema = new mongoose.Schema({
     name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  }
}, {
  timestamps: true
})


export default mongoose.model('Comment', commentSchema);