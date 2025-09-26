import express from "express";
import GithubChangelog from "../Models/GitHubChangelog.js";
import GithubCommit from "../Models/GithubCommit.js";
import GithubIssue from "../Models/GithubIssue.js";
import GithubOrganization from "../Models/GithubOrganization.js";
import GithubPull from "../Models/GithubPull.js";
import GithubRepo from "../Models/GithubRepos.js";
import GithubUser from "../Models/GithubUser.js";
import GithubIntegration from "../Models/GithubIntegration.js";

const search = express.Router();

const modelmap = {
  changelog: GithubChangelog,
  commit: GithubCommit,
  issue: GithubIssue,
  organization: GithubOrganization,
  pulls: GithubPull,
  repo: GithubRepo,
  user: GithubUser,
  integration: GithubIntegration,
};

search.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Keyword does not exist" });
    }

    const regex = new RegExp(q, "i");
    const finalResult = {};

    for (const [name, model] of Object.entries(modelmap)) {
      const query = {};

      // get string fields
      const stringFields = Object.keys(model.schema.paths).filter(
        (field) => model.schema.paths[field].instance === "String"
      );

      if (stringFields.length > 0) {
        query.$or = stringFields.map((field) => ({
          [field]: regex,
        }));
      }

      const data = await model.find(query).limit(10);
      const total = await model.countDocuments(query);

      finalResult[name] = { total, data };
    }

    res.json({ keyword: q, results: finalResult });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default search;
