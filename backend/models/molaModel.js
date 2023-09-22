const mongoose = require("mongoose");

const molaSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Could not find title"],
        },
        href: {
            type: String,
            required: [true, "Could not find url"],
        },
        description: {
            type: String,
            required: [true, "Could not find description"],
        },
        italics: {
            type: String,
            required: [true, "Could not find italics"],
        },
        supplementary: {
            type: String,
            required: false,
        },
        bib: {
            type: String,
            required: false,
        },
        osf: {
            type: String,
            required: false,
        },
        publishDate: {
            type: String,
            required: [true, "Could not find publish date"],
        },
        type: {
            type: String,
            required: [true, "Could not find type"],
        },
        topic: {
            type: Array,
            required: [true, "Could not find topics"],
        },
    }, 
);

module.exports = mongoose.model("mola", molaSchema);