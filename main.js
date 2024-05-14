class Camera {
    constructor(fov, pos, rot) {
        this.fov = fov; this.pos = pos; this.rot = rot;
        this.x = pos[0]; this.y = pos[1]; this.z = pos[2];
        this.visibleField; // Pyamidestub
    }
};

class Canvas {
    constructor(width, height, framerate) {
        this.width = width;
        this.height = height;
        this.framerate = framerate;
        this.exists = true;
        this.camera = new Camera(70, [0, 0, 0], [0, 0, 0]);
    };
    async UpdateCanvas () {
        while (this.exists) {
            
        }
    };
};

class Point2D {
    constructor(x, y) {
        this.x = x; this.y = y;
    }
};

class Vector2D {
    constructor(Point2D_Start, Point2D_End) {
        this.Point2D_Start = Point2D_Start;
        this.Point2D_End = Point2D_End;
        this.x = Point2D_End.x - Point2D_Start.x;
        this.y = Point2D_End.y - Point2D_Start.y;
    }
};

class Point3D {
    constructor(x, y, z) {
        this.x = x; this.y = y; this.z = z;
    }
};

class Vector3D {
    constructor(Point3D_Start, Point3D_End) {
        this.Point3D_Start = Point3D_Start;
        this.Point3D_End = Point3D_End;
        this.x = Point3D_End.x - Point3D_Start.x;
        this.y = Point3D_End.y - Point3D_Start.y;
        this.z = Point3D_End.z - Point3D_Start.z;
    }
};

function multiplyMatrices (vector, matrix) {
    let rowx = vector.x * matrix[0][0] + vector.y * matrix[1][0] + vector.z * matrix[2][0];
    let rowy = vector.x * matrix[0][1] + vector.y * matrix[1][1] + vector.z * matrix[2][1];
    let rowz = vector.x * matrix[0][2] + vector.y * matrix[1][2] + vector.z * matrix[2][2];
    return [rowx.toFixed(5), rowy.toFixed(5), rowz.toFixed(5)];
};

function rotateVector3D_xAxis (theta, vect) {
    let rmat = [ [1, 0, 0], [0, Math.cos(theta), -Math.sin(theta)], [0, Math.sin(theta), Math.cos(theta)] ];
    return this.multiplyMatrices (vect, rmat);
};

function rotateVector3D_yAxis (theta, vect) {
    let rmat = [ [Math.cos(theta), 0, Math.sin(theta)], [0, 1, 0], [-Math.sin(theta), 0, Math.cos(theta)] ];
    return this.multiplyMatrices (vect, rmat);
};

function rotateVector3D_zAxis (theta, vect) {
    let rmat = [ [Math.cos(theta), -Math.sin(theta), 0], [Math.sin(theta), Math.cos(theta), 0], [0, 0, 1] ];
    return this.multiplyMatrices (vect, rmat);
};

function translateVector3D () {

};

function scaleVector3D () {

};

function matrixToVector (matrix, point3D_Start) {
    let point3D_End = new Point3D(
        parseFloat(matrix[0]) + point3D_Start.x,
        parseFloat(matrix[1]) + point3D_Start.y,
        parseFloat(matrix[2]) + point3D_Start.z
    );
    return new Vector3D(point3D_Start, point3D_End);
};

function projectVector3Dto2D (vector3D, camera) {
    
};

const canvas = new Canvas(960, 540, 60);

const point1 = new Point3D(0, 0, 0);
const point2 = new Point3D(15, 0, 0);

const vector1 = new Vector3D(point1, point2);

let vectorRot = matrixToVector(rotateVector3D_zAxis(0 * Math.PI, vector1), point1);

//const vectorProj = projectVector3Dto2D(vectorRot, canvas.camera);

console.log(vectorRot);

vectorRot = matrixToVector(rotateVector3D_zAxis(0.45 * Math.PI, vectorRot), point1);


function setup() {
    createCanvas(960, 540);
    rectMode(CENTER);
    angleMode(DEGREES);
}

function draw() {
    background(200);
    translate(width/2, height/2);
    rotate(180); scale(-1, 1);
    vectorRot = matrixToVector(rotateVector3D_yAxis(0.02 * Math.PI, vectorRot), point1);
    let pointA = [vectorRot.Point3D_Start.x * 10, vectorRot.Point3D_Start.y * 10];
    let pointB = [vectorRot.Point3D_End.x * 10, vectorRot.Point3D_End.y * 10];
    line(pointA[0], pointA[1], pointB[0], pointB[1]);
}
