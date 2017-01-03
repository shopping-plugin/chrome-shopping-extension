import domToImage from "dom-to-image";
import fileSaver from "file-saver";


export default class InterceptionWeb {
    constructor()
    {
        this.domToImage = domToImage;
    }

    domToImageLikePng(dom, range)
    {
        const scale = 4;
        const largeDom = this.scaleDom(dom, scale);
        const cloneDom = largeDom.dom;
        const offset = largeDom.offset;
        // make sure all text is black
        $(cloneDom).children().children(".H").removeClass("H");
        document.body.appendChild(cloneDom);
        return new Promise((resolve, reject) => {
            this.domToImage.toPng(cloneDom).then((dataUrl) => {
                cloneDom.remove();
                let img = new Image();
                img.src = dataUrl;
                setTimeout(() => {
                    const result = this.clip(img, {
                        "startX": range.startX * scale,
                        "startY": range.startY * scale,
                        "width": range.width * scale,
                        "height": range.height * scale
                    });
                    resolve(result);
                }, 200);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    domToImageLikeJpeg(dom, range)
    {
        return new Promise((resolve, reject) => {
            this.domToImage.toJpeg(dom, { quality: 0.95 }).then((dataUrl) => {
                const img = new Image();
                img.src = dataUrl;
                resolve(img);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    domToImageLikeSvg(dom, range)
    {
        return new Promise((resolve, reject) => {
            this.domToImage.toSvg(dom).then((dataUrl) => {
                const img = new Image();
                img.src = dataUrl;
                resolve(img);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    clip(dom, range)
    {
        if (!range || !range.startX || !range.startY || ! range.width || !range.height)
        {
            console.log("clip range params exists error");
        }
        const base64 = AlloyImage(dom).clip(parseInt(range.startX),
                parseInt(range.startY),
                parseInt(range.width),
                parseInt(range.height)).save("result.png", 1.0);
        let image = new Image();
        image.src = base64;
        return image;
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
