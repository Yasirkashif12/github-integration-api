import express, { application } from "express";
import axios from "axios";
import GithubIntegration from "../Models/GithubIntegration.js";

const route=express.Router()

route.get('/github', (req, res) => {

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_CALLBACK_URL}&scope=user`;

  res.redirect(githubAuthUrl);
})
route.get('/github/callback', async (req, res) => {
  try {
    const { code } = req.query;

    
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_CALLBACK_URL,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

const accessToken = tokenResponse.data.access_token;
    if (!accessToken) {
      return res.status(400).json({ message: "Failed to retrieve access token", data: tokenResponse.data });
    }

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`       }
    });

    const userData = userResponse.data;

    // const savedData = await GithubIntegration.create({
    //   githubId: userData.id,
    //   username: userData.login,
    //   email: userData.email || "", 
    //   avatar_url: userData.avatar_url,
    //   accessToken: accessToken
    // });
    const savedData = await GithubIntegration.findOneAndUpdate(
  { githubId: userData.id }, 
  {
    githubId: userData.id,
    username: userData.login,
    email: userData.email || "",
    avatar_url: userData.avatar_url,
    accessToken: accessToken
  },
  { upsert: true, new: true } 
);



    return res.status(200).json({
      message: 'Data saved successfully',
      saved: savedData
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong', error });
  }
});
export default route