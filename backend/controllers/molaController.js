const asyncHandler = require("express-async-handler");
const Mola = require("../models/molaModel");

//@desc Get all Publications
//@route GET /api/publications/:user_id
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
//@route POST /api/publications
//@access public
const createMola =  asyncHandler(async(req,res) => {
    console.log("the request body is ",req.body);
    const {title,author,journal,year,type,topics} = req.body;
    console.log(title);
    console.log(author);
    console.log(author + journal);
    console.log(year);
    console.log(type);
    console.log(topics);

    if(!title || !author || !year){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    
    const mola = await Mola.create({
        title: title,
        href: " ",
        description: author + journal,
        italics: " ",
        supplementary: null,
        bib: null,
        osf: null,
        publishDate: year,
        type: type,
        topic: topics
    });
    console.log(mola);
    res.status(201).json(mola);
    
});


module.exports = {getMola, getYears, createMola};