import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    issueId: { type: Number, required: true, unique: true },
    repoId: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    state: { type: String, enum: ["open", "closed"], required: true },
    userId: { type: Number, required: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    closedAt: { type: Date },
    url: { type: String },
  },
  { timestamps: true }
);

const GithubIssue = mongoose.model("github_issue", issueSchema);
export default GithubIssue;
