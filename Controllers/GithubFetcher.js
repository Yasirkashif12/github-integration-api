import GithubChangelog from "../Models/GitHubChangelog.js";
import GithubCommit from "../Models/GithubCommit.js";
import GithubIssue from "../Models/GithubIssue.js";
import GithubOrganization from "../Models/GithubOrganization.js";
import GithubPull from "../Models/GithubPull.js";
import GithubRepo from "../Models/GithubRepos.js";
import GithubUser from "../Models/GithubUser.js";
import GithubIntegration from "../Models/GithubIntegration.js";
import GithubMember from "../Models/GithubMember.js";
import express from "express";
import axios from "axios";
const fetcher = express.Router()
fetcher.get('/user', async (req, res) => {
    try {
        const { githubId } = req.query;

        const integration = await GithubIntegration.findOne({ githubId });
        const token = integration.accessToken
        const response = await axios.get("https://api.github.com/user", {
headers: { Authorization: `Bearer ${token}` }
        }
        )

const userdata = await GithubUser.findOneAndUpdate(
  { userId: response.data.id }, 
  {
    userId: response.data.id,
    login: response.data.login,
    name: response.data.name,
    avatarUrl: response.data.avatar_url,
    bio: response.data.bio
  },
  { upsert: true, new: true }
);
        if (!userdata) {
            return res.status(404).json({ message: "User not found" })
        } else {
            return res.status(200).json({ message: "USer data found", data: userdata })
        }
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error })
    }
})
fetcher.get('/repos',async(req,res)=>{
    try {
        const { githubId } = req.query;

        const integration = await GithubIntegration.findOne({ githubId });
        const token = integration.accessToken
        const response = await axios.get("https://api.github.com/user/repos", {
headers: { Authorization: `Bearer ${token}` }
        }
        )
        const reposdata=response.data.map(repo=>({
            repoId:repo.id,
            name:repo.name,
            fullName:repo.full_name

        }))
await GithubRepo.insertMany(reposdata,{ordered:false})
        if (!reposdata) {
            return res.status(404).json({ message: "Repos not found" })
        } else {
            return res.status(200).json({ message: "Repos data found", data:reposdata })
        }
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error })
    }
})
fetcher.get('/pulls', async (req, res) => {
  try {
    const { githubId, repoId } = req.query;

    const integration = await GithubIntegration.findOne({ githubId });
    if (!integration) {
      return res.status(404).json({ message: "Integration not found" });
    }
    const token = integration.accessToken;

    
    const repo = await GithubRepo.findOne({ repoId })
    if (!repo) {
      return res.status(404).json({ message: "Repo not found" });
    }
const [owner, repoName] = repo.fullName.split("/")

    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repoName}/pulls`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const pulldata = response.data.map(pull => ({
      pullId: pull.id,
      title: pull.title,
      state: pull.state,
      userId: pull.user.id,
      url: pull.html_url
    }));

    await GithubPull.insertMany(pulldata, { ordered: false });

    return res.status(200).json({ message: "Pulls data found", data: pulldata });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
});
fetcher.get('/organizations', async (req, res) => {
  try {
    const { githubId } = req.query;

    const integration = await GithubIntegration.findOne({ githubId });
    if (!integration) {
      return res.status(404).json({ message: "Integration not found" });
    }

    const token = integration.accessToken;

    const response = await axios.get("https://api.github.com/user/orgs", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const organizationsData = response.data.map(org => ({
      orgId: org.id,
      login: org.login,
      name: org.name,           
      avatarUrl: org.avatar_url
    }));

    await GithubOrganization.insertMany(organizationsData, { ordered: false });

    return res.status(200).json({ 
      message: "Organizations data found", 
      data: organizationsData 
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
});
fetcher.get('/issues', async (req, res) => {
  try {
    const { githubId, repoId } = req.query;

    const integration = await GithubIntegration.findOne({ githubId });
    if (!integration) {
      return res.status(404).json({ message: "Integration not found" });
    }
    const token = integration.accessToken;

    const repo = await GithubRepo.findOne({ repoId });
    if (!repo) {
      return res.status(404).json({ message: "Repo not found" });
    }

    const [owner, repoName] = repo.fullName.split("/");

    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repoName}/issues`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const issuedata = response.data.map(issue => ({
      issueId: issue.id,
      title: issue.title,
      state: issue.state,
      userId: issue.user?.id,
      url: issue.html_url
    }));

    await GithubIssue.insertMany(issuedata, { ordered: false });

    return res.status(200).json({ message: "Issues data found", data: issuedata });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
});
fetcher.get('/commits', async (req, res) => {
  try {
    const { githubId, repoId } = req.query;

    const integration = await GithubIntegration.findOne({ githubId });
    if (!integration) {
      return res.status(404).json({ message: "Integration not found" });
    }
    const token = integration.accessToken;

    const repo = await GithubRepo.findOne({ repoId });
    if (!repo) {
      return res.status(404).json({ message: "Repo not found" });
    }

    const [owner, repoName] = repo.fullName.split("/");

    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repoName}/commits`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const commitdata = response.data.map(commit => ({
      commitId: commit.sha, 
      authorName: commit.commit?.author?.name,
      message: commit.commit?.message,
      url: commit.html_url
    }));

    await GithubCommit.insertMany(commitdata, { ordered: false });

    return res.status(200).json({ message: "Commit data found", data: commitdata });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
});
fetcher.get('/changelog', async (req, res) => {
  try {
    const { githubId, repoId } = req.query;

    const integration = await GithubIntegration.findOne({ githubId });
    if (!integration) {
      return res.status(404).json({ message: "Integration not found" });
    }
    const token = integration.accessToken;

    const repo = await GithubRepo.findOne({ repoId });
    if (!repo) {
      return res.status(404).json({ message: "Repo not found" });
    }

    const [owner, repoName] = repo.fullName.split("/");

    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repoName}/issues/events`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

const changelogdata = response.data.map(event => ({
  eventId: event.id,
  issueId: event.issue?.id,
  event: event.event,
  actor: event.actor?.login,
  commitId: event.commit_id,
  createdAt: event.created_at,
  url: event.issue?.html_url
}));

    await GithubChangelog.insertMany(changelogdata, { ordered: false });

    return res.status(200).json({ message: "Changelog data found", data: changelogdata });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
});
import GithubMember from "../Models/GithubMember.js";

fetcher.get('/member', async (req, res) => {
  try {
    const { githubId, orgId } = req.query;  

    const integration = await GithubIntegration.findOne({ githubId });
    if (!integration) {
      return res.status(404).json({ message: "Integration not found" });
    }
    const token = integration.accessToken;

    const org = await GithubOrganization.findOne({ orgId });
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const membersResponse = await axios.get(
      `https://api.github.com/orgs/${org.login}/members`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const membersData = membersResponse.data.map(m => ({
      memberId: m.id,
      login: m.login,
      avatarUrl: m.avatar_url,
      orgLogin: org.login,
      url: m.html_url
    }));

    await GithubMember.insertMany(membersData, { ordered: false });

    return res.status(200).json({
      message: "Organization members stored successfully",
      org: org.login,
      total: membersData.length,
      members: membersData
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching members", error: error.message });
  }
});
fetcher.get('/resync', async (req, res) => {
  try {
    const { githubId } = req.query;

    const integration = await GithubIntegration.findOne({ githubId });
    if (!integration) {
      return res.status(404).json({ message: "Integration not found" });
    }
    const token = integration.accessToken;

    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${token}` }
    });
    await GithubUser.findOneAndUpdate(
      { userId: userResponse.data.id },
      {
        userId: userResponse.data.id,
        login: userResponse.data.login,
        name: userResponse.data.name,
        avatarUrl: userResponse.data.avatar_url,
        bio: userResponse.data.bio
      },
      { upsert: true, new: true }
    );

    const reposResponse = await axios.get("https://api.github.com/user/repos", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const reposdata = reposResponse.data.map(repo => ({
      repoId: repo.id,
      name: repo.name,
      fullName: repo.full_name
    }));
    await GithubRepo.insertMany(reposdata, { ordered: false });

    for (const repo of reposdata) {
      const [owner, repoName] = repo.fullName.split("/");

      const pullsResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repoName}/pulls`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const pulldata = pullsResponse.data.map(p => ({
        pullId: p.id,
        title: p.title,
        state: p.state,
        userId: p.user?.id,
        url: p.html_url
      }));
      await GithubPull.insertMany(pulldata, { ordered: false });

      const issuesResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repoName}/issues`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const issuedata = issuesResponse.data.map(i => ({
        issueId: i.id,
        title: i.title,
        state: i.state,
        userId: i.user?.id,
        url: i.html_url
      }));
      await GithubIssue.insertMany(issuedata, { ordered: false });

      const commitsResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repoName}/commits`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const commitdata = commitsResponse.data.map(c => ({
        commitId: c.sha,
        authorName: c.commit?.author?.name,
        message: c.commit?.message,
        url: c.html_url
      }));
      await GithubCommit.insertMany(commitdata, { ordered: false });

      const releasesResponse = await axios.get(
        `https://api.github.com/repos/${owner}/${repoName}/issues/events`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
const changelogdata = releasesResponse.data.map(event => ({
  eventId: event.id,
  issueId: event.issue?.id,
  event: event.event,
  actor: event.actor?.login,
  commitId: event.commit_id,
  createdAt: event.created_at,
  url: event.issue?.html_url
}));
      await GithubChangelog.insertMany(changelogdata, { ordered: false });
    }

    const orgResponse = await axios.get("https://api.github.com/user/orgs", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const organizationsData = orgResponse.data.map(org => ({
      orgId: org.id,
      login: org.login,
      name: org.name,
      avatarUrl: org.avatar_url
    }));
    await GithubOrganization.insertMany(organizationsData, { ordered: false });

    return res.status(200).json({
      message: "Resync completed ",
      reposCount: reposdata.length
    });
  } catch (error) {
    return res.status(500).json({ message: "Error during resync", error: error.message });
  }
});
export default fetcher