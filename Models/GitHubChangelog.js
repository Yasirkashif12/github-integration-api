import mongoose from "mongoose";

const changelogSchema = new mongoose.Schema(
  {
    eventId: { type: Number, required: true, unique: true },
    repoId: { type: Number, required: true },
    issueId: { type: Number },
    event: { type: String },          
    actor: { type: String },          
    commitId: { type: String },       
    createdAt: { type: Date },        
    url: { type: String }  ,      
  },
  { timestamps: true },
);

const GithubChangelog = mongoose.model("github_changelog", changelogSchema);
export default GithubChangelog;
