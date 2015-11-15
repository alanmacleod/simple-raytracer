/**
 * Created by alan on 15/11/15.
 */


function BoxAABB(min_v3, max_v3, colour)
{
    this.minCorner = min_v3;
    this.maxCorner = max_v3;

    if (colour) this.colour = colour;

    this.minB = []; this.maxB = [];

    this.minB[0] = min_v3.x;
    this.minB[1] = min_v3.y;
    this.minB[2] = min_v3.z;

    this.maxB[0] = max_v3.x;
    this.maxB[1] = max_v3.y;
    this.maxB[2] = max_v3.z;



    this.intersect = function(ray)
    {
        var origin = [], dir = [];

        origin[0] = ray.origin.x;
        origin[1] = ray.origin.y;
        origin[2] = ray.origin.z;

        dir[0] = ray.direction.x;
        dir[1] = ray.direction.y;
        dir[2] = ray.direction.z;

        var NUMDIM = 3;
        var RIGHT = 0, LEFT = 1, MIDDLE = 2;

        var inside = true;
        var quadrant = [];
        var whichPlane;
        var maxT = [];
        var candidatePlane = [];
        var coord = [];


        for (var i=0; i<NUMDIM; i++)
        {
            if(origin[i] < this.minB[i]) {
                quadrant[i] = LEFT;
                candidatePlane[i] = this.minB[i];
                inside = false;
            }else if (origin[i] > this.maxB[i]) {
                quadrant[i] = RIGHT;
                candidatePlane[i] = this.maxB[i];
                inside = false;
            }else	{
                quadrant[i] = MIDDLE;
            }
        }

        if (inside)
        {
            return {point: ray.origin, inside: true, hit: true};
        }

        for (var i=0; i<NUMDIM; i++)
        {
            if (quadrant[i] != MIDDLE && dir[i] != 0.0)
                maxT[i] = (candidatePlane[i]-origin[i]) / dir[i];
            else
                maxT[i] = -1.0;
        }

        whichPlane = 0;
        for (i = 1; i < NUMDIM; i++)
            if (maxT[whichPlane] < maxT[i])
                whichPlane = i;

        // Check final candidate actually inside box
         if (maxT[whichPlane] < 0.) return {hit: false};

         for (i = 0; i < NUMDIM; i++)
         {
             if (whichPlane != i)
             {
                 coord[i] = origin[i] + maxT[whichPlane] * dir[i];
                 if (coord[i] < this.minB[i] || coord[i] > this.maxB[i])
                     return {hit: false};
             } else {
                 coord[i] = candidatePlane[i];
             }
         }

        var v = new Vector3([coord[0], coord[1], coord[2]]);

        return {point: v, hit: true, dist: v.distanceTo(ray.origin)};				/* ray hits box */

    }
}