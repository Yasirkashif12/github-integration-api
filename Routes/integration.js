import GithubIntegration from "../Models/GithubIntegration.js";
import express from "express";
import axios from "axios";

const integration = express.Router();

integration.get('/status', async (req, res) => {
  try {
    const { githubid, email } = req.query;

    const check = await GithubIntegration.findOne({
      $or: [{ email }, { githubId: githubid }]
    });

    if (check) {
      return res.status(200).json({ message: 'User integration found', data: check });
    } else {
      return res.status(404).json({ message: 'Integration not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error occurred', error });
  }
});

integration.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, avatar_url } = req.body;

    const updated = await GithubIntegration.findByIdAndUpdate(
      id,
      { username, email, avatar_url },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User profile updated successfully",
      data: updated
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

integration.delete('/remove', async (req, res) => {
  try {
    const { githubid } = req.query;

    const deleted = await GithubIntegration.findOneAndDelete({ githubId: githubid });

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.status(200).json({ message: "Data deleted successfully", data: deleted });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

// integration.get('/resync', async (req, res) => {
//   try {
//     const { githubid } = req.query;

//     const refetch = await GithubIntegration.findOne({ githubId: githubid });

//     if (!refetch) {
//       return res.status(404).json({ message: "Integration not found" });
//     }

//     const token = refetch.accessToken;

//     const userResponse = await axios.get('https://api.github.com/user', {
//       headers: { Authorization: `Bearer ${token}` }
//     });

//     const reposResponse = await axios.get('https://api.github.com/user/repos', {
//       headers: { Authorization: `Bearer ${token}` }
//     });

//     return res.status(200).json({
//       message: "Data resynced successfully",
//       user: userResponse.data,
//       reposCount: reposResponse.data.length,
//       repos: reposResponse.data
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Error during resync", error });
//   }
// });

export default integration;
