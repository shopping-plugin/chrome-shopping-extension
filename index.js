const express = require("express");

const app = express();

app.use(express.static("./public"));

app.listen(8079, () => {
    console.log("web-recognize-demo's html server is running...");
});
