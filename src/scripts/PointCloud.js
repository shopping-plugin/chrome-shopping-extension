import Point from "./Point";
import Util from "../logic/Util";

export default class PointCloud
{
    constructor(args)
    {
        this.name = args.name;
        this.originPoints = args.points;
        this.points = null;
        this.NumPoints = 32;
        this.originPoint = new Point(0, 0, 0);
        this.util = Util.getInstance();
        this._dealPoints();
    }

    _dealPoints()
    {
        let points = null;
        if (this.originPoints)
        {
            points = this.Resample(this.originPoints, this.NumPoints);
            points = this.Scale(points);
            points = this.TranslateTo(points, this.originPoint);
            this.points = points;
        }
    }

    Centroid(points) // 中心点 平均值
    {
        if (!points)
        {
            points = this.originPoints;
        }
        let x = 0.0;
        let y = 0.0;
        for (let i = 0; i < points.length; i++) {
            x += points[i].X;
            y += points[i].Y;
        }
        x /= points.length;
        y /= points.length;
        return new Point(x, y, 0);
    }

    Resample(points, n) //调整points的分布，尽量以相同间隔分布
    {
        var I = this.util.PathLength(points) / (n - 1); // interval distance
        var D = 0.0;
        var newpoints = new Array(points[0]);
        for (var i = 1; i < points.length; i++)
        {
            if (points[i].ID == points[i-1].ID)
            {
                var d = this.util.Distance(points[i - 1], points[i]);
                if ((D + d) >= I)
                {
                    var qx = points[i - 1].X + ((I - D) / d) * (points[i].X - points[i - 1].X);
                    var qy = points[i - 1].Y + ((I - D) / d) * (points[i].Y - points[i - 1].Y);
                    var q = new Point(qx, qy, points[i].ID);
                    newpoints[newpoints.length] = q; // append new point 'q'
                    points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i insert q
                    D = 0.0;
                }
                else D += d;
            }
        }
        if (newpoints.length == n - 1) // sometimes we fall a rounding-error short of adding the last point, so add it if so
        newpoints[newpoints.length] = new Point(points[points.length - 1].X, points[points.length - 1].Y, points[points.length - 1].ID);
        return newpoints;
    }

    Scale(points)  // 计算points scale 计算最大坐标差 压缩坐标值
    {
        var minX = +Infinity, maxX = -Infinity, minY = +Infinity, maxY = -Infinity;
        for (var i = 0; i < points.length; i++) {
            minX = Math.min(minX, points[i].X);
            minY = Math.min(minY, points[i].Y);
            maxX = Math.max(maxX, points[i].X);
            maxY = Math.max(maxY, points[i].Y);
        }

        var size = Math.max(maxX - minX, maxY - minY);
        var newpoints = new Array();
        for (var i = 0; i < points.length; i++) {
            var qx = (points[i].X - minX) / size;
            var qy = (points[i].Y - minY) / size;
            newpoints[newpoints.length] = new Point(qx, qy, points[i].ID);
        }
        return newpoints;
    }

    TranslateTo(points, pt) // translates points' centroid //去中心点 pt不知是啥
    {
        let c = this.Centroid(points);
        let newpoints = new Array();
        for (let i = 0; i < points.length; i++) {
            const qx = points[i].X + pt.X - c.X;
            const qy = points[i].Y + pt.Y - c.Y;
            newpoints[newpoints.length] = new Point(qx, qy, points[i].ID);
        }
        return newpoints;
    }
}
