export default class Vector {
    constructor(x = null, y = null){
        this._startPoint = null;
        this._endPoint = null;
        this._vector = null;
        if (x !== null && y !== null)
        {
            this._startPoint = {
                x: 0,
                y: 0
            };
            this._endPoint = {
                x,
                y
            }
            this._vector = {
                x,
                y
            }
        }
    }

    set startPoint(value)
    {
        if (Array.isArray(value) && value.length >= 2)
        {
            this._startPoint = {
                x: value[0],
                y: value[1]
            };
            this._updateVector();
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
            this._updateVector();
            return true;
        }
        else
        {
            return false;
        }
    }

    get endPoint()
    {
        return this._endPoint ? [ this._endPoint.x,  this._endPoint.y] : null;
    }

    _updateVector()
    {
        if (this._endPoint && this._startPoint)
        {
            this._vector = {
                x: this._endPoint.x - this._startPoint.x,
                y: this._endPoint.y - this._startPoint.y
            };
        }
        else
        {
            this._vector = null;
        }
    }

    get vector()
    {
        return this._vector ? [this._vector.x, this._vector.y] : null ;
    }

    plus(vector)
    {
        if ( vector instanceof Vector)
        {
            return new Vector( this._vector.x + vector.vector[0], this._vector.y + vector.vector[1] );
        }
        else
        {
            throw new Error("input must be a Vector object.");
        }
    }

    minus(vector)
    {
        if (vector instanceof Vector)
        {
            return new Vector(this._vector.x - vector.vector[0], this._vector.y - vector.vector[1]);
        } else
        {
            throw new Error("input must be a Vector object.");
        }
    }

    distance(vector = null)
    {
        if (vector === null)
        {
            // calculate it's distance
            return Math.sqrt(Math.pow(this._vector.x, 2) + Math.pow(this._vector.y, 2));
        }
        else
        {
            // calculate vector's distance
            return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));        }
    }

    angleCos(vector)
    {
        if (vector)
        {
            const a = this.distance();
            const b = this.distance(vector);
            const ab = this._vector.x * vector.x + this._vector.y * vector.y;
            return a * b !== 0 ? ab/(a * b) : 1;  // assum 1
        }
        else
        {
            return false;
        }
    }

    abs(vector)
    {
        if (vector)
        {
            return new Vector(Math.abs(vector.x), Math.abs(vector.y));
        }
        else
        {
            return new Vector(Math.abs(this._vector.x), Math.abs(this._vector.y));
        }
    }
}
