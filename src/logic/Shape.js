export default class Shape {
    constructor(args)
    {
        if (args)
        {
            this._type = args.type || "";
            this._centerLocation = args.centerLocation;
        }
        else
        {
            this._type = null;
            this._centerLocation = null;
        }
    }

    get type()
    {
        return this._type;
    }

    get centerLocation()
    {
        return this._centerLocation;
    }
}
