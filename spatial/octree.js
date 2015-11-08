
var MAX_LEAF_OBJECTS = 250;

function Octree(bounds)
{
    this.children = [];
    this.points = [];
    this.bounds = bounds; // .centre:{xyz}, .radius: 10
    this.leaf = false;

    this.build = function(points)
    {
        if (points.length == 0) {
            this.leaf = true;
            return;
        }

        if (points.length > MAX_LEAF_OBJECTS)
        {
            this.subdivide();

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

            this.points = []; // clear the array for sure

        } else {
            this.leaf = true;
            //console.log("Added "+points.length+". Thank you!");
            for (var t=0; t<points.length; t++)
                this.points.push(points[t]);
        }
    };

    this.subdivide = function()
    {
        for (var c=0; c<8; c++)
        {
            this.children[c] = new Octree(this.getChildBounds(c));
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