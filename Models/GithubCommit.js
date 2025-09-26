import mongoose from "mongoose";

const commitSchema = new mongoose.Schema(
  {
    commitId: { type: String, required: true, unique: true }, // SHA
    repoId: { type: Number, required: true },
    authorName: { type: String },
    authorEmail: { type: String },
    message: { type: String, required: true, trim: true },
    url: { type: String },
    committedDate: { type: Date },
  },
  { timestamps: true }
);

const GithubCommit = mongoose.model("github_commit", commitSchema);
export default GithubCommit;
