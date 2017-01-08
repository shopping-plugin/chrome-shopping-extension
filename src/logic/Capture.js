import Circle from "./Circle";
import Rectangle from "./Rectangle";
import Vector from "./Vector";
import config from "../config.js";

export default class Capture {
    constructor(args)
    {
        this.watchElements = new Array();
        this.config = args.webConfig;
    }
// algnrith advance
    addWatchElements(rootElement, element, label, domPath)
    {
        this.watchElements.push({
            rootElement,
            element,
            label,
            domPath
        });
    }

    watchDOMBySelector(selectors = "")
    {
        selectors = this.config.itemSelectors;
        selectors.forEach(selector => {
            $(selector).each((index, item) => {
                const img = $(item).find(this.config.itemImgSelector)[0];
                const text = $(item).find(this.config.itemTitleSelector)[0];
                if (img)
                {
                    this.addWatchElements(item, img, "img", this.config.itemImgSelector);
                }
                if (text)
                {
                    this.addWatchElements(item, text, "label", this.config.itemTitleSelector);
                }
            });
        });
    }

    updateWatchDom(selectors = "")
    {
        this.watchElements = [];
        this.watchDOMBySelector(selectors);
    }

    getElementByCapture(location, range)
    {
        this.updateWatchDom();
        const result = this.watchElements.filter(item => {
            const judge = this.filterJudgement(item.element, location, range);
            if (!judge)
            {
                $(item.element).removeClass("test-selected");
            }
            return judge;
        });
        return result;
    }

    filterJudgement(element, location, range)
    {
        const rect = this.getPositionOfElement(element);
        const start = {
            x: rect.left,
            y: rect.top
        };
        const end = {
            x: rect.right,
            y: rect.bottom
        };
        return this.isJoined(start, end, location, range);
    }

    isJoined(rStart, rEnd, cLoc, cRadius)
    {
        const circle = new Circle();
        circle.centerLocation = cLoc;
        circle.radius = cRadius;
        const rect = new Rectangle();
        rect.startPoint = [ rStart.x, rStart.y ];
        rect.endPoint = [ rEnd.x, rEnd.y ];
        const vJoin = rect.getVectorFrom(cLoc).abs();
        const vNear = rect.getNearestDiagonalVector(cLoc).abs();
        const vResult = vJoin.minus(vNear);

        let u = 0;
        // circle cetroid in rect
        if (vResult.vector[0] < 0 && vResult.vector[1] < 0)
        {
            return true;
        }
        // 靠近 方框
        if (Math.abs(vResult.vector[0]) < cRadius && Math.abs(vResult.vector[1]) < cRadius)
        {
            u = Math.min(Math.max(vResult.vector[0], 0), Math.max(vResult.vector[1], 0));
            return u <= cRadius;
        }

        // 远离方框
        if (vResult.vector[0] > 0 || vResult.vector[1] > 0)
        {
            u = vResult.distance();
            return u <= cRadius;
        }
        return false;
    }

    getPositionOfElement(element)
    {
        let x = 0;
        let y = 0;
        const width = element.offsetWidth;
        const height = element.offsetHeight;

        while( element && !isNaN( element.offsetLeft ) && !isNaN( element.offsetTop )) {
            try {
                if ($(element).hasClass(this.config.listDOMSelector.slice(1)))
                {
                    break;
                }
            } catch (e) {
                console.log("nothing");
            }
            x += element.offsetLeft;
            y += element.offsetTop;
            element = element.offsetParent;
        }
        return {
            left: x,
            right: x + width,
            top: y,
            bottom: y + height,
            width,
            height
        };
    }
/*
domRange and pointRange must be startX, startY, width, height
errorTolerance 表示误差范围，
splitNumber 表示分割数目
direction 表示分割方向，暂支持 “column”， “row”
return false 表示参数错误
*/
    prefixRange(domRange, pointRange, errorTolerance = 0.3, splitNumber = 2, direction = "column")
    {
        if (errorTolerance < 0 || splitNumber < 1 || !domRange || !pointRange)
        {
            return false;
        }
        const result = null;
        const unitLength = {
            width: domRange.width / splitNumber,
            height: domRange.height / splitNumber
        };

        let startBlock = -1;
        let endBlock = splitNumber;
        const offsetY = unitLength.height * (1 - errorTolerance);
        const offsetX = unitLength.width * (1 - errorTolerance);

        switch(direction)
        {
            case "column":
                for (let index = 0; index < splitNumber; index ++)
                {
                    if (pointRange.startY < (offsetY + index * unitLength.height))
                    {
                        startBlock = index;
                        break;
                    }
                }
                for (let index = 0; index < splitNumber; index ++)
                {
                    if ((pointRange.startY + pointRange.height) > (unitLength.height * errorTolerance + index * unitLength.height))
                    {
                        endBlock = index;
                    }
                }

                if (startBlock < 0)
                {
                    return false;
                }
                return {
                    startX: pointRange.startX,
                    startY: (startBlock * unitLength.height),
                    width: pointRange.width,
                    height: (endBlock - startBlock + 1) * unitLength.height
                };

            case "row":
            for (let index = 0; index < splitNumber; index ++)
            {
                if (pointRange.startX < (offsetX + index * unitLength.width))
                {
                    startBlock = index;
                    break;
                }
            }
            for (let index = 0; index < splitNumber; index ++)
            {
                if ((pointRange.startX + pointRange.width) > (unitLength.width * errorTolerance + index * unitLength.width))
                {
                    startBlock = index;
                }
            }

            if (startBlock < 0)
            {
                return false;
            }
            return {
                startX: (startBlock * unitLength.width),
                startY: pointRange.startY,
                width: (endBlock - startBlock + 1) * unitLength.width,
                height: pointRange.height
            };

            default:
                return false;
        }
    }
}
