import mongoose from "mongoose";

const integrationSchema = new mongoose.Schema(
  {
    githubId: {
      type: Number,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      

      // unique: true,
      // lowercase: true,
    },
    avatar_url: {
      type: String,
    },
    accessToken: {
      type: String,
      required: true,
    },
    integrationStatus: {
      type: String,
      default: "connected",
    },
    connectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const GithubIntegration = mongoose.model("GithubIntegration", integrationSchema);

export default GithubIntegration;
