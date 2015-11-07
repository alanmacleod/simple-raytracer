
//module.exports = Vector3;

function Vector3(x,y,z) {

    this.x = 0; this.y = 0; this.z = 0;

    if (x) {
        if (x.constructor === Array) {
            if (x.length != 3) return;
            this.x = x[0];
            this.y = x[1];
            this.z = x[2];
        }
    } else {
//console.log("hello");
        this.x = 0 || x;
        this.y = 0 || y;
        this.z = 0 || z;
    }

    this.toString = function()
    {
        return "["+this.x+", "+this.y+", "+this.z+"]";
    };

    this.fromArray = function(arr)
    {
        if (arr.length != 3) return;

        this.x = arr[0];
        this.y = arr[1];
        this.z = arr[2];
    };

    this.magnitude = function()
    {
        return Math.sqrt(
            (this.x * this.x) + (this.y * this.y) + (this.z * this.z)
        );
    };

    this.getUnit = function()
    {
        var mag = this.magnitude();
        return new Vector3(this.x/mag, this.y/mag, this.z/mag);

    };

    this.normalise = function()
    {
        var mag = this.magnitude();
        this.x /= mag;
        this.y /= mag;
        this.z /= mag;

        return this;
    };

    this.subtract = function(vec)
    {
        var v = new Vector3();

        //console.log("x: "+this.x +" - " + vec.x);
        //console.log("y: "+this.y +" - " + vec.y);
        //console.log("z: "+this.z +" - " + vec.z);

        v.x = this.x - vec.x;
        v.y = this.y - vec.y;
        v.z = this.z - vec.z;

        return v;
    };

    this.add = function(vec)
    {
        var v = new Vector3();

        v.x = this.x + vec.x;
        v.y = this.y + vec.y;
        v.z = this.z + vec.z;

        return v;
    };
/*
 v1.y * v2.z - v1.z*v2.y,
 v1.z * v2.x - v1.x*v2.z,
 v1.x * v2.y - v1.y*v2.x);
 */
    this.cross = function(vec)
    {
        var v = new Vector3();

        v.x = (this.y * vec.z) - (this.z * vec.y);
        v.y = (this.z * vec.x) - (this.x * vec.z);
        v.z = (this.x * vec.y) - (this.y * vec.x);

        return v;
    };

    this.dot = function(vec)
    {
        return (this.x * vec.x + this.y * vec.y + this.z * vec.z);
    };


}