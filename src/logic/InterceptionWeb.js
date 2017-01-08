import domToImage from "dom-to-image";
import fileSaver from "file-saver";


export default class InterceptionWeb {
    constructor()
    {
        this.domToImage = domToImage;
    }

    async domToImageLikePng(dom, range)
    {
        const scale = 4;
        const largeDom = this.scaleDom(dom, scale);
        const cloneDom = largeDom.dom;
        const offset = largeDom.offset;
        // make sure all text is black
        $(cloneDom).children().children(".H").removeClass("H");
        document.body.appendChild(cloneDom);
        const dataUrl = await this.domToImage.toPng(cloneDom);
        let img = new Image();
        img.src = dataUrl;
        await this.waitImageLoad(img);
        const result = this.clip(img, {
            "startX": range.startX * scale,
            "startY": range.startY * scale,
            "width": range.width * scale,
            "height": range.height * scale
        });
        //$(document.body).append(result);
        return result;
    }

    clip(dom, range)
    {
        if (!range)
        {
            console.log("clip range params exists error");
        }
        const base64 = AlloyImage(dom).clip(parseInt(range.startX),
                parseInt(range.startY),
                parseInt(range.width),
                parseInt(range.height)).replace(dom).save("result.png", 1.0);
        let image = new Image();
        image.src = base64;
        return image;
    }

    waitImageLoad(img)
    {
        return new Promise((resolve, reject) => {
            let isReady = false;
            const timer = setInterval(() => {
                if (img.width > 0 && !isReady)
                {
                    isReady = true;
                    resolve();
                }
                if (isReady)
                {
                    window.clearInterval(timer);
                }
            }, 100);
        });
    }

    scaleDom(dom, scale)
    {
        const width = this._getDomAttribute(dom, "width") * scale;
        const height = this._getDomAttribute(dom, "height") * scale;
        const paddingLeft = this._getDomAttribute(dom, "padding-left") * scale;
        const paddingRight = this._getDomAttribute(dom, "padding-right") * scale;
        const paddingTop = this._getDomAttribute(dom, "padding-top") * scale;
        const paddingBottom = this._getDomAttribute(dom, "padding-bottom") * scale;
        const marginLeft = this._getDomAttribute(dom, "margin-left") * scale;
        const marginTop = this._getDomAttribute(dom, "margin-top") * scale;
        const marginRight = this._getDomAttribute(dom, "margin-right") * scale;
        const marginBottom = this._getDomAttribute(dom, "margin-bottom") * scale;
        const fontSize = this._getDomAttribute(dom, "font-size") * scale;
        const padding = paddingTop + " " + paddingRight + " " + paddingBottom + " " + paddingLeft;
        const margin = marginTop + " " + marginRight + " " + marginBottom + " " + marginLeft;
        const result = dom.cloneNode(true);
        $(result).css({
            width,
            height,
            "padding-top": paddingTop,
            "padding-left": paddingLeft,
            "padding-bottom": paddingBottom,
            "padding-right": paddingRight,
            "margin": 0,
            "font-size": fontSize,
            "color": "rgb(61, 61, 61)"
        });
        return {"dom": result, "offset": {
            "x": (paddingLeft) * (scale - 1) / scale,
            "y": (paddingTop) * (scale - 1) / scale
        }};
    }
    _getDomAttribute(dom, name)
    {
        const attrStr = window.getComputedStyle(dom, null).getPropertyValue(name);
        return parseInt(attrStr.substring(0, attrStr.length - 2));
    }
}
