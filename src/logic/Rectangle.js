import Shape from "./Shape";
import Vector from "./Vector";

export default class Rectangle extends Shape
{
    constructor(args)
    {
        super(args);
        this._type = "Rectangle";
        this._startPoint = null;
        this._endPoint = null;
        this._diagnalVector = null;
    }

    set startPoint(value)
    {
        if (Array.isArray(value) && value.length >= 2)
        {
            this._startPoint = {
                x: value[0],
                y: value[1]
            };
            this._updateCenterLocation();
            return true;
        }
        else
        {
            return false;
        }
    }

    get startPoint()
    {
        return this._startPoint ? [this._startPoint.x, this._startPoint.y] : null;
    }

    set endPoint(value)
    {
        if (Array.isArray(value) && value.length >= 2)
        {
            this._endPoint = {
                x: value[0],
                y: value[1]
            };
            this._updateCenterLocation();
            return true;
        }
        else
        {
            return false;
        }
    }

    get endPoint()
    {
        return this._endPoint ? [this._endPoint.x, this.endPoint.y] : null;
    }

    _updateCenterLocation()
    {
        if (this._startPoint && this._endPoint)
        {
            this._centerLocation = {
                x: (this._startPoint.x + this._endPoint.x) / 2,
                y: (this._startPoint.y + this._endPoint.y) / 2
            };
            this._diagnalVector = [];
            this._diagnalVector.push(new Vector((this._endPoint.x - this._startPoint.x) / 2, (this._endPoint.y - this._startPoint.y) / 2));
            this._diagnalVector.push(new Vector((this._endPoint.x - this._startPoint.x) / 2, -(this._endPoint.y - this._startPoint.y) / 2));
            this._diagnalVector.push(new Vector(-(this._endPoint.x - this._startPoint.x) / 2, -(this._endPoint.y - this._startPoint.y) / 2));
            this._diagnalVector.push(new Vector(-(this._endPoint.x - this._startPoint.x) / 2, (this._endPoint.y - this._startPoint.y) / 2));
        }
        else
        {
            this._centerLocation = null;
            this._diagnalVector = null;
        }
    }

    getVectorFrom(location)
    {
        if (!this._centerLocation) return false;
        if (Array.isArray(location) && location.length >= 2)
        {
            return new Vector(location[0] - this._centerLocation.x, location[1] - this._centerLocation.y);
        }
        else if (typeof(location) === "object" && location.x && location.y)
        {
            return new Vector(location.x - this._centerLocation.x, location.y - this._centerLocation.y);
        }
        else
        {
            return false;
        }
    }

    getNearestDiagonalVector(location)
    {
        const curVector = this.getVectorFrom(location);
        if (curVector && this._centerLocation)
        {
            let resultIndex = 0;
            let cos = curVector.angleCos(this._diagnalVector[0]);
            this._diagnalVector.forEach((item, index) => {
                if (index !== 0)
                {
                    const curCos = curVector.angleCos(item);
                    if (curCos > cos)
                    {
                        cos = curCos;
                        resultIndex = index;
                    }
                }
            });
            return this._diagnalVector[resultIndex];
        }
        else
        {
            return false;
        }
    }
}
