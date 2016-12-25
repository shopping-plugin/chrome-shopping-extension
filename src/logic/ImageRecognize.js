import Tesseract from "tesseract.js";

export default class ImageRecognize
{
    constructor()
    {
        this.tool = Tesseract;
    }

    imageToText(imageLike)
    {
        return new Promise((resolve, reject) => {
            this.tool.recognize(imageLike, "chi_sim")
            .catch(error => {
                reject(error);
            }).then(result => {
                resolve(result);
                console.log("result", result);
            });
        })
    }

    textMactch(targetText, baseText)
    {
        const baseItem = baseText.split(" ");
        const result = "";
        const tempAccuracy = 0;
        baseItem.forEach((item) => {
            if (targetText.includes(item))
            {
                result.concat((item + " "));
            }
        });
        if (result.length < 1)
        {
            return null;
        }
        return result;
    }

}
