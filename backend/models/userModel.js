const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please add the user email address"],
        unique: [true, "Email address already taken"]
    },
    password: {
        type: String,
        required: [true, "Please add the user passowrd"],
    },
    admin: {
        type: Boolean,
        required: [true, "Please specify admin T/F"]
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model("User", userSchema);