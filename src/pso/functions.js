export function getOptimizationParams(name) {

  if (name === "matyas") {
    return {xMin:-5, xMax:5,
      yMin:-5, yMax:5,
      speed:0.1, cameraHeight:20,
      particleSize: 0.2};
  }
  if (name === "himmelblau") {
    return {xMin:-5, xMax:5,
      yMin:-5, yMax:5,
      speed:0.3, cameraHeight:50,
      particleSize: 0.3};
  }
  if (name === "ackley") {
      return {xMin:-5, xMax:5,
        yMin:-5, yMax:5,
        speed:0.1, cameraHeight:13,
        particleSize: 0.2};
  }
  if (name === "rastrigin") {
      return {xMin:-5.12, xMax:5.12,
        yMin:-5.12, yMax:5.12,
        speed:0.5, cameraHeight:20,
        particleSize: 0.3};
  }
  if (name === "holder") {
      return {xMin:-10, xMax:10,
        yMin:-10, yMax:10,
        speed:1, cameraHeight:20,
        particleSize: 0.3};
  }
  if (name === "booth") {
      return {xMin:-10, xMax:10,
        yMin:-10, yMax:10,
        speed:0.3, cameraHeight:70,
        particleSize: 0.4};
  }
  if (name === "eggholder") {
    return {xMin:-512, xMax:512,
      yMin:-512, yMax:512,
      speed:5, cameraHeight:750,
      particleSize: 10};
  }
  if (name === "sphere") {
    return {xMin:-800, xMax:800,
      yMin:-800, yMax:800,
      speed:8, cameraHeight:2300,
      particleSize: 25};
  }

  return {xMin:-512, xMax:512,
    yMin:-512, yMax:512,
    speed:10, cameraHeight:750,
    particleSize: 10};
}

export function getOptimizationFunction(name) {
    if (name === "matyas") {
      // Matyas
      return function(x, y) {
        return 0.26*(x^2+y^2) - 0.48*x*y;
      }
    }
    if (name === 'rastrigin') {
      // A = 10, rastrigin, n = 2
      return function(x, y) {
        return 20 + (x*x - 10*Math.cos(2*Math.PI*x)) + (y*y - 10*Math.cos(2*Math.PI*y));
      }
    }

    if (name === "holder") {
      return function(x,y) {
      // Holder table function
        return -Math.abs(Math.sin(x)*Math.cos(y)*Math.exp(Math.abs(1-(Math.sqrt(x*x+y*y)/Math.PI))));
      }
    }

    if (name === 'booth') {
      // Booth
      return function(x, y) {
        return (Math.pow(x+2*y-7, 2) + Math.pow(2*x+y-5, 2));
      }
    }

    if (name === 'sphere') {
      // Sphere
      return function(x, y) {
        return (0.005 * Math.pow(x, 2) + 0.005 * Math.pow(y, 2));
      }
    }
    if (name === 'eggholder') {
      // Eggholder
      return function(x, y) {
        return (-1)*(y+47)*Math.sin(Math.sqrt(Math.abs(x/2 + (y+47))))-x*Math.sin(
              Math.sqrt(Math.abs(x-(y+47))));
        }
    }
    if (name === 'ackley') {
      // Ackley
        return function(x, y) {
          return (-20 * Math.pow(Math.E, (-0.2 * Math.sqrt(0.5 * (Math.pow(x, 2) + Math.pow(y, 2)))))) - (Math.pow(Math.E, (0.5 * Math.cos(y * 2 * Math.PI)))) + 20;
        }
    }

    if (name === "himmelblau") {
        return function(x, y) {
          return Math.pow((x*x+y-11),2) + Math.pow((x+y*y-7),2);
        }
    }
    if (name === "demo") {
      // TODO, put actualy demo here.
      return function(x, y) {
        return (-20 * Math.pow(Math.E, (-0.2 * Math.sqrt(0.5 * (Math.pow(x, 2) + Math.pow(y, 2)))))) - (Math.pow(Math.E, (0.5 * Math.cos(y * 2 * Math.PI))));
      }

    }


  throw Error();
}
