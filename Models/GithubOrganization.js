import mongoose from "mongoose";
const organizationSchema=new mongoose.Schema(
    {
        orgId:{
        type:Number,
        required:true,
        unique:true,
        },
        login:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
        },
        name:{
            type:String,
            required:true,
            trim:true,

        },
        description:{
            type:String,
            required:true,
        },
        url:{
            type:String,

        },
        avatarUrl:{
            type:String,
        },
    },
            {timestamps:true}

)
const GithubOrganization = mongoose.model("github_organization", organizationSchema);
export default GithubOrganization;
