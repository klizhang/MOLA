const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorhandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();

connectDb();

const app = express();
app.use(cors());
// app.use(express.json());
// app.use(express.static("../build"));

const port = process.env.PORT || 4000;

app.use(express.json());
app.use("/api/publications", require("./routes/molaRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);
// app.get("/", (res) => {
//     res.sendFile(path.resolve(__dirname, "build", "index.html"));
// });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
