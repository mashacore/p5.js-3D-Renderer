// Twodimensional point defined using x- and y-coordinates.
class Point2D {
    constructor (x, y) {
        // Attributes for the x- and y-coordinates of the point are instantiated.
        this.x = x;
        this.y = y;
    }
}

// Threedimensional point defined using x-, y- and z-coordinates.
class Point3D {
    constructor (x, y, z) {
        // Attributes for the x-, y- and z-coordinates of the point are instantiated.
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

// Threedimensional vector defined using two 3D points; the start-point and the end-point.
class Vector3D {
    constructor (p_start, p_end) {
        // Attributes for the x-, y- and z-coordinates of the vector are determined by the difference
        // between the x-, y- and z-coordinates of the end point (p_end) and start point (p_start).
        this.x = p_end.x - p_start.x;
        this.y = p_end.y - p_start.y;
        this.z = p_end.z - p_start.z;

        // The length of the vector is calculated using the pythagorean theorem.
        this.r = Math.sqrt(this.x**2 + this.y**2 + this.z**2);

        // Two dummy attributes are created.
        this.theta;
        this.phi;

        // Modify the theta attribute, if the lenght of the vector is 0 then the angle should be set to 0
        // to avoid division errors.
        if (this.r == 0) {
            this.theta = 0;
        } else {
            // Otherwise the mathematical conversion, theta = arccos(z/r), is used.
            this.theta = Math.acos(this.z/this.r);
        }

        // Modify the phi attribute, if the x-coordinate of the cartesian vector is 0, then the angle should
        // be set to pi/2 to avoid division errors, since arccos(inf) = pi/2.
        if (this.x == 0) {
            this.phi = Math.PI/2;
        } else {
            // Otherwise the mathematical conversion, phi = arctan(y/x), is used.
            this.phi = Math.atan(this.y/this.x);
        }
    }
}

// Viewpanel which only exists inside the scene, this will be used as reference for the canvas
// object to display the twodimensional graphics. This class acts as the camera for the scene.
class ViewPanel {
    constructor (dimensions) {      
        // The value in radians of the viewpanels rotation from the z-axis (theta) and around
        // the xy-plane (phi). By default this value is set to [0, 0]. 
        this.rotation = [0, Math.PI/2];

        // The width and height of the viewpanel is determined by the constructor arguments.
        this.width = dimensions[0];
        this.height = dimensions[1];

        // The fixed distance from the point where vectors are drawn to, in order to intercept
        // the viewpanel i.e. the FOV. In order for an angle-like fov, this value should be
        // relative to either the width or height of the viewpanel. By default this value is set
        // to 9/7 times the panel width, which equates to an fov of 90 degrees.
        this.camera_distance = this.width * 9/7;

        // The center point of the camera (not the viewpanel). Set to be (0, 0, 0) by default.
        this.p_camera = new Point3D(-50, 0, 0);

        // The center of the viewpanel is calculated using a spherical vector with the rotation
        // values, and adding it to the position of the camera-point.
        let coords_p_viewpanel = this.sph_to_cart(this.camera_distance, this.rotation[0], this.rotation[1]);

        this.p_viewpanel = new Point3D(
            this.p_camera.x + coords_p_viewpanel[0], this.p_camera.y + coords_p_viewpanel[1], this.p_camera.z + coords_p_viewpanel[2]
        );

        // A vector from the position of the camera to the position of the viewpanel.
        this.vect_camera_viewpanel = new Vector3D(this.p_camera, this.p_viewpanel);
    }

    // Function to move the camera in a given direction.
    moveCamera (x, y, z) {
        this.p_camera.x += x;
        this.p_camera.y += y;
        this.p_camera.z += z;

        // Redraw the camera -> viewpanel vector with the new values.
        this.vect_camera_viewpanel = new Vector3D(this.p_camera, this.p_viewpanel);
    }

    // Function to rotate the camera in a given direction.
    rotateCamera (rotation) {
        this.rotation[0] += rotation[0];
        this.rotation[1] += rotation[1];

        // Redraw the camera -> viewpanel vector with the new values.
        let coords_p_viewpanel = this.sph_to_cart(this.camera_distance, this.rotation[0], this.rotation[1]);
        this.p_viewpanel = new Point3D(
            this.p_camera.x + coords_p_viewpanel[0], this.p_camera.y + coords_p_viewpanel[1], this.p_camera.z + coords_p_viewpanel[2]
        );
        this.vect_camera_viewpanel = new Vector3D(this.p_camera, this.p_viewpanel);
    }

    multiplyMatrices (vector, matrix) {
        let rowx = vector.x * matrix[0][0] + vector.y * matrix[1][0] + vector.z * matrix[2][0];
        let rowy = vector.x * matrix[0][1] + vector.y * matrix[1][1] + vector.z * matrix[2][1];
        let rowz = vector.x * matrix[0][2] + vector.y * matrix[1][2] + vector.z * matrix[2][2];
        return [rowx.toFixed(5), rowy.toFixed(5), rowz.toFixed(5)];
    }

    rotate_x_axis (theta, point) {
        let rotation_matrix = [ [1, 0, 0], [0, Math.cos(theta), -Math.sin(theta)], [0, Math.sin(theta), Math.cos(theta)] ];
        return this.multiplyMatrices (point, rotation_matrix);
    }


    // Function used to project a given threedimensional points onto the viewpanel, i.e. you
    // see the point from the perspective of the viewpanel. The function returns a twodimensional
    // point as a Point2D instance.
    projectPoint3D (point3d) {
        // Draw a vector from the camera position to the point.
        let vec_camera_point3d = new Vector3D(this.p_camera, point3d);

        // Calculate the angles between the camera-viewpanel vector and the newly created vector.
        let relative_phi = 2 * Math.PI - (vec_camera_point3d.phi + this.rotation[0]);
        let relative_theta = 2 * Math.PI - (vec_camera_point3d.theta + this.rotation[1]);

        // Use the phi angle to determine an x-coordinate using the law of sines.
        let angle_x = (Math.PI / 2) - Math.abs(relative_phi);
        let x = this.camera_distance * (Math.sin(relative_phi)/Math.sin(angle_x));

        // Use the theta angle to determine a y-coordinate using the law of sines.
        let angle_y = (Math.PI / 2) - Math.abs(relative_theta);
        let y = this.camera_distance * (Math.sin(relative_theta)/Math.sin(angle_y));

        return new Point2D(x * this.width, y * this.height);
    }

    // Function for converting a vector with spherical coordinates to a vector with cartesian coordinates.
    sph_to_cart (r, theta, phi) {
        // Three variables are created using the conversion formula to convert the spherical coordinates
        // to cartesian.
        let x = r * Math.sin(theta) * Math.cos(phi);
        let y = r * Math.sin(theta) * Math.sin(phi);
        let z = r * Math.cos(theta);

        // The cartesian coordinates are returned as an array.
        return [x, y, z];
    }

    // Function for converting a vector with cartesian coordinates to a vector with spherical coordinates.
    cart_to_sph (x, y, z) {
        // The length of the vector is calculated and saved to a variable.
        let r = Math.sqrt(x**2 + y**2 + z**2);

        // Two dummy variables are created.
        let theta;
        let phi;

        // Modify the theta variable, if the lenght of the vector is 0 then the angle should be set to 0
        // to avoid division errors.
        if (r == 0) {
            theta = 0;
        } else {
            // Otherwise the mathematical conversion, theta = arccos(z/r), is used.
            theta = Math.acos(z/r);
        }

        // Modify the phi variable, if the x-coordinate of the cartesian vector is 0, then the angle should
        // be set to pi/2 to avoid division errors.
        if (x == 0) {
            phi = Math.PI/2;
        } else {
            // Otherwise the mathematical conversion, phi = arctan(y/x), is used.
            phi = Math.atan(y/x);
        }

        // The spherical coordinates are returned as an array.
        return [r, theta, phi];
    }
}


// The threedimensional scene where the 3D points are located, in this model there are only points.
// All lines between points are drawn on the twodimensional viewpanel.
class Scene {
    constructor () {
        // An array containing all the threedimensional points in the scene is instantiated. By default
        // it is set to an empty array.
        this.points = [];
    }

    // Function for adding a threedimensional point to the scene. Takes a 3D point as the argument and
    // appends it to the Scene.points array. 
    addPoint (point3d) {
        this.points.push(point3d);
    }
}

// Twodimensional environtment which the viewpanel projects itself into, any instance of this class contains
// the viewpanel attached to that instance. The canvas doesnt exist in the scene, thus it does not have a
// position or rotation; all this information is attached to the viewpanel instance, which relays the
// projection to the canvas.
class Canvas {
    constructor (canvas_dimensions, viewpanel_dimensions) {
        // The viewpanel is instantiated using the viewpanel_dimensions argument.
        this.viewpanel = new ViewPanel(viewpanel_dimensions);

        // The width and height of the canvas is stored using the canvas_dimensions argument.
        this.width = canvas_dimensions[0];
        this.height = canvas_dimensions[1];

        // An array is initiated which will be updated for every canvas render to contain the twodimensional
        // points displayed on the canvas. By default this array is empty.
        this.content = [];
    }

    // Function for compiling all the threedimensional points in the scene to twodimensional points on the
    // viewpanel. This is done through the projectPoint3D() function which is found in the ViewPanel class.
    // This function uses an array of Point3D instances, which act as the coordinates for all points in the
    // scene, and compiles the resulting projections into an array of twodimensional points which is stored
    // in the canvas instance. This function is called by the p5.js draw() function.
    renderCanvas (scene) {
        this.content = [];
        for (let i = 0; i < scene.points.length; i++) {
            // Adds the return value from the projection function to the canvas content array.
            this.content.push(this.viewpanel.projectPoint3D(scene.points[i]));
        }
        return this.content;
    }
}

// Create a global scene instance.
let scene = new Scene();

// Create a global canvas instance.
let canvas = new Canvas([200, 150], [25, 25]);

// Add points to make a cube for demonstration.
scene.addPoint(new Point3D(0, 0, 0));
scene.addPoint(new Point3D(0, 10, 0));
scene.addPoint(new Point3D(0, 0, 10));
scene.addPoint(new Point3D(0, 10, 10));
scene.addPoint(new Point3D(10, 0, 0));
scene.addPoint(new Point3D(10, 10, 0));
scene.addPoint(new Point3D(10, 0, 10));
scene.addPoint(new Point3D(10, 10, 10));

// Create variables for camera movement.
let move_w = false;
let move_a = false;
let move_s = false;
let move_d = false;
let move_q = false;
let move_e = false;

// Create a document eventlistener to allow camera movement and rotation.
document.addEventListener("keydown", function(event) {
    if (event.key == "w") {
        move_w = true;
    }
    if (event.key == "a") {
        move_a = true;
    }
    if (event.key == "s") {
        move_s = true;
    }
    if (event.key == "d") {
        move_d = true;
    }
    if (event.key == "q") {
        move_q = true;
    }
    if (event.key == "e") {
        move_e = true;
    }
});

// Function used by p5.js to initialize the p5.js canvas on the webpage.
function setup () {
    createCanvas(1920, 1080);
    rectMode(CENTER);
}

// Function used by p5.js to update the p5.js canvas.
function draw () {
    background(200);
    if (move_w) {
        canvas.viewpanel.moveCamera(2, 0, 0);
        move_w = false;
    }
    if (move_a) {
        canvas.viewpanel.moveCamera(0, -2, 0);
        move_a = false;
    }
    if (move_s) {
        canvas.viewpanel.moveCamera(-2, 0, 0);
        move_s = false;
    }
    if (move_d) {
        canvas.viewpanel.moveCamera(0, 2, 0);
        move_d = false;
    }
    if (move_q) {
        canvas.viewpanel.moveCamera(0, 0, 2);
        move_q = false;
    }
    if (move_e) {
        canvas.viewpanel.moveCamera(0, 0, -2);
        move_e = false;
    }

    // The p5.js canvas is a bit weird so these commands make it function as intended.
    translate(width/2, height/2);
    rotate(Math.PI);

    // Create a render of the canvas instance and save it as a variable.
    let render = canvas.renderCanvas(scene);

    // Change stroke colour and weight for the rendered points.
    stroke('green');
    strokeWeight(5);

    // Run a for loop to create p5.js points for all the rendered 2D points.
    for (let i = 0; i < render.length; i++) {
        point(render[i].x, render[i].y);
    }

    
    // Change stroke colour and weight for the lines between points.
    stroke('black');
    strokeWeight(1);

    // Draw the lines between points to form the cube.
    line(render[0].x, render[0].y, render[1].x, render[1].y);
    line(render[0].x, render[0].y, render[2].x, render[2].y);
    line(render[0].x, render[0].y, render[4].x, render[4].y);
    line(render[1].x, render[1].y, render[3].x, render[3].y);
    line(render[1].x, render[1].y, render[5].x, render[5].y);
    line(render[2].x, render[2].y, render[6].x, render[6].y);
    line(render[2].x, render[2].y, render[3].x, render[3].y);
    line(render[3].x, render[3].y, render[7].x, render[7].y);
    line(render[5].x, render[5].y, render[7].x, render[7].y);
    line(render[5].x, render[5].y, render[4].x, render[4].y);
    line(render[6].x, render[6].y, render[4].x, render[4].y);
    line(render[6].x, render[6].y, render[7].x, render[7].y);

    // Change stroke colour and weight again to create a dot in the center of the screen.
    stroke('purple');
    strokeWeight(2);
    point(0,0);
}