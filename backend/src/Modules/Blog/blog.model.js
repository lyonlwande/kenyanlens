
import mongoose from "mongoose";
import contentBlockSchema from "./contentBlock.schema.js";

/* --------------------------------------------
  MAIN BLOG SCHEMA
--------------------------------------------- */

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    description: {
      type: String,
      required: true,
      maxlength: 300
    },

    thumbnail: {
      type: String,
      required: true // cloudinary URL
    },

    images: [
      {
        type: String
      }
    ],

    /* BLOCK CONTENT */
    content: [contentBlockSchema],

    category: {
      type: String,
      required: true,
      enum: [
        "Lifestyle",
        "Culture & Ideas",
        "Conversations",
        "Inspiration",
        "Daily Experiences",
        "Technology",
        "Current Issues"
      ]
    },

    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
      }
    ],

    keywords: [
      {
        type: String
      }
    ],

    /* AUTHOR */
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    /* ENGAGEMENT */
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
      }
    ],

    viewsCount: {
      type: Number,
      default: 0
    },

    sharesCount: {
      type: Number,
      default: 0
    },

    /* META & CONTROL */
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft"
    },

    isFeatured: {
      type: Boolean,
      default: false
    },

    active: {
      type: Boolean,
      default: true // soft deletion
    },

    publishedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
