const jieba = require("nodejieba");

class LanguageTool
{
    constructor()
    {

    }
    languagCut(string)
    {
        if (typeof(string) !== "string") {
            console.error("language must be a string");
        };
        const result = jieba.cut(string);
        return result;
    }

    match(text, targetText)
    {
        if (typeof(text) !== "string") {
            return false;
        }
        try {
            const arr = this.languagCut(targetText);
            const matchedText = arr.filter(item => text.includes(item) );
            return {
                "title": arr,
                "extractText": matchedText
            };
        } catch (e) {
            console.log(e);
            return false;
        }

    }
}
exports.default = LanguageTool;
module.exports =  exports.default;
