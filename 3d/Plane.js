


function Plane(v3_normal, D)
{
    this.normal = v3_normal;
    this.colour = [153, 102, 0, 255]; // gold ish
    this.D = D;

    this.intersect = function(ray)
    {
        var d = this.normal.dot(ray.direction);

        var result = {hit: false};

        if (d != 0)
        {
            var dist = -(this.normal.dot(ray.origin) + this.D) / d;

            if (dist > 0)
            {
                result.hit = true;
                result.dist = dist;
            }

        }

        return result;

    };



}