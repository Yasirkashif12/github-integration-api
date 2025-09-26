import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: { type: Number, required: true, unique: true },
    login: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    avatarUrl: { type: String },
    htmlUrl: { type: String },
    bio: { type: String },
    location: { type: String },
    createdAt: { type: Date },
  },
  { timestamps: true }
);

const GithubUser = mongoose.model("github_user", userSchema);
export default GithubUser;
