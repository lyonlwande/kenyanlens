import mongoose from "mongoose";

/* --------------------------------------------
   BLOCK-BASED CONTENT SCHEMA
   Supports headings, paragraphs, lists, media,
   nested sections, and future extensions.
--------------------------------------------- */


const contentBlockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "heading",
        "subheading",
        "paragraph",
        "list",
        "image",
        "media",
        "section",
        "quote",
        "code",
        "embed",
        "widget"
      ]
    },

    /* HEADINGS */
    level: {
      type: Number, // h1, h2, h3...
      min: 1,
      max: 6
    },

    /* TEXT CONTENT */
    text: {
      type: String
    },

    /* LISTS */
    style: {
      type: String,
      enum: ["bullet", "number"]
    },
    items: [
      {
        type: mongoose.Schema.Types.Mixed // text, media, or another block
      }
    ],

    /* MEDIA */
    url: {
      type: String
    },
    caption: {
      type: String
    },
    provider: {
      type: String //  cloudinary .
    },
    alt: {
      type: String // accessibility for images
    },
    transcript: {
      type: String // accessibility for video/audio
    },

    /* EMBEDS & WIDGETS */
    embedType: {
      type: String // e.g., 'youtube', 'tweet', 'map'
    },
    embedConfig: {
      type: mongoose.Schema.Types.Mixed // config for widget/embed
    },

    /* NESTED CONTENT FOR SUB-SECTIONS */
    title: {
      type: String
    },
    content: [
      {
        type: mongoose.Schema.Types.Mixed // allows nested blocks
      }
    ],

    /* BLOCK-LEVEL TAGS & METADATA */
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    keywords: [
      {
        type: String
      }
    ],
    metadata: {
      type: mongoose.Schema.Types.Mixed // custom metadata
    },

    /* BLOCK-LEVEL COMMENTS/ANNOTATIONS */
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
      }
    ],

    /* CONTROL FEATURES */
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published"
    },
    active: {
      type: Boolean,
      default: true
    },

    /* VERSIONING / HISTORY */
    history: [
      {
        type: mongoose.Schema.Types.Mixed // previous versions
      }
    ]
  },
  { _id: false }
);

export default contentBlockSchema;
