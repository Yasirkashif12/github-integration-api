import express from "express";
import GithubChangelog from "../Models/GitHubChangelog.js";
import GithubCommit from "../Models/GithubCommit.js";
import GithubIssue from "../Models/GithubIssue.js";
import GithubOrganization from "../Models/GithubOrganization.js";
import GithubPull from "../Models/GithubPull.js";
import GithubRepo from "../Models/GithubRepos.js";
import GithubUser from "../Models/GithubUser.js";
import GithubIntegration from "../Models/GithubIntegration.js";
import integration from "./integration.js";
const modelmap={
    changelog:GithubChangelog,
    commit:GithubCommit,
    Issue:GithubIssue,
    Organization:GithubOrganization,
    Pulls:GithubPull,
    repo:GithubRepo,
    user:GithubUser,
    integration:GithubIntegration
}
const data=express.Router()

data.get('/data/:collection', async (req, res) => {
  try {
    const { collection } = req.params;
    const check = modelmap[collection];
    if (!check) {
      return res.status(400).json({ message: "Collection does not exist" });
    }

    let pageNum = parseInt(req.query.page) || 1;
    let limitNum = parseInt(req.query.limit) || 20;
    if (limitNum > 100) limitNum = 100;
    const skip = (pageNum - 1) * limitNum;

    let sort_by = req.query.sort_by || "createdAt";
    let sort_order = req.query.sort_order || "desc";
    let order = sort_order === "asc" ? 1 : -1;
    const sort_obj = { [sort_by]: order };

    let query = {};
    if (req.query.filter) {
      try {
        query = JSON.parse(req.query.filter);
      } catch (err) {
        return res.status(400).json({ message: "Invalid filter JSON" });
      }
    }

    if (req.query.search) {
      const regex = new RegExp(req.query.search, "i");
      const stringfields = Object.keys(check.schema.paths)
        .filter(f => check.schema.paths[f].instance === "String");

      if (stringfields.length > 0) {
        query.$or = stringfields.map(field => ({
          [field]: regex
        }));
      }
    }

    const result = await check.find(query).sort(sort_obj).skip(skip).limit(limitNum);
    const total = await check.countDocuments(query);

    return res.json({
      page: pageNum,
      limit: limitNum,
      total,
      data: result
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
export default data