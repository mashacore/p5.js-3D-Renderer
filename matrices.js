module.exports = {
    multiplyMatrices: function (vector, matrix) {
        let rowx = vector.x * matrix[0][0] + vector.y * matrix[1][0] + vector.z * matrix[2][0];
        let rowy = vector.x * matrix[0][1] + vector.y * matrix[1][1] + vector.z * matrix[2][1];
        let rowz = vector.x * matrix[0][2] + vector.y * matrix[1][2] + vector.z * matrix[2][2];
        return [rowx.toFixed(5), rowy.toFixed(5), rowz.toFixed(5)];
    },
    rotateVector3D_xAxis: function (theta, vect) {
        let rmat = [ [1, 0, 0], [0, Math.cos(theta), -Math.sin(theta)], [0, Math.sin(theta), Math.cos(theta)] ];
        return this.multiplyMatrices (vect, rmat);
    },
    rotateVector3D_yAxis: function (theta, vect) {
        let rmat = [ [Math.cos(theta), 0, Math.sin(theta)], [0, 1, 0], [-Math.sin(theta), 0, Math.cos(theta)] ];
        return this.multiplyMatrices (vect, rmat);
    },
    rotateVector3D_zAxis: function (theta, vect) {
        let rmat = [ [Math.cos(theta), -Math.sin(theta), 0], [Math.sin(theta), Math.cos(theta), 0], [0, 0, 1] ];
        return this.multiplyMatrices (vect, rmat);
    },
    translateVector3D: function () {
    
    },
    scaleVector3D: function () {
    
    }    
};