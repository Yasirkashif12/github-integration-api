import mongoose from "mongoose";

const repoSchema = new mongoose.Schema(
  {
    repoId: { type: Number, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    fullName: { type: String, required: true },
    private: { type: Boolean, default: false },
    htmlUrl: { type: String },
    description: { type: String },
    ownerId: { type: Number, required: true },
    language: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    pushedAt: { type: Date },
  },
  { timestamps: true }
);

const GithubRepo = mongoose.model("github_repo", repoSchema);
export default GithubRepo;
