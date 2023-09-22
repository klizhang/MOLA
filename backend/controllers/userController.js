const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

//@desc register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async(req,res) => {
    const {email,password,isAdmin} = req.body;
    // console.log(req.body);
    boolAdmin = false;
    if (isAdmin){
        boolAdmin = true
    }
    if( !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("User already registered");
    }
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log("Hashed password: ", hashedPassword);
    const user = await User.create({
        email,
        password: hashedPassword,
        admin: boolAdmin
    });
    console.log(`User created ${user}`);
    if(user){
        res.status(201).json({_id: user.id, email: user.email});
    }else{
        res.status(400);
        throw new Error("User data is not valid");
    }
    res.json({message: "Register the user"});
});

//@desc Login a user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async(req,res) => {
    const {email,password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const user = await User.findOne({email});
    //compare password with hashedPassword
    if(user && (await bcrypt.compare(password,user.password))){
        res.status(200).json({"ID" : user.id, "email" : user.email, "isAdmin" : user.admin});
    }
    else{
        res.status(401);
        localStorage.setItem("userID","");
        throw new Error("email or password is not valid");
    }
});

//@desc Check admin status
//@route GET /api/users/admin
//@access public
const checkAdmin = asyncHandler(async(req,res) => {
    const {email} = req.params;
    // console.log("req params: " + req.params.email);
    // console.log("email: " + email);
    const user = await User.findOne({email});
    // console.log(user);
    res.json(user);
});

//@desc All users
//@route POST /api/users/all
//@access public
const allUser = asyncHandler(async(req,res) => {
    const users = await User.find();
    res.json(users);
});

//@desc Change password
//@route GET /api/users/change_password
//@access public
const changePassword = asyncHandler(async(req,res) => {
    console.log("req body: ",req.body);
    const {email,current_password,new_password,confirm_password} = req.body;
    if( !current_password || !new_password || !confirm_password){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const user = await User.findOne({email});
    //compare password with hashedPassword
    if(user && (await bcrypt.compare(current_password,user.password))){
        const newHashedPassword = await bcrypt.hash(new_password, 10);
        const updatedUser = await User.findOneAndUpdate(
            {"email" : email},
            {"password" : newHashedPassword}
        )
        
        res.status(200).json(updatedUser);
    }
    else{
        res.status(401);
        // localStorage.setItem("userID","");
        throw new Error("Password is not valid");
    }
});

//@desc Delete user
//@route POST /api/users/delete_user
//@access public
const deleteUser = asyncHandler(async(req,res) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(user){
        console.log(user);
        await User.findByIdAndDelete(user._id);
        console.log("deleted");
        console.log(user);
        res.status(200).json({"deleted" : "true"});
        
    }
    else{
        res.status(401);
        // localStorage.setItem("userID","");
        throw new Error("email is not valid");
    }
});

//@desc Promote user to admin
//@route POST /api/users/delete_user
//@access public
const promoteAdmin = asyncHandler(async(req,res) => {
    // console.log(req.body);
    const {email} = req.body;
    const user = await User.findOne({email});
    if(user){
        // console.log(user);
        // await User.findById(user._id);
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {admin: true},
            {new:true}
            );
        // console.log(updatedUser);
        res.status(200).json(updatedUser);
        
    }
    else{
        res.status(401);
        // localStorage.setItem("userID","");
        throw new Error("email is not valid");
    }
});

//@desc Demote admin to user
//@route POST /api/users/delete_user
//@access public
const demoteAdmin = asyncHandler(async(req,res) => {
    console.log(req.body);
    const {email} = req.body;
    const user = await User.findOne({email});
    if(user){
        console.log("before", user);
        // await User.findById(user._id);
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {admin: false},
            {new:true}
            );
        console.log("after", updatedUser);
        res.status(200).json(updatedUser);
        
    }
    else{
        res.status(401);
        // localStorage.setItem("userID","");
        throw new Error("email is not valid");
    }
});


module.exports = { registerUser , loginUser , checkAdmin, allUser, changePassword, deleteUser, promoteAdmin, demoteAdmin};