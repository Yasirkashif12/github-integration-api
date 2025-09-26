import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    memberId: { type: Number, required: true, unique: true },
    login: { type: String, required: true },
    avatarUrl: { type: String },
    orgLogin: { type: String, required: true }, 
    url: { type: String }
  },
  { timestamps: true }
);

const GithubMember = mongoose.model("GithubMember", memberSchema);
export default GithubMember;
