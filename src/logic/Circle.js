import  Shape from "./Shape";

export default class Circle extends Shape
{
    constructor(args)
    {
        super(args);
        this._type = "Circle";
        this._radius = null;
    }

    set centerLocation(value)
    {
        if (Array.isArray(value) && value.length >= 2)
        {
            this._centerLocation = {
                x: value[0],
                y: value[1]
            };
            return true;
        }
        else
        {
            return false;
        }
    }

    set radius(value)
    {
        if (typeof(value) === 'number')
        {
            this._radius = value;
            return true;
        }
        else
        {
            return false;
        }
    }

    get radius()
    {
        return this._radius ? this.radius : false;
    }
}
