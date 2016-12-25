export default class Util
{
    static _instance = null;
    static getInstance()
    {
        if (!Util._instance)
        {
            Util._instance = new Util();
        }
        return Util._instance;
    }

    GreedyCloudMatch(points, P)
    {
        var e = 0.50;
        var step = Math.floor(Math.pow(points.length, 1 - e));
        var min = +Infinity;
        for (var i = 0; i < points.length; i += step) {
            var d1 = this.CloudDistance(points, P.points, i);
            var d2 = this.CloudDistance(P.points, points, i);
            min = Math.min(min, Math.min(d1, d2)); // min3
        }
        return min;
    }

    isConnected(points1, points2, rule = 1)
    {
        const radius1 = this.getRange(points1).outerRadius;
        const radius2 = this.getRange(points2).outerRadius;
        const minDis = this.cloudMinDistance(points1, points2);
        const minRadius = Math.min(radius1, radius2);

        if ((minRadius * rule) >  minDis)
        {
            return true;
        }
        return false;
    }

    CloudDistance(pts1, pts2, start)
    {
        var matched = new Array(pts1.length); // pts1.length == pts2.length
        for (var k = 0; k < pts1.length; k++)
        matched[k] = false;
        var sum = 0;
        var i = start;
        do
        {
            var index = -1;
            var min = +Infinity;
            for (var j = 0; j < matched.length; j++)
            {
                if (!matched[j]) {
                    var d = this.Distance(pts1[i], pts2[j]);
                    if (d < min) {
                        min = d;
                        index = j;
                    }
                }
            }
            matched[index] = true;
            var weight = 1 - ((i - start + pts1.length) % pts1.length) / pts1.length;
            sum += weight * min;
            i = (i + 1) % pts1.length;
        } while (i != start);
        return sum;
    }

    cloudMinDistance(points1, points2)
    {
        let minDis = +Infinity;
        points1.forEach(preItem => {
            points2.forEach(backItem => {
                if (this.Distance(preItem, backItem) < minDis) {
                    minDis = this.Distance(preItem, backItem);
                }
            });
        });
        return minDis;
    }

    getRange(points)
    {
        let maxDistance = 0;
        let minDistance = +Infinity;
        let maxDisPointPair = null;
        let minDisPointPair = null;
        const locationRange = this.getLocationRange(points);
        const length = points.length;

        for(let index = 0; index < (length - 1); index++)
        {
            for (let next = (index + 1); next < length; next++)
            {
                const curDistance = this.Distance(points[index], points[next]);
                if (curDistance > maxDistance)
                {
                    maxDistance = curDistance;
                    maxDisPointPair = [ points[index], points[next] ];
                }
                if (curDistance < minDistance)
                {
                    minDistance = curDistance;
                    minDisPointPair = [ points[index], points[next] ];
                }
            }
        }

        if (!maxDisPointPair && !minDisPointPair)
        {
            return null;
        }
        else
        {
            return {
                "outerRadius": maxDistance / 2,
                "innerRadius": minDistance / 2,
                "innerCentroid": this.centroidOfTwoPoint(minDisPointPair[0], minDisPointPair[1]),
                "outerCentroid": this.centroidOfTwoPoint(maxDisPointPair[0], maxDisPointPair[1]),
                "startX": locationRange.startX,
                "startY": locationRange.startY,
                "width": locationRange.width,
                "height": locationRange.height
            };
        }

        return Math.max(maxX - minX, maxY - minY) / 2;
    }

    getLocationRange(points)
    {
        if (!points || points < 2)
        {
            return null;
        }

        let startX = +Infinity;
        let startY = +Infinity;
        let endX = -Infinity;
        let endY = -Infinity;
        const length = points.length;

        for (let index = 0; index < length; index++)
        {
            if (startX > points[index].X)
            {
                startX = points[index].X;
            }

            if (startY > points[index].Y)
            {
                startY = points[index].Y;
            }

            if (endX < points[index].X)
            {
                endX = points[index].X;
            }

            if (endY < points[index].Y)
            {
                endY = points[index].Y;
            }
        }

        return {
            startX,
            startY,
            "width": Math.abs(endX - startX),
            "height": Math.abs(endY - startY)
        }
    }

    PathDistance(pts1, pts2) // average distance between corresponding points in two paths // 两个points平均偏移距离
    {
        let d = 0.0;
        for (let i = 0; i < pts1.length; i++) // assumes pts1.length == pts2.length
        d += this.Distance(pts1[i], pts2[i]);
        return d / pts1.length;
    }

    PathLength(points) // length traversed by a point path //相同ID的前后两个点的距离和
    {
        let d = 0.0;
        for (let i = 1; i < points.length; i++)
        {
            if (points[i].ID == points[i-1].ID)
            d += this.Distance(points[i - 1], points[i]);
        }
        return d;
    }

    Distance(p1, p2) // Euclidean distance between two points
    {
        const dx = p2.X - p1.X;
        const dy = p2.Y - p1.Y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    centroidOfTwoPoint(p1, p2)
    {
        const dx = (p2.X + p1.X) / 2;
        const dy = (p2.Y + p1.Y) / 2;
        return { "x": dx, "y": dy };
    }

    rand(low, high)
    {
        return Math.floor((high - low + 1) * Math.random()) + low;
    }

    round(n, d)
    {
        d = Math.pow(10, d);
        return Math.round(n * d) / d;
    }
}
