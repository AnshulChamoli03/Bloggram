import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profilePicture: {
    type: String,
    default: "",
    validate: {
      validator: (urls) => Array.isArray(urls) && urls.every((url) => /^https?:\/\/.+/.test(url)),
      message: 'Each media item must be a valid http(s) URL'
  }
  },
  bio: {
    type: String,
    default: ""
  },
  connections: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: []
  },
  posts: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Posts",
    default: []
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Users = mongoose.model("User", userSchema);
export default Users;