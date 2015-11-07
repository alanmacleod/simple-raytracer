
function Sphere(v3_pos, radius, colour)
{
    this.position = v3_pos;
    this.radius = radius;
    this.sqradius = radius * radius;
    this.colour = [255,0,0,255];
    if (colour) this.colour = colour;

    this.done = 0;

    this.intersect = function(ray)
    {
        var v = ray.origin.subtract(this.position);
        var b = -v.dot(ray.direction);

        var det = (b * b) - v.dot(v) + this.sqradius;

        var ret = {hit: false};

        if (det > 0)
        {
            det = Math.sqrt(det);

            var i1 = b - det;
            var i2 = b + det;

            if (i2 > 0)
            {
                if (i1 < 0)
                {
                   // if (i2 < dist)
                    {

                        ret.hit = false; // not quite, actually the ray started inside the primitive
                        ret.dist = i2;
                    }
                }
                else {
                   // if (i1 < dist)
                    {

                        ret.hit = true;
                        ret.dist = i1;
                    }

                }

            }


        }

        return ret;

    };
}