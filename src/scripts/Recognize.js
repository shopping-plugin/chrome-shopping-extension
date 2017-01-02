import Capture from "../logic/Capture";
import config from "../config.js";
import DomOperation from "./DomOperation";
import ImageRecognize from "../logic/ImageRecognize";
import InterceptionWeb from "../logic/InterceptionWeb";
import PDollarRecognizer from "./PDollarRecognizer";
import Point from "./Point";
import PointCloud from "./PointCloud";
import Util from "../logic/Util";

export default class Recognize
{
    constructor(args)
    {
        this.NumPointClouds = 4;
        this.NumPoints = 32;
        this.Origin = new Point(0,0,0);
        this.util = Util.getInstance();
        this.capture = new Capture({
            "webConfig": args.webConfig
        });
        this.domOperation = new DomOperation();
        this.markingDomState = null;
        this._history = new Array();
        this.webConfig = args.webConfig;
        this.config = config.noteConfig;

        this._init();
    }

    _init()
    {
        this._$recognize = $(`<canvas id="myCanvas" class="web-recognize-Content">
                <span style="background-color:#ffff88;">The &lt;canvas&gt; element is not supported by this browser.</span>
            </canvas>`);
        this._canvas = this._$recognize[0];

        const canvasPath = this.webConfig.listDOMSelector;
        $(canvasPath).append(this._$recognize[0]);
        this.domToggle(false);
        this.onLoadEvent();
        $(window).resize(() => {
            this.canvasResize();
        });
        $(this._canvas).on("mouseup", (event) => { this.mouseUpEvent(event.offsetX, event.offsetY, event.button); });
        $(this._canvas).on("mousedown", (event) => { this.mouseDownEvent(event.offsetX, event.offsetY, event.button); });
        $(this._canvas).on("mousemove", (event) => { this.mouseMoveEvent(event.offsetX, event.offsetY, event.button); });
        $(this._canvas).on("contextmenu", () => false);
    }

    domDetach()
    {
        $(this._canvas).detach();
        this.markingDomState = false;
    }

    domAttach()
    {
        $(this.webConfig.listDOMSelector).append(this._canvas);
        this.markingDomState = true;
        this.domToggle(true);
    }

    domToggle(value)
    {
        if (value !== undefined)
        {
            $(this._canvas).toggle(value);
            this.markingDomState = value;
        }
        else
        {
            $(this._canvas).toggle();
            this.markingDomState = !this.markingDomState;
        }
    }

    canvasResize()
    {
        const canvasPath = this.webConfig.listDOMSelector;
        setTimeout(() => {
            this._canvas.width = $(canvasPath).width();
            this._canvas.height = $(canvasPath).height();
            this._rc = this.getCanvasRect(this._canvas);
            this._g = this._canvas.getContext('2d');
        }, 300);
    }

    onLoadEvent()
    {
        const canvasPath = this.webConfig.listDOMSelector;
        this.capture.watchDOMBySelector("default");
        this._points = new Array(); // point array for current stroke
        this._strokeID = 0;
        this._r = new PDollarRecognizer();
        this._canvas.width = $(canvasPath).width();
        this._canvas.height = $(canvasPath).height();
        this._rc = this.getCanvasRect(this._canvas);

        // this.canvasResize();
        this._g = this._canvas.getContext('2d');
        this._g.lineWidth = 3;
        this._g.font = "16px Gentilis";
        this.drawText("please input: ", this._g);
        this._isDown = false;
    }

    getCanvasRect(canvas)
    {
        const w = canvas.width;
        const h = canvas.height;
        const cx = $(document).scrollLeft();
        const cy = $(document).scrollTop();
        return {x: cx, y: cy, width: w, height: h};
    }

    getScrollY()
    {
        let scrollY = 0;
        if (typeof(document.body.parentElement) != 'undefined')
        {
            scrollY = document.body.parentElement.scrollTop; // IE
        }
        else if (typeof(window.pageYOffset) != 'undefined')
        {
            scrollY = window.pageYOffset; // FF
        }
        return scrollY;
    }

    mouseDownEvent(x, y, button)
    {
        document.onselectstart = function() { return false; } // disable drag-select
        document.onmousedown = function() { return false; } // disable drag-select
        if (button <= 1)
        {
            this._isDown = true;
            if (this._strokeID == 0) // starting a new gesture
            {
                this._points.length = 0;
                this._g.clearRect(0, 0, this._rc.width, this._rc.height);
            }
            this._points[this._points.length] = new Point(x, y, ++this._strokeID);
            this.drawText("Recording stroke #" + this._strokeID + "...");
            const clr = "rgb(" + this.util.rand(0,200) + "," + this.util.rand(0,200) + "," + this.util.rand(0,200) + ")";
            this._g.strokeStyle = clr;
            this._g.fillStyle = clr;
            this._g.fillRect(x - 4, y - 3, 9, 9);
        }
        else if (button == 2)
        {
            this.drawText("Recognizing gesture...");
        }
    }

    mouseMoveEvent(x, y, button)
    {
        if (this._isDown)
        {
            this._points[this._points.length] = new Point(x, y, this._strokeID); // append
            this.drawConnectedPoint(this._points.length - 2, this._points.length - 1);
        }
    }

    mouseUpEvent(x, y, button)
    {
        document.onselectstart = function() { return true; } // enable drag-select
        document.onmousedown = function() { return true; } // enable drag-select
        if (button <= 1)
        {
            if (this._isDown)
            {
                this._isDown = false;
                this.drawText("Stroke #" + this._strokeID + " recorded.");
            }
        }
        else if (button == 2) // segmentation with right-click
        {
            if (this._points.length >= 10)
            {
                this.analyzeAndCapture();
                let gesObj = new Object();
                gesObj.action = "gesture";
                gesObj.points = this._points;
            }
            else
            {
                this.drawText("Too little input made. Please try again.");
            }
            this._strokeID = 0;
            this._points = new Array();
             // signal to begin new gesture on next mouse-down
        }
    }

    async analyzeAndCapture()
    {
        let results = this._r.Recognize(this._points);
        let allSelectedDom = new Array();
        results.map(result => {
            this.drawText("Result: " + this.config.noteType[result.Name] + " (" + this.util.round(result.Score,2) + ").");
            // console.log("Result: " + this.config.noteType[result.Name] + " (" + this.util.round(result.Score,2) + ").", result);
            if (result.type === "2" && result.Score > 0.01)
            {
                const range = this.util.getRange(result.path);
                let selectedDom = null;
                let radius = null;

                selectedDom = this.capture.getElementByCapture(range.outerCentroid, range.outerRadius).map( item => {
                    return {
                        "selectedDom": item,
                        "range": {
                            "startX": range.startX,
                            "startY": range.startY,
                            "width": range.width,
                            "height": range.height
                        },
                        "points": result.path,
                        "shape": this.config.noteType[result.Name],
                        "confidenceLevel": result.Score
                    };
                });

                allSelectedDom.push(...selectedDom);
                this._history.push({
                    "points": result.path,
                    "shape": result.Name,
                    "Dom": selectedDom, // 之后替换成project's or commodity's ID
                    "confidenceLevel": result.Score
                });
            }
        });
        const filterTitleDoms = allSelectedDom.filter(item => item.selectedDom.label === "label");
        const filterImgDoms = allSelectedDom.filter(item => item.selectedDom.label === "img");
        const titleDoms = await this.getTitleDoms(filterTitleDoms);
        const imgDoms = await this.getImgDoms(filterImgDoms);
        this.operationDoms(imgDoms);
        this.filterText(titleDoms);
        this.sendServer(this._history);
        this._history = [];
    }

    async getTitleDoms(titleDoms)
    {
        const result = await Promise.all(titleDoms.map(async (domItem) => {
            const item = domItem.selectedDom;
            const parentLocation = this.capture.getPositionOfElement(item.element);
            const offsetLeftStr = window.getComputedStyle(item.element, null).getPropertyValue('margin-left');
            const offsetTopStr = window.getComputedStyle(item.element, null).getPropertyValue('margin-top');
            const range = domItem.range;
            const offsetX = parentLocation.left; //+ parseInt(offsetLeftStr.substring(0, offsetLeftStr.length - 2)));
            const offsetY = parentLocation.top; // + parseInt(offsetTopStr.substring(0, offsetTopStr.length - 2)));
            range.startX -= offsetX;
            range.startY -= offsetY;
            range.width = (range.startX < 0 ? range.width + range.startX : range.width);
            range.height = (range.startY < 0 ? range.height + range.startY : range.height);
            range.startX = Math.max(range.startX, 0);
            range.startY = Math.max(range.startY, 0);

            const extractText = await this.labelExtract(item.element, range);
            const itemTitle = item.element.children[0].text;
            // const textData = await $.ajax({
            //     url: "http://192.168.1.108:8079/api/language/extractText",
            //     data: { "title": itemTitle, "extractText": extractText }
            // });

            return {
                "rootDom": item.rootElement,
                "titleDom": item.element,
                "type": domItem.shape,
                "title": extractText.text
            };
        }));

        return result;
    }

    async getImgDoms(imgDoms)
    {
        const result = imgDoms.map(domItem => {
            return {
                "rootDom": domItem.selectedDom.rootElement,
                "imgDoms": $(domItem.selectedDom.element).children("img")[0],
                "type": domItem.shape
            };
        });

        return result;
    }

    operationDoms(imgDoms)
    {
        if (!imgDoms || imgDoms.length < 1)
        {
            return false;
        }

        const containerDivs = imgDoms.map(item => item.rootDom);
        const imgDivs = imgDoms.map(item => item.imgDoms);
        const typeList = imgDoms.map(item => {
            return (item.type.includes("circle") ? "SIGN_WHITE" : "SIGN_BLACK");
        });
        this.domOperation.filterDom(containerDivs, imgDivs, typeList);
    }

    filterText(data)
    {
        if (!data || data.length < 1 )
        {
            return false;
        }
        const typeList = data.map(item => {
            return (item.type.includes("abs") ? "-" : "+");
        });
        const wordList = data.map(item => item.title);
        this.domOperation.filterText(wordList, typeList);
    }

    labelExtract(item, range)
    {
        return new Promise((resolve, reject) => {
            const imageRecognize = new ImageRecognize();
            const interceptionWeb =  new InterceptionWeb();

            interceptionWeb.domToImageLikePng(item, range).then((img) => {
                setTimeout(() => {
                    img.width = 500;
                    imageRecognize.imageToText(img).then(result => {
                        resolve(result);
                    })
                }, 500);
            });
        });
    }

    sendServer(data) {
        chrome.runtime.sendMessage({
            "command": "appendLog",
            "data": data
        }, (res) => {
            // console.log("server received the dom data", res);
        });
    }

    drawConnectedPoint(from, to)
    {
        this._g.beginPath();
        this._g.moveTo(this._points[from].X, this._points[from].Y);
        this._g.lineTo(this._points[to].X, this._points[to].Y);
        this._g.closePath();
        this._g.stroke();
    }

    drawText(str, $_g = this._g)
    {
        // $_g.clearRect(0, 0, this._rc.width, 40);
        // $_g.fillStyle = "rgb(255,255,136)";
        // $_g.fillRect(0, 0, this._rc.width, 40);
        // $_g.font = "40px Arial";
        // $_g.fillStyle = "rgb(0,0,255)";
        // $_g.fillText(str, 1, 35);
    }
}
