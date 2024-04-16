
function Draw(vertices, rgba) {
    // Break down the 8 vertices into two sets of 6 to form two triangles (a rectangle)
    var firstTriangle = [vertices[0], vertices[1], vertices[2], vertices[3], vertices[4], vertices[5]];
    var secondTriangle = [vertices[0], vertices[1], vertices[4], vertices[5], vertices[6], vertices[7]];

    // Set the color for all vertices to be drawn
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    // Draw the first triangle
    drawTriangle(firstTriangle);

    // Draw the second triangle
    drawTriangle(secondTriangle);
}

function house() {
    // Color definitions
    let greenGround = [0.3373, 0.4902, 0.2745, 1.0];
    let yellowSun = [0.960, 0.944, 0.0288, 1.0];
    let blueSky = [0.220, 0.623, 1.00, 1.0];
    let beigeHouse = [0.950, 0.835, 0.637, 1.0];
    let redRoof = [0.770, 0.00770, 0.00770, 1.0];
    let brownDoor = [0.600, 0.410, 0.162, 1.0];
    let greyWindow = [0.5, 0.5, 0.5, 1.0]; // Assuming a grey color for the windows

    // Sky - composed of 2 triangles to form a rectangle
    Draw([-1.0, 1.0, -1.0, -0.1, 1.0, -0.1], blueSky); // Lower triangle
    Draw([-1.0, 1.0, 1.0, 1.0, 1.0, -0.1], blueSky);   // Upper triangle

    // Sun - composed of 2 triangles to form a rectangle
    Draw([-1.0, 1.0, -1.0, 0.7, -0.7, 1.0], yellowSun); // Lower triangle
    Draw([-0.7, 1.0, -1.0, 0.7, -0.7, 0.7], yellowSun); // Upper triangle

    // Ground - composed of 2 triangles to form a rectangle
    Draw([-1.0, -0.1, -1.0, -1.0, 1.0, -1.0], greenGround); // Lower triangle
    Draw([-1.0, -0.1, 1.0, -1.0, 1.0, -0.1], greenGround);   // Upper triangle

    // House structure - composed of 2 triangles to form a rectangle
    Draw([-0.5, -0.1, -0.5, 0.3, 0.5, -0.1], beigeHouse); // Lower triangle
    Draw([-0.5, 0.3, 0.5, 0.3, 0.5, -0.1], beigeHouse);   // Upper triangle

    // Roof - composed of 2 triangles to form a rectangle
    Draw([-0.5, 0.3, 0.0, 0.7, 0.5, 0.3], redRoof); // Left triangle
    Draw([0.0, 0.7, 0.0, 0.3, -0.5, 0.3], redRoof); // Right triangle

    // Door - correctly positioned at the base of the house's front
    let doorWidth = 0.1;
    let doorHeight = 0.2;
    let doorBottom = -0.1; // Bottom of the house
    let doorLeft = -doorWidth / 2;
    let doorRight = doorWidth / 2;
    let doorTop = doorBottom + doorHeight;

    // Lower triangle for the door
    Draw([doorLeft, doorBottom, doorLeft, doorTop, doorRight, doorBottom], brownDoor);
    // Upper triangle for the door
    Draw([doorLeft, doorTop, doorRight, doorTop, doorRight, doorBottom], brownDoor);

    // Left window - composed of 2 triangles to form a rectangle
    Draw([-0.4, 0, -0.4, 0.2, -0.2, 0], greyWindow); // Lower triangle
    Draw([-0.4, 0.2, -0.2, 0.2, -0.2, 0], greyWindow); // Upper triangle

    // Right window - composed of 2 triangles to form a rectangle
    Draw([0.2, 0, 0.2, 0.2, 0.4, 0], greyWindow); // Lower triangle
    Draw([0.2, 0.2, 0.4, 0.2, 0.4, 0], greyWindow); // Upper triangle

    drawBool = true;
}




