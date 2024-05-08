class Camera {
    constructor() {
        this.type = 'camera';
        this.fov = 60.0;
        this.eye = new Vector3([-40,2,-70]);
        this.at = new Vector3([-10,0,100]);
        this.up = new Vector3([0,5,0]);
        this.speed = 0.5;
    }
  
    moveForward() {
      let f = new Vector3();
      f.set(this.at);
      f.sub(this.eye);
      f.normalize();
      // set y-component to 0
      f.elements[1] = 0;
      f.mul(this.speed);
      this.eye.add(f);
      this.at.add(f);
    }
    
  
    moveBackward(){
      let b = new Vector3();
      b.set(this.eye);
      b.sub(this.at);
      b.normalize();
      b.elements[1] = 0;
      b.mul(this.speed);
      this.eye.add(b);
      this.at.add(b);
    }
  
    moveLeft() {
      let f = new Vector3();
      f.set(this.at);
      f.sub(this.eye);
      let s = Vector3.cross(this.up, f);
      s.normalize();
      s.mul(this.speed);
      this.eye.add(s);
      this.at.add(s);
    }
  
  moveRight() {
      let f = new Vector3();
      f.set(this.at);
      f.sub(this.eye);
      let s = Vector3.cross(f, this.up);
      s.normalize();
      s.mul(this.speed);
      this.eye.add(s);
      this.at.add(s);
    }
    panLeft() {
      let f = new Vector3();
      f.set(this.at);
      f.sub(this.eye);
      let rotationMatrix = new Matrix4();
      rotationMatrix.setRotate(2, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
      let f_prime = rotationMatrix.multiplyVector3(f);
      this.at = f_prime.add(this.eye);
  }
  
    panRight() {
      let f = new Vector3();
      f.set(this.at);
      f.sub(this.eye);
      let rotationMatrix = new Matrix4();
      rotationMatrix.setRotate(-2, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
      let f_prime = rotationMatrix.multiplyVector3(f);
      this.at = f_prime.add(this.eye);
    }
  
    mousePanLR(alpha) {
      var f = new Vector3();
      f.set(this.at);
      f.sub(this.eye);
      let rotationMatrix = new Matrix4();
      rotationMatrix.setRotate(1*alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
      let f_prime = rotationMatrix.multiplyVector3(f);
      this.at = f_prime.add(this.eye);
    }

    mousePanUD(alpha) {
      let f = new Vector3();
      f.set(this.at);
      f.sub(this.eye);
      let s = Vector3.cross(f, this.up);
      s.normalize();
      let rotationMatrix = new Matrix4();
      rotationMatrix.setRotate(alpha, s.elements[0], s.elements[1], s.elements[2]);
      let f_prime = rotationMatrix.multiplyVector3(f);
      this.at = f_prime.add(this.eye);
    }
    

    moveUp(distance) {
      this.eye.elements[1] += distance;
      this.at.elements[1] += distance;
  }

    moveDown(distance) {
        this.eye.elements[1] -= distance;
        this.at.elements[1] -= distance;
    }
  }