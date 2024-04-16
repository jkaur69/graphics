// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program

var VSHADER_SOURCE = `
	attribute vec4 a_Position;
	uniform float u_Size;
	void main() {
		gl_Position = a_Position;
		gl_PointSize = u_Size;
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
let u_Size;

function setupWebGl() {
	// Retrieve <canvas> element
	canvas = document.getElementById('webgl');

	// Get the rendering context for WebGL
	gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
	if (!gl) {
	  console.log('Failed to get the rendering context for WebGL');
	  return;
	}
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

	// Get the storage location of u_Size
	u_Size = gl.getUniformLocation(gl.program, 'u_Size');
	if (!u_Size) {
		console.log('Failed to get the storage location of u_Size');
		return;
	}
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Globals related to UI elements
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSegment = 10;
let g_undoList = [];
let drawBool = false;

// Set up actions for HTML UI elements
function addActionsForHtmlUI() {
	// Button Events (Shape Type)
	//document.getElementById('green').onclick =    function() { g_selectedColor = [0.0, 1.0, 0.0, 1.0]; };
	//document.getElementById('red').onclick   =    function() { g_selectedColor = [1.0, 0.0, 0.0, 1.0]; };
	document.getElementById('clear').onclick =     function() { g_shapesList = []; drawBool = false; renderAllShapes();};
	document.getElementById('point').onclick   =   function() { g_selectedType = POINT };
	document.getElementById('triangle').onclick =  function() { g_selectedType = TRIANGLE };
	document.getElementById('circle').onclick =    function() { g_selectedType = CIRCLE };
	document.getElementById('myDrawing').onclick = function() { gl.clear(gl.COLOR_BUFFER_BIT);
		g_shapesList = [];; house(); };
	document.getElementById('undo').onclick =      function() { renderAllButRecentShape(); };

	// Color Slider Events
    document.getElementById('redSlide').addEventListener('mouseup',   function() { g_selectedColor[0] = this.value/100; });
	document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100; });
    document.getElementById('blueSlide').addEventListener('mouseup',  function() { g_selectedColor[2] = this.value/100; });

	// Size Slider Events
	document.getElementById('sizeSlide').addEventListener('mouseup',  function() { g_selectedSize = this.value; });

	// Circle Segments Slider
}	document.getElementById('circleSegment').addEventListener('mouseup',  function() { g_selectedSegment = this.value; });


function main() {

	// Setup canvas and GL variables
	setupWebGl();

	// Setup GLSL shader programs and connect GLSL variables
	connectVariablesToGLSL();

	// Setup action for the HTML UI elements
	addActionsForHtmlUI();

	// Register function (event handler) to be called on a mouse press
	canvas.onmousedown = click;
	canvas.onmousemove = function (ev) { if(ev.buttons == 1) { click(ev) } };
	// Specify the color for clearing <canvas>
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_shapesList = [];

function click(ev) {

	// Extract the event click and return it in WebGL coordinates
	let [x, y] = convertCoordinatesEventToGL(ev);

	// Create and store the new point
	let point;
	if (g_selectedType == POINT) {
		point = new Point(); 
	} else if (g_selectedType == TRIANGLE) {
		point = new Triangle();
	} else {
		point = new Circle();
	}

	point.position = [x, y]
	point.color = g_selectedColor.slice();
	point.size = g_selectedSize;
	point.segments = g_selectedSegment;
	g_undoList.push([...g_shapesList]);
	g_shapesList.push(point);


	// Store the coordinates to g_points array
	// if (x >= 0.0 && y >= 0.0) {      // First quadrant
	//	g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
	//} else if (x < 0.0 && y < 0.0) { // Third quadrant
	//	g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
	//} else {                         // Others
	//	g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
	//}

	// Draw every shape that is supposed to be in the canvas
	renderAllShapes();
}

// Extract the event click and return it in WebGL coordinates
function convertCoordinatesEventToGL(ev) {
	var x = ev.clientX; // x coordinate of a mouse pointer
	var y = ev.clientY; // y coordinate of a mouse pointer
	var rect = ev.target.getBoundingClientRect();

	x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
	y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

	return ([x, y]);
}	

// Draw every shape that is supposed to be on the canvas
function renderAllShapes() {
	// Clear <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);

	if (drawBool) {
		house();
	  }

	var len = g_shapesList.length;
	for(var i = 0; i < len; i++) {
		
		g_shapesList[i].render();
	}
}

function renderAllButRecentShape() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	drawBool = false;
	g_shapesList.pop();
    for (let i = 0; i < g_shapesList.length; i++) {
        g_shapesList[i].render();
    }
}