class Point2D {
    constructor(x, y) {
        this.x = x; this.y = y;
    }
};

class Point3D {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
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

class Camera {
    constructor(pos, tilt, pan, view_panel_distance) {
        this.pos = pos; this.tilt = tilt; this.pan = pan;
        this.x = pos[0]; this.y = pos[1]; this.z = pos[2];
        this.view_panel_distance = view_panel_distance;
        this.visible_field_distance = 1000;
    }
};

class CanvasViewPanel {
    constructor(canvas) {
        this.centerpoint = this.get_center_point(canvas.camera);
    }

    convertSphericalToCartesian (view_panel_distance, pan, tilt) {
        let x = view_panel_distance * Math.sin(tilt) * Math.cos(pan);
        let y = view_panel_distance * Math.sin(tilt) * Math.sin(pan);
        let z = view_panel_distance * Math.cos(tilt);
        return [x, y, z];
    }

    convertCartesianToSpherical (x, y, z) {
        let prop_r = Math.sqrt(x**2 + y**2 + z**2);
        let prop_pan;
        let prop_tilt
        if ((Math.sqrt(x**2 + y**2)) == 0) {
            prop_pan = 0;
        } else {
            prop_pan = Math.acos(x/(Math.sqrt(x**2 + y**2)));
        }
        if (prop_r == 0) {
            prop_tilt = 0;
        } else {
            prop_tilt = Math.acos(z/prop_r);
        }
        return [prop_r, prop_pan, prop_tilt];
    }

    get_center_point (cmr) {
        let cmr_point3D = new Point3D(cmr.x, cmr.y, cmr.z);
        let viewpanel_vector = this.convertSphericalToCartesian(cmr.view_panel_distance, cmr.tilt, cmr.pan);
        let vp_point3D = new Point3D(viewpanel_vector[0], viewpanel_vector[1], viewpanel_vector[2]);

        let center_point_vector = new Vector3D(cmr_point3D, vp_point3D);
        console.log("center_point_vector", center_point_vector);
    }

    determine_2d_position (visible_point, frame_viewpanel, cmr, w, h) {
        let cmr_point3D = new Point3D(cmr.x, cmr.y, cmr.z);
        let vec_invers_visPoint_cmr = new Vector3D(cmr_point3D, visible_point);
        let sph_coords_invers_visPoint_cmr = this.convertCartesianToSpherical(
            vec_invers_visPoint_cmr.x, vec_invers_visPoint_cmr.y, vec_invers_visPoint_cmr.z
        );

        // Now we have the two angles and we can work out the planar position just like finding the sidelengths of a triangle using the law of sines
        let triangle_vertex_c_angle = Math.PI/2 - (sph_coords_invers_visPoint_cmr[1] + cmr.pan);
        let triangle_vertex_C_length = cmr.view_panel_distance;
        let proj_dist_x = triangle_vertex_C_length * Math.sin(sph_coords_invers_visPoint_cmr[1]) / Math.sin(triangle_vertex_c_angle);
        let triangle_vertex_c_angle_y = Math.PI/2 - (sph_coords_invers_visPoint_cmr[2] + cmr.tilt);
        let triangle_vertex_C_length_y = cmr.view_panel_distance;
        let proj_dist_y = triangle_vertex_c_angle_y * Math.sin(sph_coords_invers_visPoint_cmr[2]) / Math.sin(triangle_vertex_C_length_y);
        return new Point2D(proj_dist_x*100, proj_dist_y*120);
    }
};

class Canvas {
    constructor(width, height, framerate) {
        this.width = width;
        this.height = height;
        this.framerate = framerate;
        this.exists = true;
        this.camera = new Camera([-250, 0, 0], 0.15, 0.15, 2.75);
        this.viewPanel;
    }

    InitiateCanvas () {
        // Initialize the camera viewpanel
        this.viewPanel = new CanvasViewPanel(this);

        // p5.js initializers
        createCanvas(this.width, this.height);
        rectMode(CENTER);
        angleMode(DEGREES);
    }

    UpdateCanvas () {
        background(200);
        rotate(180); scale(-1, -1);
        translate(width/2, height/2)
    }
}; 

const canvas = new Canvas(1920, 1080, 60);
let move_w = false;
let move_a = false;
let move_s = false;
let move_d = false;
let move_q = false;
let move_e = false;

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

function setup() {
    canvas.InitiateCanvas();
}

function draw() {
    canvas.UpdateCanvas();

    if (move_w) {
        canvas.camera.z -= 1;
        move_w = false;
    }
    if (move_a) {
        canvas.camera.y += 1;
        move_a = false;
    }
    if (move_s) {
        canvas.camera.z += 1;
        move_s = false;
    }
    if (move_d) {
        canvas.camera.y -= 1;
        move_d = false;
    }
    if (move_q) {
        canvas.camera.x += 1;
        move_q = false;
    }
    if (move_e) {
        canvas.camera.x -= 1;
        move_e = false;
    }

    let v1 = new Point3D(0, 0, 0);
    let v2 = new Point3D(0, 100, 0);
    let v3 = new Point3D(0, 0, 100);
    let v4 = new Point3D(0, 100, 100);
    let v5 = new Point3D(100, 0, 0);
    let v6 = new Point3D(100, 100, 0);
    let v7 = new Point3D(100, 0, 100);
    let v8 = new Point3D(100, 100, 100);
    
    let v1_2 = canvas.viewPanel.determine_2d_position(v1, canvas.viewPanel, canvas.camera, canvas.width, canvas.height);
    let v2_2 = canvas.viewPanel.determine_2d_position(v2, canvas.viewPanel, canvas.camera, canvas.width, canvas.height);
    let v3_2 = canvas.viewPanel.determine_2d_position(v3, canvas.viewPanel, canvas.camera, canvas.width, canvas.height);
    let v4_2 = canvas.viewPanel.determine_2d_position(v4, canvas.viewPanel, canvas.camera, canvas.width, canvas.height);
    let v5_2 = canvas.viewPanel.determine_2d_position(v5, canvas.viewPanel, canvas.camera, canvas.width, canvas.height);
    let v6_2 = canvas.viewPanel.determine_2d_position(v6, canvas.viewPanel, canvas.camera, canvas.width, canvas.height);
    let v7_2 = canvas.viewPanel.determine_2d_position(v7, canvas.viewPanel, canvas.camera, canvas.width, canvas.height);
    let v8_2 = canvas.viewPanel.determine_2d_position(v8, canvas.viewPanel, canvas.camera, canvas.width, canvas.height);
    
    stroke('green');
    strokeWeight(10);
    point(v1_2.x, v1_2.y);
    point(v2_2.x, v2_2.y);
    point(v3_2.x, v3_2.y);
    point(v4_2.x, v4_2.y);
    point(v5_2.x, v5_2.y);
    point(v6_2.x, v6_2.y);
    point(v7_2.x, v7_2.y);
    point(v8_2.x, v8_2.y);

    stroke('black');
    strokeWeight(2);

    line(v1_2.x, v1_2.y, v2_2.x, v2_2.y);
    line(v1_2.x, v1_2.y, v3_2.x, v3_2.y);
    line(v1_2.x, v1_2.y, v4_2.x, v4_2.y);
    line(v1_2.x, v1_2.y, v5_2.x, v5_2.y);
    line(v1_2.x, v1_2.y, v6_2.x, v6_2.y);
    line(v1_2.x, v1_2.y, v7_2.x, v7_2.y);
    line(v1_2.x, v1_2.y, v8_2.x, v8_2.y);
    line(v2_2.x, v2_2.y, v3_2.x, v3_2.y);
    line(v2_2.x, v2_2.y, v4_2.x, v4_2.y);
    line(v2_2.x, v2_2.y, v5_2.x, v5_2.y);
    line(v2_2.x, v2_2.y, v6_2.x, v6_2.y);
    line(v2_2.x, v2_2.y, v7_2.x, v7_2.y);
    line(v2_2.x, v2_2.y, v8_2.x, v8_2.y);
    line(v3_2.x, v3_2.y, v4_2.x, v4_2.y);
    line(v3_2.x, v3_2.y, v5_2.x, v5_2.y);
    line(v3_2.x, v3_2.y, v6_2.x, v6_2.y);
    line(v3_2.x, v3_2.y, v7_2.x, v7_2.y);
    line(v3_2.x, v3_2.y, v8_2.x, v8_2.y);
    line(v4_2.x, v4_2.y, v5_2.x, v5_2.y);
    line(v4_2.x, v4_2.y, v6_2.x, v6_2.y);
    line(v4_2.x, v4_2.y, v7_2.x, v7_2.y);
    line(v4_2.x, v4_2.y, v8_2.x, v8_2.y);
    line(v5_2.x, v5_2.y, v6_2.x, v6_2.y);
    line(v5_2.x, v5_2.y, v7_2.x, v7_2.y);
    line(v5_2.x, v5_2.y, v8_2.x, v8_2.y);
    line(v6_2.x, v6_2.y, v7_2.x, v7_2.y);
    line(v6_2.x, v6_2.y, v8_2.x, v8_2.y);
    line(v7_2.x, v7_2.y, v8_2.x, v8_2.y);
}
