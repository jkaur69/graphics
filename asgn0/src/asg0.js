var ctx;
var canvas;


function drawVector(v, color){
   ctx.strokeStyle = color; // Set color
   ctx.beginPath();
   ctx.moveTo(canvas.width/2, canvas.height/2);
   ctx.lineTo(200+v.elements[0]*20, 200-v.elements[1]*20, 0);
   ctx.stroke();
};

function handleDrawEvent(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    var x = document.getElementById('x').value;
    var y = document.getElementById('y').value;
    var x2 = document.getElementById('x2').value;
    var y2 = document.getElementById('y2').value;

    var v1 = new Vector3([x, y, 0.0]);
    var v2 = new Vector3([x2, y2, 0.0]);
    drawVector(v1, "red");
    drawVector(v2, "blue");
};

function angleBetween(v1, v2){
  var dot = Vector3.dot(v1, v2)
  var mag_x = v1.magnitude()
  var mag_y = v2.magnitude()
  return (180/Math.PI) * (Math.acos(dot / (mag_x * mag_y)))
};

function areaTriangle(v1, v2){
  var cross = Vector3.cross(v1,v2)
  var mag = cross.magnitude();
  var area = mag / 2;
  return area;
};

// help from chatgpt on this function 
function handleDrawOperationEvent() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    var x = document.getElementById('x').value;
    var y = document.getElementById('y').value;
    var x2 = document.getElementById('x2').value;
    var y2 = document.getElementById('y2').value;

    var v1 = new Vector3([x, y, 0.0]);
    var v2 = new Vector3([x2, y2, 0.0]);
    var v3 = new Vector3();
    var v4 = new Vector3();
    drawVector(v1, "red");
    drawVector(v2, "blue");

    var opt = document.getElementById('opt').value;
    var scalar = document.getElementById('scalar').value;
    if (opt == 'Add') {
      v3.set(v1);
      v3.add(v2);
      drawVector(v3, "green");
    }
    else if (opt == "Subtract") {
      v3.set(v1);
      v3.sub(v2);
      drawVector(v3, "green");
    }
    else if (opt == "Multiply") {
      v3.set(v1);
      v3.mul(scalar);
      drawVector(v3, "green");
      v4.set(v2);
      v4.mul(scalar);
      drawVector(v4, "green");
    }
    else if (opt == "Divide") {
      v3.set(v1);
      v3.div(scalar);
      drawVector(v3, "green");
      v4.set(v2);
      v4.div(scalar);
      drawVector(v4, "green");
    }
    else if (opt == "Magnitude") {
      console.log("Magnitude v1:", v1.magnitude())
      console.log("Magnitude v2:", v2.magnitude())
    }
    else if (opt == "Normalize") {
      drawVector(v1.normalize(), "green");
      drawVector(v2.normalize(), "green");
    }
    else if (opt == "Angle Between") {
      console.log("Angle:", angleBetween(v1, v2))
    }
    else if (opt == "Area") {
      console.log("Area of the Triangle:", areaTriangle(v1, v2))
    }
};

function main() {
  // Retrieve <canvas> element
  canvas = document.getElementById('example');
  if (!canvas) {
    console.log('Failed to retrieve the <canvas> element');
    return false;
  }

  ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a black color
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  var v0 = new Vector3([2.25, 2.25, 0]);
  drawVector(v0, "red");

  // Black blackground

};

