const asyncHandler = require("express-async-handler");
const Mola = require("../models/molaModel");

//@desc Get all Publications
//@route GET /api/contacts/:user_id
//@access public
const getMola = asyncHandler(async(req,res) => {
    const info = await Mola.find();
    res.status(200).json(info);
});

//@desc Get all years
//@route GET /api/years/
//@access public
const getYears = asyncHandler(async(req,res) => {
    const info = await Mola.find({}, {publishDate:1, _id:0})
    // console.log("info: ", info);
    res.status(200).json(info);
});

//@desc Create new Mola
//@route POST /api/contacts
//@access public
const createContact =  asyncHandler(async(req,res) => {
    console.log("the request body is ",req.body);
    const {name,email,phone,user_id} = req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    if(!user_id){
        res.status(400);
        throw new Error("user_id invalid");
    }
    const contact = await Mola.create({
        name,
        email,
        phone,
        // user_id: req.user.id
        user_id
    });
    res.status(201).json(contact);
    
});

//@desc Get contact
//@route GET /api/contacts/:id
//@access public
const getContact = asyncHandler(async(req,res) => {
    const contact = await Mola.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }
    res.status(200).json(contact);
});


//@desc Update contact
//@route PUT /api/contacts/:id
//@access public
const updateContact = asyncHandler(async(req,res) => {
    const contact = await Mola.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }

    if(contact.user_id.toString() != req.user.id){
        res.status(403);
        throw new Error("User don't have permission to update other user contacts");
    }

    const updatedContact = await Mola.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
        );
    
    res.status(200).json(updatedContact);
});

//@desc Delte contact
//@route DELETE /api/contacts
//@access public
const deleteContact = asyncHandler(async(req,res) => {
    const contact = await Mola.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }

    if(contact.user_id.toString() != req.user.id){
        res.status(403);
        throw new Error("User don't have permission to delete other user contacts");
    }

    await Mola.findByIdAndDelete(req.params.id);
    // await Contact.remove();
    res.status(200).json(contact);
});

module.exports = {getMola, getYears, createContact, getContact, updateContact, deleteContact};