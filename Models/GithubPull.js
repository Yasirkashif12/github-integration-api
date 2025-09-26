import mongoose from "mongoose";

const pullSchema = new mongoose.Schema(
  {
    pullId: { type: Number, required: true, unique: true },
    repoId: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    state: { type: String, enum: ["open", "closed", "merged"], required: true },
    userId: { type: Number, required: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    mergedAt: { type: Date },
    url: { type: String },
  },
  { timestamps: true }
);

const GithubPull = mongoose.model("github_pull", pullSchema);
export default GithubPull;
