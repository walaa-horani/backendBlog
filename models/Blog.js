import mongoose from "mongoose";


const blogSchema = new mongoose.Schema({
    title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },

   subtitle: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },

   thumbnail: {
    type: String,
    // default: 'default-thumbnail.jpg'
  },

  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Technology', 'Startup', 'Lifestyle', 'Finance']
  },

  author: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
     required: true
  },

  published: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },

},

{
 timestamps: true
}
 
)


export default mongoose.model('Blog', blogSchema);