const express = require("express");
const LanguageTool = require("./node-server/LanguageTool");

const app = express();
console.log(LanguageTool);
const languageTool = new LanguageTool();

app.use(express.static("./public"));

app.get("/api/language/extractText", (req, res, next) => {
    const title = req.query.title;
    const extractText = req.query.extractText;
    console.log("title", title);
    const result = languageTool.match(extractText, title);
    res.send(result);
});

app.listen(8079, () => {
    console.log("web-recognize-demo's html server is running...");
});
