import config from "../config.js";
import Point from "./Point";
import PointCloud from "./PointCloud";
import Util from "../logic/Util";

export default class PDollarRecognizer
{
    constructor()
    {
        this.config = config.inputType;
        const NumPointClouds = 4;
        this.PointClouds = new Array(NumPointClouds);
        this.subPoints = new Array(4);
        this.PointClouds[0] = new PointCloud({ name: "31", points: new Array(
            new Point(100,0,1),new Point(0,100,1),
            new Point(100,0,2),new Point(200,100,2),
            new Point(100,0,3),new Point(0,300,3)
        ) });
        this.PointClouds[1] = new PointCloud({ name: "41", points: new Array(
            new Point(100,0,1),new Point(0,300,1),
            new Point(0,200,2),new Point(100,300,2),
            new Point(200,200,2)
        ) });
        this.PointClouds[2] = new PointCloud({ name: "20", points: new Array(
            new Point(0,0,1),new Point(100,100,1),
            new Point(200,200,1),new Point(200,0,2),
            new Point(100,100,2),new Point(0,200,2)
        ) });
        const pai = 100 * Math.sqrt(2);
        this.PointClouds[3] = new PointCloud({ name: "10", points: new Array(
            new Point(0,100,1),new Point(100 - pai, 100 + pai,1),
            new Point(100,200,1),new Point(100 + pai, 100 + pai, 1),
            new Point(200,100,1),new Point(100 + pai, 100 - pai,1),
            new Point(100,0,1),new Point(100 - pai, 100 - pai, 1)
        )});

        this.subPoints[0] = new PointCloud({ name: "01", points: new Array(
            new Point(100,0,1), new Point(0,100,1)
        )});
        this.subPoints[1] = new PointCloud({ name: "02", points: new Array(
            new Point(0,0,1), new Point(100,100,1)
        )});
        this.subPoints[2] = new PointCloud({ name: "03", points: new Array(
            new Point(0,0,1), new Point(0,100,1)
        )});
        this.subPoints[3] = new PointCloud({ name: "circle", points: new Array(
            new Point(0,100,1),new Point(100 - pai, 100 + pai,1),
            new Point(100,200,1),new Point(100 + pai, 100 + pai, 1),
            new Point(200,100,1),new Point(100 + pai, 100 - pai,1),
            new Point(100,0,1),new Point(100 - pai, 100 - pai, 1)
        )});
    }

    Recognize(points)
    {
        const filteredPoints = this.filterSignleEdge(points);
        const clouds = this.splitCloudBySpaceRange(filteredPoints);
        const results = new Array();
        clouds.forEach(cloud => {
            let result = "";

            if (cloud.length < 2)
            {
                result = {
                    Score: 0,
                    Name: "无效序列",
                    type: "0",
                    path: cloud,
                    domPath: "",
                    label: ""
                }
            }
            else
            {
                result = this.recognizeSingle(cloud);
            }

            results.push(result);
        });
        return results;
    };

    recognizeSingle(points)
    {
        let pointCloud = new PointCloud({ name: "未知", points: points }).points;
        let b = +Infinity;
        let u = -1;
        for (let i = 0; i < this.PointClouds.length; i++) // for each point-cloud template
        {
            let d = Util.getInstance().GreedyCloudMatch(pointCloud, this.PointClouds[i]);
            if (d < b) {
                b = d; // best (least) distance
                u = i; // point-cloud
            }
        }
        const result = (u === -1) ? { Name: "No match.", Score: 0, type: "0" } : Object.assign({path: points, type: "2"},{ Name: this.PointClouds[u].name, Score: Math.max((2.5 - b) / 2.5, 0) });
        return result;
    }

    recognizeSingleEdge(points)
    {
        let pointCloud = new PointCloud({ name: "未知", points: points }).points;
        let b = +Infinity;
        let u = -1;
        for (let i = 0; i < this.subPoints.length; i++) // for each point-cloud template
        {
            let d = Util.getInstance().GreedyCloudMatch(pointCloud, this.subPoints[i]);
            if (d < b) {
                b = d; // best (least) distance
                u = i; // point-cloud
            }
        }
        const result = (u == -1) ? { Name: "No match.", Score: 0 } : Object.assign({path: this.subPoints[u].originPoints},{ Name: this.subPoints[u].name, Score: Math.max((2.5 - b) / 2.5, 0.0) });
        return result;
    }

    filterSignleEdge(points)
    {
        const edges = this.splitByEdge(points);
        const results = edges.filter(item => {
            const result = this.recognizeSingleEdge(item);
            if (result.Score > 0.001)
            {
                return true;
            }
            return false;
        });
        return this.mergeEdgesToCLouds(results);
    }

    mergeEdgesToCLouds(cloudsByEdge)
    {
        const clouds = cloudsByEdge.reduce((prev, curr) => prev.concat(curr), []);
        return clouds;
    }

    splitCloudBySpaceRange(points)
    {
        const edges = this.splitByEdge(points);

        const clouds = new Array();
        let index = 0;
        edges.reduce((prev, curr) => {
            if (!prev) {
                clouds[index] = new Array();
                clouds[index].push(curr);
                return curr;
            }
            let canMerged = false;
            clouds[index].forEach(item => {
                if (Util.getInstance().isConnected(item, curr)) {
                    canMerged = true;
                }
            });

            if (canMerged)
            {
                clouds[index].push(curr);
            }
            else
            {
                index++;
                clouds[index] = new Array();
                clouds[index].push(curr);
            }
            return curr;
        }, null);
        const result = clouds.map(item => this.mergeEdgesToCLouds(item));
        return result;
    }

    splitByEdge(points)
    {
        const edges = new Array();
        let index = 0;
        points.reduce((prev, next) => {
            if (!prev) {
                edges[index] = new Array();
                edges[index].push(next);
                return next;
            }

            if (prev.ID === next.ID)
            {
                edges[index].push(next);
            }
            else
            {
                index++;
                edges[index] = new Array();
                edges[index].push(next);
            }
            return next;
        }, null);
        return edges;
    }
}
