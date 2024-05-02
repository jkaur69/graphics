function drawCubes() {
	var brown = [0.440, 0.285, 0.0176,1.0];
	var cream = [0.980, 0.899, 0.676,1.0];
	var black = [0.0, 0.0, 0.0, 1.0];
	var orange = [0.590, 0.383, 0.147, 1]
    var darkBrown = [0.396, 0.263, 0.129, 1.0]; 
    var shoeColor = [0.3, 0.3, 0.3, 1]; // Dark gray for shoes
    var blue = [0.0, 0.0, 0.8, 1.0]; // Blue for jeans
    var red = [1.0, 0.0, 0.0, 1.0];
    var green = [0.0, 1.0, 0.0, 1.0];

	// BODY -----------------------------------
    var body = new Cube();
    body.color = darkBrown;
    body.matrix.translate(-.25, -.25, 0);
    body.matrix.scale(0.5, 0.5, 0.4); // Make the body longer and less bulky
    body.render();
	
	// HEAD ------------------------------------
    var head = new Cube();
    head.color = darkBrown; // Using dark brown for the dog's head
    head.matrix.translate(-.25, 0.4, 0.1); // Move the head forward for the snout
    head.matrix.rotate(g_headAngle1, 1, 1, 0);
    head.matrix.rotate(g_headAngle2, 1, 0, 0);
    head.matrix.scale(0.5, 0.4, 0.6); // Elongate the head for the snout
    head.render();

	// LEFT EAR ------------------------------------
    var leftEar = new Cube();
    leftEar.color = brown;
    leftEar.matrix = new Matrix4(head.matrix); // Start with the head matrix
    leftEar.matrix.translate(-0.1, 0.2, 0); // Adjust position relative to head
    leftEar.matrix.scale(0.1, 0.2, 0.1); // Scale to drooping shape
    leftEar.matrix.rotate(-45, 1, 0, 0); // Rotate to droop the ear
    leftEar.render();

	// LEFT INNER EAR ------------------------------------
	var leftIEar = new Cube();
	leftIEar.matrix = new Matrix4(leftEar.matrix);
	leftIEar.color = red;
	leftIEar.matrix.translate(0.4, 0.02, -0.3);
	leftIEar.matrix.scale(0.6, 0.68, 0.3);
	leftIEar.render();

	// RIGHT EAR ------------------------------------
    var rightEar = new Cube();
    rightEar.color = brown;
    rightEar.matrix = new Matrix4(head.matrix); // Start with the head matrix
    rightEar.matrix.translate(1.0, 0.2, 0); // Adjust position relative to head
    rightEar.matrix.scale(0.1, 0.2, 0.1); // Scale to drooping shape
    rightEar.matrix.rotate(-45, 1, 0, 0); // Rotate to droop the ear
    rightEar.render();

	// RIGHT INNER EAR ------------------------------------
	var rightIEar = new Cube();
	rightIEar.matrix = new Matrix4(rightEar.matrix);
	rightIEar.color = red;
	rightIEar.matrix.translate(0, 0.02,-0.3);
	rightIEar.matrix.scale(0.6, 0.68, 0.3);
	rightIEar.render(); 

	// LEFT EYE ----------------------------------
	var leftEye = new Cube();
	leftEye.matrix = new Matrix4(head.matrix);
	leftEye.color = black;
	leftEye.matrix.translate(0.15, 0.43, 0.01);
	leftEye.matrix.scale(0.13, 0.17, -0.03);
	leftEye.render();

	// RIGHT EYE ----------------------------------
	var rightEye = new Cube();
	rightEye.matrix = new Matrix4(head.matrix);
	rightEye.color = black;
	rightEye.matrix.translate(0.72, 0.43, 0.01);
	rightEye.matrix.scale(0.13, 0.17, -0.03);
	rightEye.render();

	// MOUTH -----------------------------------
	var mouth = new Cube();
	mouth.matrix = new Matrix4(head.matrix);
	mouth.color = cream
	mouth.matrix.translate(0.275, 0.12, -0.01);
	mouth.matrix.scale(0.45, 0.3, 0.01);
	mouth.render(); 

	// NOSE -----------------------------------
	var nose = new Cube();
	nose.matrix = new Matrix4(head.matrix);
	nose.color = black;
	nose.matrix.translate(0.375, 0.27, -0.01);
	nose.matrix.scale(0.25, 0.15, -0.05);
	nose.render();

	// MIDDLE STOMACH -----------------------------------
	var stom = new Cube();
	stom.color = red;
	stom.matrix.translate(-0.15, -0.15, -0.02);
	stom.matrix.scale(0.3, 0.45, 0.02);
	stom.render();

	// UPPER STOMACH -----------------------------------
	var stom2 = new Cube();
	stom2.color = red;
	stom2.matrix.translate(-0.1, 0.3, -0.02);
	stom2.matrix.scale(0.2, 0.07, 0.02);
	stom2.render();

	// LOWER STOMACH -----------------------------------
	var stom3 = new Cube();
	stom3.color = cream;
	stom3.matrix.translate(-0.9, -0.22, -0.02);
	stom3.matrix.scale(0., 0.07, 0.02);
	stom3.render(); 

	// LEFT LEG -----------------------------------
    var leftLeg = new Cube();
    leftLeg.color = blue; // Jeans color
    leftLeg.matrix.translate(-.25, -0.7, 0);
    leftLeg.matrix.scale(0.15, 0.575, 0.15); // Slightly shorter to make room for shoes
    leftLeg.render();

    //legs again
    	// LEFT LEG -----------------------------------
    var leg2 = new Cube();
    leg2.color = blue; // Jeans color
    leg2.matrix.translate(-.2, -0.7, 0);
    leg2.matrix.scale(0.19, 0.92, 0.15); // Slightly shorter to make room for shoes
    leg2.render();

	// RIGHT LEG -----------------------------------
    var rightLeg = new Cube();
    rightLeg.color = blue; // Jeans color
    rightLeg.matrix.translate(-0.05, -0.7, 0);
    rightLeg.matrix.scale(0.3, 0.7, 0); // Slightly shorter to make room for shoes
    rightLeg.render();

	// LEFT ARM -----------------------------------
	var leftArm = new Cube();
	leftArm.color = orange;
	leftArm.matrix.rotate(-180, 0, 0, 1);
	leftArm.matrix.translate(0.25, -0.3, 0);
	leftArm.matrix.rotate(g_leftArmAngle, 1, 0, 0);
	leftArm.matrix.scale(0.25, 0.6, .3);
	leftArm.render();

	// RIGHT ARM -----------------------------------
	var rightArm = new Cube();
	rightArm.color = orange;
	rightArm.matrix.rotate(-180, 0, 0, 1);
	rightArm.matrix.translate(-0.5, -0.3, 0);
	rightArm.matrix.rotate(g_rightArmAngle, -1, 0, 0);
	rightArm.matrix.scale(0.25, 0.6, .3);
	rightArm.render();

    var leftShoe = new Cube();
    leftShoe.color = green;
    leftShoe.matrix.translate(-.35, -0.85, 0); // Adjust position to match new leg length
    leftShoe.matrix.scale(0.15, 0.05, 0.2); // Small block for the shoe
    leftShoe.render();

    var rightShoe = new Cube();
    rightShoe.color = green;
    rightShoe.matrix.translate(0.05, -0.85, 0); // Adjust position to match new leg length
    rightShoe.matrix.scale(0.15, 0.05, 0.2); // Small block for the shoe
    rightShoe.render();



}