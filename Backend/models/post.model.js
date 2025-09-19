import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        text: {
            type: String,
            required: true,
            trim: true
        },
        media: {
            type: [String],
            default: [],
            validate: {
                validator: (urls) => Array.isArray(urls) && urls.every((url) => /^https?:\/\/.+/.test(url)),
                message: 'Each media item must be a valid http(s) URL'
            }
        }
    },
    hashtags: {
        type: [String],
        default: [],
        validate: {
            validator: (tags) => Array.isArray(tags) && tags.every((t) => /^#[a-z0-9_]+$/i.test(t)),
            message: 'Each hashtag must start with # and contain letters, numbers, or _'
        }
    },
    likes: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        default: []
    },
    unlikes: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        default: []
    }
}, { timestamps: true });

const Posts = mongoose.model("Posts", postSchema);
export default Posts;