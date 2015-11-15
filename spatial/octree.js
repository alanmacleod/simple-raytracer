
var MAX_LEAF_OBJECTS = 250;

function Octree(bounds)
{
    this.children = [];
    this.points = [];
    this.bounds = bounds; // .centre:{xyz}, .radius: 10
    this.leaf = false;
    this.size = -1;
    this.level = 0;
    this.geometry = null;
    this.cloud = null;

    this.build = function(points)
    {
        if (points.length == 0) {
            this.leaf = true;
            return;
        }

        if (points.length > MAX_LEAF_OBJECTS)
        {
            this.subdivide();

            // Send the points down to the octant children

            var allChildPoints = [];

            var childSize = 0;

            for (var c = 0; c < 8; c++)
            {
                var childPoints = [];

                for (var t = 0; t < points.length; t++)
                {
                    if (this.children[c].testPoint(points[t]))
                        childPoints.push(points[t]);
                }

                for (var p = 0; p < childPoints.length; p++)
                    points.splice(points.indexOf(childPoints[p]),1);

                this.children[c].build(childPoints);


            }


            return ;

        } else {
            this.leaf = true;

            for (var t=0; t<points.length; t++) this.points.push(points[t]);

            this.geometry = new THREE.Geometry();

            for (var t=0; t<points.length; t++)
            {
                var p = points[t];
                var v = new THREE.Vector3();

                v.x = p.x;
                v.y = p.y;
                v.z = p.z;

                this.geometry.vertices.push(v);
            }

            this.cloud = new THREE.Points(this.geometry);

            return {points: this.points, size: this.size};
           //return what we got to the parent to perform sampling.
        }
    };


    this.resampleTree = function(node)
    {

        if (!node.leaf)
        {
            var childrenPoints = [];
            for (var c = 0; c < 8; c++)
            {
                if (node.children[c].points.length >0)
                {
                    for (var t = 0; t < node.children[c].points.length; t++)
                        childrenPoints.push(node.children[c].points[t]);

                }
                else {
                    var pts = this.resampleTree(node.children[c]);

                    if (pts.length > 0) {
                        for (var t = 0; t < pts.length; t++)
                            childrenPoints.push(pts[t]);
                    }
                }
            }


            node.points = this.downSample(childrenPoints, 1);
            node.geometry = new THREE.Geometry();

            for (var t=0; t<node.points.length; t++)
            {
                var p = node.points[t];
                var v = new THREE.Vector3();

                v.x = p.x;
                v.y = p.y;
                v.z = p.z;

                node.geometry.vertices.push(v);
            }

            node.cloud = new THREE.Points(node.geometry);


            //return {leaf: false, points: node.points};
            return node.points;

        } else {

            //return {leaf: true, points: node.points, size: 1};
            return node.points;

        }

    };



    this.downSample = function(points, times) //reduces data set by half each time
    {
        var sampledPts = [];

        for (var p=0; p<times; p++)
        {
            sampledPts = [];

            for (var t=0; t<points.length; t+=2)
            {
                sampledPts.push(points[t]);
            }

            points = sampledPts;
        }

        return sampledPts;
    };

    this.subdivide = function()
    {
        for (var c=0; c<8; c++)
        {
            this.children[c] = new Octree(this.getChildBounds(c));
            this.children[c].level = this.level + 1;
        }
    };

    this.getChildBounds = function(n)
    {
        var xpos = ((n & 1) *2) -1; // gives us -1 or +1 for each
        var ypos = (((n & 2)>>1) *2) -1;
        var zpos = (((n & 4)>>2) *2) -1;

        var cradius = this.bounds.radius / 2;

        var cx = this.bounds.centre.x + xpos * cradius;
        var cy = this.bounds.centre.y + ypos * cradius;
        var cz = this.bounds.centre.z + zpos * cradius;

        return {
            centre: {
                x: cx,
                y: cy,
                z: cz
            },
            radius: cradius
        };
    };

    this.testPoint = function(p)
    {
        var c = this.bounds.centre;
        var r = this.bounds.radius;

        if (p.x > c.x + r) return false;
        if (p.x < c.x - r) return false;
        if (p.y > c.y + r) return false;
        if (p.y < c.y - r) return false;
        if (p.z > c.z + r) return false;
        if (p.z < c.z - r) return false;

        return true;
    }


}