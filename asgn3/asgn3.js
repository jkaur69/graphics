// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program

var VSHADER_SOURCE = `
	attribute vec4 a_Position;
	uniform mat4 u_ModelMatrix;
	uniform mat4 u_GlobalRotateMatrix;
	void main() {
		gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
	}`

// Fragment shader program
var FSHADER_SOURCE = `
	precision mediump float;
	uniform vec4 u_FragColor; 
	void main() {
		gl_FragColor = u_FragColor;
}`

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

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

	// // Get the storage location of a_Position
	a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0) {
		console.log('Failed to get the storage location of a_Position');
		return;
	}

	// Get the storage location of u_FragColor
	u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
	if (!u_FragColor) {
		console.log('Failed to get the storage location of u_FragColor');
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
var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;


// Set up actions for HTML UI elements
function addActionsForHtmlUI() {
	// Camera Angle Slider 
	document.getElementById('angleSlide').addEventListener('mousemove',  function() { g_globalAngle = this.value; renderAllShapes(); });

	// Camera Angle Slider
	document.getElementById('angleSlide_v').addEventListener('mousemove', function() {g_globalAngle_v = this.value; renderAllShapes();}); 

	// Head Slider 1
	document.getElementById('headSlide1').addEventListener('mousemove',  function() { g_headAngle1 = this.value; renderAllShapes(); });

	// Head Slider 2
	document.getElementById('headSlide2').addEventListener('mousemove',  function() { g_headAngle2 = this.value; renderAllShapes(); });

	// Left Arm Slider
	document.getElementById('leftArmSlide').addEventListener('mousemove',  function() { g_leftArmAngle = this.value; renderAllShapes(); });

	// Right Arm Slider
	document.getElementById('rightArmSlide').addEventListener('mousemove',  function() { g_rightArmAngle = this.value; renderAllShapes(); });

	// Left Leg Slider
	//document.getElementById('leftLegSlide').addEventListener('mousemove',  function() { g_leftLegAngle = this.value; renderAllShapes(); });

	// Right Leg Slider
	//document.getElementById('rightLegSlide').addEventListener('mousemove',  function() { g_rightLegAngle = this.value; renderAllShapes(); });

	// Left Ear Slider
	//document.getElementById('leftEarSlide').addEventListener('mousemove',  function() { g_leftEarAngle = this.value; renderAllShapes(); });

	// Right Ear Slider
	//document.getElementById('rightEarSlide').addEventListener('mousemove',  function() { g_rightEarAngle = this.value; renderAllShapes(); });

	// Animation On
	document.getElementById('animationOn').onclick = function() {g_animation = true; };

	// Animation Off
	document.getElementById('animationOff').onclick = function() {g_animation = false; };

	// Poke Animation Off
	document.getElementById('stopPoke').onclick = function() {
		g_poke = false; 
		g_rightArmAngle = 0;
		g_leftArmAngle =  0;
		g_leftLegAngle =  0;
		g_rightLegAngle = 0;
		g_headAngle1 =   0;
		g_headAngle2 =    0;
		g_rightEarAngle =0;
		g_bodyAngle = 0;
		g_leftEarAngle =  0;};

}


function main() {

	// Setup canvas and GL variables
	setupWebGl();

	// Setup GLSL shader programs and connect GLSL variables
	connectVariablesToGLSL();

	// Setup action for the HTML UI elements
	addActionsForHtmlUI();

	// Register function (event handler) to be called on a mouse press
	//canvas.onmousedown = click;
	//canvas.onmousemove = function (ev) { if(ev.buttons == 1) { click(ev) } };
	// Specify the color for clearing <canvas>
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	canvas.onmousedown = click;
  	canvas.onmousemove = function(ev) {if(ev.buttons == 1) {click(ev)}};

	requestAnimationFrame(tick);
	
}

function click(ev){
	if (ev.shiftKey){
		g_poke = true;
	}
}

function tick() {
	g_seconds = performance.now()/500.0-g_startTime;

	console.log(g_seconds);

	updateAnimationAngles();

	renderAllShapes();

	requestAnimationFrame(tick);
}

var roar = new Audio('BearRoar.mp3');

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
	//call new animation
	if (g_poke == true) {
	  g_seconds = performance.now()/500.0-g_startTime;
	  g_rightArmAngle = 180*Math.sin(g_seconds);
	  g_leftArmAngle =  180*Math.sin(g_seconds);
	  g_leftLegAngle =  180*Math.sin(g_seconds);
	  g_rightLegAngle = 180*Math.sin(g_seconds);
	  g_headAngle1 =    180*Math.sin(g_seconds);
	  g_headAngle2 =    180*Math.sin(g_seconds);
	  g_rightEarAngle = 180*Math.sin(g_seconds);
	  g_leftEarAngle =  180*Math.sin(g_seconds);
	  g_bodyAngle =     180*Math.sin(g_seconds);
	  roar.play();
	}
}


// Draw every shape that is supposed to be on the canvas
function renderAllShapes() {
	var startTime = performance.now();

	var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  	globalRotMat = globalRotMat.rotate(g_globalAngle_v, 1, 0, 0);
  	gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	drawCubes();

	// Check the time at the nd of the function, and show on web page
	var duration = performance.now() - startTime;
	sendTextToHTML(" MS: " + Math.floor(duration) + "| FPS: " + Math.floor(10000 / duration) / 10, "numdot");

}

function sendTextToHTML(text, HTMLID){
	var HTMLElem = document.getElementById(HTMLID);
	if(!HTMLElem){
	  printL("Failed to get "+HTMLID+" from HTML");
	  return;
	}
	HTMLElem.innerHTML = text;
  }