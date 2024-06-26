import { mergeAlias } from "vite";
import { asyncHandler } from "../utlis/asyncHandler.js";
import { response } from "express";
import {ApiError} from "../utlis/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utlis/cloudinary.js";
import { ApiResponse } from "../utlis/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    //   get user detail from frontend
    //   validation-not empty
    //   check if user already exist:username or gmal
    //   check for images check for avatar
    //   upload them on cloudinary,avatar
    //   create user object create entry in debugger
    //   remove password and refresh token field from response
    //   check for user createion 
    //   return res
    const{fullName,email,username,password}=req.body
    console.log("email:",email);
    // if(fullName===""){
    //     throw new ApiError(400,"full name is required")
    // }
    if(
        [fullName,email,username,password].some((field)=>
        field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are req")
    }
    const existedUser=User.findOne({
    $or:[{username},{email}]       
    })
    if(existedUser){
        throw new ApiError(409,"user with email or username exist")
    }
    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }
    const avatar=await uploadOnCloudinary(avatarLocalpath);
    const coverImage=await uploadOnCloudinary(coverImageLocalPath);
    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }
    const user=awaitUser.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })
    const createdUser =awaitUser.findById(user._id).select(
        "-password --refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500,"something weird")
    }
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registerd succesfully")
    )
    });

    


export { registerUser };

