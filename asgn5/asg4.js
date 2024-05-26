// ClickedPints.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_NormalMatrix; 
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_VertPos = u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform sampler2D u_Sampler4;
  uniform sampler2D u_Sampler5;
  uniform int u_whichTexture;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  varying vec4 v_VertPos;
  uniform bool u_lightOn;
  uniform vec3 u_lightColor;
  void main() {
    if (u_whichTexture == -3) {
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0); // Use normal
    
    } else if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;                  // Use color

    } else if (u_whichTexture == -1) {             // Use UV debug color
      gl_FragColor = vec4(v_UV, 1.0, 1.0);

    } else if (u_whichTexture == 0) {              // Use texture0
      gl_FragColor = texture2D(u_Sampler0, v_UV);

    } else if (u_whichTexture == 1) {              // Use texture1
      gl_FragColor = texture2D(u_Sampler1, v_UV);

    } else if (u_whichTexture == 2) {              // Use texture2
      gl_FragColor = texture2D(u_Sampler2, v_UV);

    } else if (u_whichTexture == 3) {              // Use texture3
      gl_FragColor = texture2D(u_Sampler3, v_UV);

    } else if (u_whichTexture == 4) {              // Use texture4
      gl_FragColor = texture2D(u_Sampler4, v_UV);

    } else if (u_whichTexture == 5) {              // Use texture5
      gl_FragColor = texture2D(u_Sampler5, v_UV);

    } else {                                       // Error, put Redish
      gl_FragColor = vec4(.2,.2,.5,1);
    }

    vec3 lightVector = u_lightPos - vec3(v_VertPos);
    float r = length(lightVector);
    
    // Red/Green Distance Visualization
    // if (r < 1.0) {
    //   gl_FragColor = vec4(1,0,0,1);
    // } else if (r < 2.0) {
    //   gl_FragColor = vec4(0,1,0,1);
    // }

    // Light Falloff Visualization 1/r^2
    // gl_FragColor = vec4(vec3(gl_FragColor)/(r*r),1);

    // N dot L
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N,L), 0.0);

    // Reflection
    vec3 R = reflect(-L, N);

    // eye
    vec3 E = normalize(u_cameraPos - vec3(v_VertPos));

    // Specular
    float specular = pow(max(dot(E,R), 0.0), 64.0);

    vec3 diffuse = vec3(1.0,1.0,0.9) * vec3(gl_FragColor) * nDotL *0.8;
    vec3 ambient = (vec3(gl_FragColor) + u_lightColor) * 0.4;
    if (u_lightOn) {
        gl_FragColor = vec4(specular+diffuse+ambient, 1.0);
    }
}`

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
let u_lightPos;
let u_cameraPos
let u_FragColor;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1
let u_Sampler2;
let u_Sampler3;
let u_Sampler4;
let u_Sampler5;
let u_Sampler6;
let u_Sampler7;
let u_whichTexture;
let u_lightColor

function setupWebGl() {
	// Retrieve <canvas> element
	canvas = document.getElementById('webgl');

	// Get the rendering context for WebGL
	gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
	if (!gl) {
	  console.log('Failed to get the rendering context for WebGL');
	  return;
	}
	gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL() {
	// Initialize shaders
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log('Failed to intialize shaders.');
		return;
	}

	// Get the storage location of a_Position
	a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0) {
		console.log('Failed to get the storage location of a_Position');
		return;
	}

    // Get the storage location of a_UV
    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
        console.log('Failed to get the storage location of a_UV');
        return;
    }

	// Get the storage location of a_Normal
    a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    if (a_Normal < 0) {
        console.log('Failed to get the storage location of a_Normal');
        return;
    }

	// Get the storage location of u_FragColor
	u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
	if (!u_FragColor) {
		console.log('Failed to get the storage location of u_FragColor');
		return;
	}

	// Get the storage location of u_lightColor
	u_lightColor = gl.getUniformLocation(gl.program, 'u_lightColor');
	if (!u_lightColor) {
		console.log('Failed to get the storage location of u_lightColor');
		return;
	}

	// Get the storage location of u_lightPos
	u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
	if (!u_lightPos) {
		console.log('Failed to get the storage location of u_lightPos');
		return;
	}

	// Get the storage location of u_lightPos
	u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
	if (!u_lightOn) {
		console.log('Failed to get the storage location of u_lightOn');
		return;
	}

	// Get the storage location of u_cameraPos
	u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
	if (!u_cameraPos) {
		console.log('Failed to get the storage location of u_cameraPos');
		return;
	}

	// Get the storage location of u_ModelMatrix
	u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
	if (!u_ModelMatrix) {
		console.log('Failed to get the storage location of u_ModelMatrix');
		return;
	}

	// Get the storage location of u_GlobalRotateMatrix
	u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
	if (!u_GlobalRotateMatrix) {
		console.log('Failed to get the storage location of u_GlobalRotateMatrix');
		return;
	}

	u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
	if (!u_ViewMatrix) {
		console.log('Failed to get the storage location of u_ViewMatrix');
		return;
	}

	u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
	if (!u_ProjectionMatrix) {
		console.log('Failed to get the storage location of u_ProjectionMatrix');
		return;
	}

	// Get the storage location of the u_Sampler0
	u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
	if (!u_Sampler0) {
		console.log('Failed to get the storage location of u_Sampler0');
		return false;
	}

	// Get the storage location of u_Sampler1
	u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
	if (!u_Sampler1) {
	  console.log('Failed to get the storage location of u_Sampler1');
	  return false;
	}  

	// Get the storage location of the u_Sampler0
	u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
	if (!u_whichTexture) {
		console.log('Failed to get the storage location of u_whichTexture');
		return false;
	}
	
	// Get the storage location of u_Sampler2
	u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
	if (!u_Sampler2) {
	  console.log('Failed to get the storage location of u_Sampler2');
	  return false;
	}  
	
	// Get the storage location of u_Sampler3
	u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
	if (!u_Sampler3) {
	  console.log('Failed to get the storage location of u_Sampler3');
	  return false;
	}  

	// Get the storage location of u_Sampler4
	u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
	if (!u_Sampler4) {
	  console.log('Failed to get the storage location of u_Sampler4');
	  return false;
	} 

	// Get the storage location of u_Sampler5
	u_Sampler5 = gl.getUniformLocation(gl.program, 'u_Sampler5');
	if (!u_Sampler5) {
	  console.log('Failed to get the storage location of u_Sampler5');
	  return false;
	}  

	// Get the storage location of u_Sampler6
	u_Sampler6 = gl.getUniformLocation(gl.program, 'u_Sampler6');
	if (!u_Sampler6) {
	  console.log('Failed to get the storage location of u_Sampler6');
	  return false;
	}
	
	
	// Get the storage location of u_Sampler7
	u_Sampler7 = gl.getUniformLocation(gl.program, 'u_Sampler7');
	if (!u_Sampler7) {
	  console.log('Failed to get the storage location of u_Sampler7');
	  return false;
	}  

	// Set Initial Value For Matrix Identity
	var identityM = new Matrix4();
	gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);}


// Globals related to UI elements
let g_cameraAngles = [0, 0, 0];
let g_globalAngle = 0;
let g_globalAngle_v = 0;
let g_leftArmAngle = 0;
let g_rightArmAngle = 0;
let g_leftLegAngle = 0;
let g_rightLegAngle = 0;
let g_headAngle1 = 0;
let g_headAngle2 =0;
let g_rightEarAngle = 0;
let g_leftEarAngle = 0;
let g_bodyAngle = 0;
let g_poke = false;

// Globals related to animation
let g_animation = false;
let arm = 0;
let g_startTime = performance.now()/1000.0;
let g_seconds = performance.now()/1000.0-g_startTime;
let g_normalOn = false; 
let g_lightPos =  [0,1.2,-2]
let g_lightOn = true;
let g_lightColor = [0,0,0]
let lightRotate = true;

// Camera Globals
var camera = new Camera();


// Set up actions for HTML UI elements
function addActionsForHtmlUI() {
	// Camera Angle Slider 
	document.getElementById('angleSlide').addEventListener('mousemove',  function() { g_globalAngle = this.value; renderAllShapes(); });

	// Normal On
	document.getElementById('normalOn').onclick = function() {g_normalOn = true; };

	// Normal Off
	document.getElementById('normalOff').onclick = function() {g_normalOn = false; };

	// Light On
	document.getElementById('lightOn').onclick = function() {g_lightOn = true; };

	// Light Off
	document.getElementById('lightOff').onclick = function() {g_lightOn = false; };
	
	// Animation On
	document.getElementById('animationOn').onclick = function() {g_animation = true; };

	// Animation Off
	document.getElementById('animationOff').onclick = function() {g_animation = false; };

	// Light X  Slider 
	document.getElementById('lightSlideX').addEventListener('mousemove',  function(ev) {if (ev.buttons == 1) {g_lightPos[0] = this.value/100; renderAllShapes(); }});

	// Light Y  Slider 
	document.getElementById('lightSlideY').addEventListener('mousemove',  function(ev) {if (ev.buttons == 1) {g_lightPos[1] = this.value/100; renderAllShapes(); }});

	// Light Z  Slider 
	document.getElementById('lightSlideZ').addEventListener('mousemove',  function(ev) {if (ev.buttons == 1) {g_lightPos[2] = this.value/100; renderAllShapes(); }});

	// Light Rotation  On
	document.getElementById('startRotate').onclick = function() {lightRotate = true;};

	// Light Rotation  Off
	document.getElementById('stopRotate').onclick = function() {lightRotate = false;};

	// Red Slider
  	document.getElementById('lightRed').addEventListener('mousemove', function() {g_lightColor[0] = this.value/100;}); 

	// Green Slider
  	document.getElementById('lightGreen').addEventListener('mousemove', function() {g_lightColor[1] = this.value/100;});

	// Blue Slider
  	document.getElementById('lightBlue').addEventListener('mousemove', function() {g_lightColor[2] = this.value/100;});
  

}

function initTextures() {
	var image = new Image(); // Create an image object
	if (!image) {
		console.log('Failed to create the image object');
		return false;
	}
	var imageGround = new Image();
  	if (!imageGround) {
    	console.log('Failed to create the imageGround object');
    	return false;
	}
	var imageGrass = new Image();
  	if (!imageGrass) {
    	console.log('Failed to create the imageGrass object');
    	return false;
	}
	var imageSand = new Image();
  	if (!imageSand) {
    	console.log('Failed to create the imageSand object');
    	return false;
	}
	var imageBirch = new Image();
  	if (!imageBirch) {
    	console.log('Failed to create the imageBirch object');
    	return false;
	}
	var imageLeaves = new Image();
  	if (!imageLeaves) {
    	console.log('Failed to create the imageLeaves object');
    	return false;
	}
	var imageLeaves2 = new Image();
  	if (!imageLeaves2) {
    	console.log('Failed to create the imageLeaves2 object');
    	return false;
	}
	var imagePlank = new Image();
  	if (!imagePlank) {
    	console.log('Failed to create the imagePlank object');
    	return false;
	}
	// Register the event handler to be called on loading an image
	image.onload = function(){ sendImageToTEXTURE0(image); };
	imageGround.onload = function() {sendImageToTEXTURE1(imageGround); };
	imageGrass.onload = function() {sendImageToTEXTURE2(imageGrass); };
	imageSand.onload = function() {sendImageToTEXTURE3(imageSand); };
	imageBirch.onload = function() {sendImageToTEXTURE4(imageBirch); };
	imageLeaves.onload = function() {sendImageToTEXTURE5(imageLeaves); };
	imageLeaves2.onload = function() {sendImageToTEXTURE6(imageLeaves2); };
	imagePlank.onload = function() {sendImageToTEXTURE7(imagePlank); };

	// Tell the browser to load an image
	image.src = 'grass.jpg';
	imageGround.src = 'water.jpg';
	imageGrass.src = 'block.jpg'
	imageSand.src = 'sand.jpg'
	imageBirch.src = 'birch.jpg'
	imageLeaves.src = 'leaves.jpg'
	imageLeaves2.src = 'leaves2.jpg'
	imagePlank.src = 'plank.jpg'
	
	return true;
}

function sendImageToTEXTURE0(image) {
	var texture0 = gl.createTexture(); // Create a texture object
	if (!texture0) {
		console.log('Failed to create the texture object');
		return false;
	}

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
	// Enable the texture unit 0
	gl.activeTexture(gl.TEXTURE0);
	// Bind the texture object to the target
	gl.bindTexture(gl.TEXTURE_2D, texture0);
	// Set the texture parameters
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	// Set the texture image
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
	// Set the texture unit 0 to the sampler
	gl.uniform1i(u_Sampler0, 0);
	//gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
	console.log('finished loadTexture')
} 

function sendImageToTEXTURE1(image) {
	var texture1 = gl.createTexture(); // Create a texture object
	if (!texture1) {
		console.log('Failed to create the texture object');
		return false;
	}

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
	// Enabale the texture unit 0
	gl.activeTexture(gl.TEXTURE1);
	// Bind the texture object to the target
	gl.bindTexture(gl.TEXTURE_2D, texture1);
	// Set the texture parameters
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	// Set the texture image
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
	// Set the texture unit 0 to the sampler
	gl.uniform1i(u_Sampler1, 1);
	//gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
	console.log('finished loadTexture')
} 

function sendImageToTEXTURE2(image) {
	var texture0 = gl.createTexture(); // Create a texture object
	if (!texture0) {
		console.log('Failed to create the texture object');
		return false;
	}

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
	// Enable the texture unit 0
	gl.activeTexture(gl.TEXTURE2);
	// Bind the texture object to the target
	gl.bindTexture(gl.TEXTURE_2D, texture0);
	// Set the texture parameters
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	// Set the texture image
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
	// Set the texture unit 0 to the sampler
	gl.uniform1i(u_Sampler2, 2);
	//gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
	console.log('finished loadTexture')
} 

function sendImageToTEXTURE3(image) {
	var texture0 = gl.createTexture(); // Create a texture object
	if (!texture0) {
		console.log('Failed to create the texture object');
		return false;
	}

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
	// Enable the texture unit 0
	gl.activeTexture(gl.TEXTURE3);
	// Bind the texture object to the target
	gl.bindTexture(gl.TEXTURE_2D, texture0);
	// Set the texture parameters
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	// Set the texture image
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
	// Set the texture unit 0 to the sampler
	gl.uniform1i(u_Sampler3, 3);
	//gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
	console.log('finished loadTexture')
} 

function sendImageToTEXTURE4(image) {
	var texture0 = gl.createTexture(); // Create a texture object
	if (!texture0) {
		console.log('Failed to create the texture object');
		return false;
	}

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
	// Enable the texture unit 0
	gl.activeTexture(gl.TEXTURE4);
	// Bind the texture object to the target
	gl.bindTexture(gl.TEXTURE_2D, texture0);
	// Set the texture parameters
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	// Set the texture image
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
	// Set the texture unit 0 to the sampler
	gl.uniform1i(u_Sampler4, 4);
	//gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
	console.log('finished loadTexture')
} 

function sendImageToTEXTURE5(image) {
	var texture0 = gl.createTexture(); // Create a texture object
	if (!texture0) {
		console.log('Failed to create the texture object');
		return false;
	}

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
	// Enable the texture unit 0
	gl.activeTexture(gl.TEXTURE5);
	// Bind the texture object to the target
	gl.bindTexture(gl.TEXTURE_2D, texture0);
	// Set the texture parameters
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	// Set the texture image
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
	// Set the texture unit 0 to the sampler
	gl.uniform1i(u_Sampler5, 5);
	//gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
	console.log('finished loadTexture')
} 

function sendImageToTEXTURE6(image) {
	var texture0 = gl.createTexture(); // Create a texture object
	if (!texture0) {
		console.log('Failed to create the texture object');
		return false;
	}

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
	// Enable the texture unit 0
	gl.activeTexture(gl.TEXTURE6);
	// Bind the texture object to the target
	gl.bindTexture(gl.TEXTURE_2D, texture0);
	// Set the texture parameters
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	// Set the texture image
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
	// Set the texture unit 0 to the sampler
	gl.uniform1i(u_Sampler6, 6);
	//gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
	console.log('finished loadTexture')
} 

function sendImageToTEXTURE7(image) {
	var texture0 = gl.createTexture(); // Create a texture object
	if (!texture0) {
		console.log('Failed to create the texture object');
		return false;
	}

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
	// Enable the texture unit 0
	gl.activeTexture(gl.TEXTURE7);
	// Bind the texture object to the target
	gl.bindTexture(gl.TEXTURE_2D, texture0);
	// Set the texture parameters
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	// Set the texture image
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
	// Set the texture unit 0 to the sampler
	gl.uniform1i(u_Sampler7, 7);
	//gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw a rectangle
	console.log('finished loadTexture')
} 

function main() {

	// Setup canvas and GL variables
	setupWebGl();

	// Setup GLSL shader programs and connect GLSL variables
	connectVariablesToGLSL();

	// Setup action for the HTML UI elements
	addActionsForHtmlUI();

	initTextures();

	// Register function (event handler) to be called on a mouse press
	//canvas.onmousedown = click;
	//canvas.onmousemove = function (ev) { if(ev.buttons == 1) { click(ev) } };
	// Specify the color for clearing <canvas>
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	canvas.onmousedown = click;
  	canvas.onmousemove = function(ev) {if(ev.buttons == 1) {click(ev)}};

	document.onkeydown = keydown;

	requestAnimationFrame(tick);
	
}

function click(ev){
	if(ev.buttons == 1) {
		g_globalX = -ev.movementX;
		camera.mousePanLR(g_globalX);
	  }
	if(ev.buttons == 1) {
		g_globalY = -ev.movementY;
		camera.mousePanUD(g_globalY);
	}
	if (ev.shiftKey){
		g_poke = true;
	}
}

function tick() {
	g_seconds = performance.now()/400.0-g_startTime;

	//console.log(g_seconds);

	updateAnimationAngles();

	renderAllShapes();

	requestAnimationFrame(tick);
}


function updateAnimationAngles(){
	//for toggling animation
	if(g_animation){
	  g_rightArmAngle = 60*Math.sin(g_seconds);
	  g_leftArmAngle =  60*Math.sin(g_seconds);
	  g_leftLegAngle =  45*Math.sin(g_seconds);
	  g_rightLegAngle = 45*Math.sin(g_seconds);
	  g_headAngle1 =    10*Math.sin(g_seconds);
	  g_headAngle2 =    10*Math.sin(g_seconds);
	  g_rightEarAngle = 20*Math.sin(g_seconds);
	  g_leftEarAngle =  20*Math.sin(g_seconds);
	}

	var radius = 2; // Radius of the circle
	var speed = 0.5; // Speed of rotation

	if (lightRotate) {
		g_lightPos[0] = radius * Math.cos(speed * g_seconds);
		g_lightPos[2] = radius * Math.sin(speed * g_seconds);
	}
	
}

function keydown(ev) {
	if (ev.keyCode == 87) {         // W 
		camera.moveForward()
	}
	else if (ev.keyCode == 83) {    // S
		camera.moveBackward();   
	}
	if(ev.keyCode == 65) {          // A
		camera.moveLeft();
	  }
	  if(ev.keyCode == 68) {        // D
		camera.moveRight();
	  }
	  if(ev.keyCode == 81) {        // Q
		camera.panLeft();
	  }
	  if(ev.keyCode == 69) {        // E
		camera.panRight();
	  }
	  if(ev.keyCode == 90) {        // z
		camera.moveUp(0.5);
	  }
	  if(ev.keyCode == 88) {        // X
		camera.moveDown(0.5);
	  }
}

var g_map = [                                                                 

	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
	[1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

  ];

  var g_map2 = [                                                                 

	[0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
	[0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
	[0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
	[0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
	[0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
	[0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
	[0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],

 ];

  
  function drawMap() {
	var body = new Cube();
	for ( x = 0; x < 50; x++) {
	  for (y = 0; y < 50; y++) {
		if (g_map[x][y] == 1) {
		  //var body = new Cube();
		  body.textureNum = 0;
		  body.matrix.setTranslate(0,0,0);
		  body.matrix.translate(x-15, -0.75, y -15);
		  body.render();
		} else if (g_map[x][y] == 2) {
		  //var body = new Cube();
		  body.textureNum = 2;
		  body.matrix.setTranslate(0,0,0);
		  body.matrix.translate(x -15, 0.25, y -15);
		  body.matrix.scale(1.5,6,1.5)
		  body.render();
		  //var tree = new Cube();
		  body.textureNum = 5
		  body.color = [0.0384, 0.640, 0.0685, 1];
		  body.matrix.setTranslate(0,0,0);
		  body.matrix.translate(x -14, 5, y -16.5);
		  body.matrix.scale(3,3,3)
		  body.render();
		  //var tree = new Cube();
		  body.textureNum = 5
		  body.color = [0.0384, 0.640, 0.0685, 1];
		  body.matrix.setTranslate(0,0,0);
		  body.matrix.translate(x -17, 5, y -16.5);
		  body.matrix.scale(3,3,3)
		  body.render();
		  //var tree = new Cube();
		  body.textureNum = 5
		  body.color = [0.0384, 0.640, 0.0685, 1];
		  body.matrix.setTranslate(0,0,0);
		  body.matrix.translate(x -17, 5, y -14);
		  body.matrix.scale(3,3,3)
		  body.render();
		  //var tree = new Cube();
		  body.textureNum = 5
		  body.color = [0.0384, 0.640, 0.0685, 1];
		  body.matrix.setTranslate(0,0,0);
		  body.matrix.translate(x -14, 5, y -14);
		  body.matrix.scale(3,3,3)
		  body.render();
		  //var tree = new Cube();
		  body.textureNum = 5
		  body.color = [0.0384, 0.640, 0.0685, 1];
		  body.matrix.setTranslate(0,0,0);
		  body.matrix.translate(x -15.5, 7, y -15.2);
		  body.matrix.scale(3,3,3)
		  body.render();
	  } else if (g_map[x][y] == 3) {
		  body.textureNum = 7;
		  body.matrix.setTranslate(0,0,0);
		  body.matrix.translate(x -15, 0.25, y -15);
		  body.matrix.scale(1,7,1.5)
		  body.render();
	} else if (g_map[x][y] == 4) {
		  body.textureNum = 7;
		  body.matrix.setTranslate(0,0,0);
		  body.matrix.translate(x -15, 3.75, y -15);
		  body.matrix.scale(1,3.5,1.5)
		  body.render();
	}
	}
  }
}

function drawMap2() {
	var body = new Cube();
	for ( x = 0; x < 32; x++) {
	  for (y = 0; y < 32; y++) {
		if (g_map2[x][y] == 1) {
		  //var body = new Cube();
		  body.textureNum = 3;
		  body.matrix.setTranslate(0,0,0);
		  body.matrix.translate(x-60, -0.75, y -80);
		  body.render();
		} else if (g_map2[x][y] == 2) {
		  //var body = new Cube();
		  body.textureNum = 4;
		  body.matrix.setTranslate(0,0,0);
		  body.matrix.translate(x -60, 0.25, y -80);
		  body.matrix.scale(1.5,6,1.5)
		  body.render();
		  //var tree = new Cube();
		  body.textureNum = 6
		  body.color = [0.0384, 0.640, 0.0685, 1];
		  body.matrix.setTranslate(0,0,0);
		  body.matrix.translate(x -59, 5, y -81.5);
		  body.matrix.scale(3,3,3)
		  body.render();
		  //var tree = new Cube();
		  body.textureNum = 6
		  body.color = [0.0384, 0.640, 0.0685, 1];
		  body.matrix.setTranslate(0,0,0);
		  body.matrix.translate(x -62, 5, y -81.5);
		  body.matrix.scale(3,3,3)
		  body.render();
		  //var tree = new Cube();
		  body.textureNum = 6
		  body.color = [0.0384, 0.640, 0.0685, 1];
		  body.matrix.setTranslate(0,0,0);
		  body.matrix.translate(x -58, 5, y -79);
		  body.matrix.scale(3,3,3)
		  body.render();
		  //var tree = new Cube();
		  body.textureNum = 6
		  body.color = [0.0384, 0.640, 0.0685, 1];
		  body.matrix.setTranslate(0,0,0);
		  body.matrix.translate(x -59, 5, y -79);
		  body.matrix.scale(3,3,3)
		  body.render();
		  //var tree = new Cube();
		  body.textureNum = 6
		  body.color = [0.0384, 0.640, 0.0685, 1];
		  body.matrix.setTranslate(0,0,0);
		  body.matrix.translate(x -60.5, 7, y -80.2);
		  body.matrix.scale(3,3,3)
		  body.render();
	  } else if (g_map2[x][y] == 3) {
		  body.textureNum = 2;
		  body.matrix.setTranslate(0,0,0);
		  body.matrix.translate(x -60, 0.25, y -80);
		  body.matrix.scale(1.5,6,1.5)
		  body.render();
	  }
	}
  }
}


// Draw every shape that is supposed to be on the canvas
function renderAllShapes() {
	var startTime = performance.now();

	var ProjMat = new Matrix4();
	ProjMat.setPerspective(50, canvas.width/canvas.height, 0.1, 1000);
	gl.uniformMatrix4fv(u_ProjectionMatrix, false, ProjMat.elements);
	
	var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  	//globalRotMat = globalRotMat.rotate(g_globalAngle_v, 1, 0, 0);
  	gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

	var viewMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  	viewMat.setLookAt(camera.eye.elements[0],camera.eye.elements[1],camera.eye.elements[2], camera.at.elements[0],camera.at.elements[1],camera.at.elements[2], camera.up.elements[0],camera.up.elements[1],camera.up.elements[2] );
  	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//drawMap();
	//drawMap2();

	/*
	// Draw The Floor
	var floor = new Cube();
	floor.color = [0.0384, 0.640, 0.0685, 1];
	floor.textureNum = 1;
	floor.matrix.translate(0,-.75,0)
	floor.matrix.scale(200, -0.1, 200);
	floor.matrix.translate(-0.5,0,-0.5);
	floor.render();

	// Draw The Sky
	var sky = new Cube();
	//sky.color = [0, 0, 0, 1];
	sky.color = [0.407, 0.764, 0.970, 1];
	//sky.textureNum = 2;
	sky.matrix.scale(200, 200,200);
	sky.matrix.translate(-.5, -0.1,-.5);
	sky.render();

	var roof = new Cube();
	roof.textureNum = 7;
	roof.matrix.translate(-7,7.2,-7);
	roof.matrix.scale(35,1,35);
	roof.render();


	// Sun 
	var sun = new Cube();
	sun.color = [0.982, 1.00, 0.820, 1];
	//sky.textureNum = 0;
	sun.matrix.translate(-90, 60,80);
	sun.matrix.scale(12, 12,12);
	sun.render();
	*/

	gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
	gl.uniform3f(u_cameraPos, camera.eye.x, camera.eye.y, camera.eye.z);
	gl.uniform1i(u_lightOn, g_lightOn);
	gl.uniform3f(u_lightColor, g_lightColor[0], g_lightColor[1], g_lightColor[2]);

	// Draw Light
	var light = new Cube();
	light.color = [2,2,0,1];
	light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
	//light.matrix.translate(-0.05, 0.75, -0.5);
	//light.matrix.scale(-.1,-.1,-.1);
	light.matrix.translate(0.5, 0.5, 0.5);
	light.matrix.scale(-.1,-.1,-.1);
	light.render();

	// Draw Room
	var sky = new Cube();
	sky.color = [0.8, 0.8, 0.8, 1];
	sky.textureNum = -2;
	sky.matrix.scale(-7, -5, -10);
	sky.matrix.translate(-0.5, -0.85, -0.5);
	//sky.matrix.scale(-5, -5, -10);
	if (g_normalOn) sky.textureNum = -3
	sky.render();

	// Draw Sphere
	var sphere = new Sphere(10[1,0,0,0]);
	sphere.textureNum = 4;
	sphere.matrix.translate(2,0.5,2);
	if (g_normalOn) sphere.textureNum = -3
	sphere.render();

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
    leftShoe.color = black;
    leftShoe.matrix.translate(-.35, -0.85, 0); // Adjust position to match new leg length
    leftShoe.matrix.scale(0.15, 0.05, 0.2); // Small block for the shoe
    leftShoe.render();

    var rightShoe = new Cube();
    rightShoe.color = black;
    rightShoe.matrix.translate(0.05, -0.85, 0); // Adjust position to match new leg length
    rightShoe.matrix.scale(0.15, 0.05, 0.2); // Small block for the shoe
    rightShoe.render();



}