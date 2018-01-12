/*
Definitions of functions which can be optimized for.
For them to show up in the application also need to change options in options.js
xMin,xMax,yMin,yMax are search area bounds.
Out of those function landscape will not be drawn or particles simulated.
Speed is initial speed setting.
cameraHeight is the height of the camera which is set when choosing function.
particleSize is the size of the particle in the simulation.
*/

export function getOptimizationParams(name) {

  if (name === "cross") {
    return {
      xMin: -10,
      xMax: 10,
      yMin: -10,
      yMax: 10,
      speed: 1,
      cameraHeight: 20,
      particleSize: 0.35
    };
  }
  if (name === "styblinski") {
    return {
      xMin: -5,
      xMax: 5,
      yMin: -5,
      yMax: 5,
      speed: 0.3,
      cameraHeight: 20,
      particleSize: 0.25
    };
  }

  if (name === "matyas") {
    return {
      xMin: -5,
      xMax: 5,
      yMin: -5,
      yMax: 5,
      speed: 0.1,
      cameraHeight: 20,
      particleSize: 0.25
    };
  }
  if (name === "himmelblau") {
    return {
      xMin: -5,
      xMax: 5,
      yMin: -5,
      yMax: 5,
      speed: 0.3,
      cameraHeight: 50,
      particleSize: 0.3
    };
  }
  if (name === "ackley") {
    return {
      xMin: -5,
      xMax: 5,
      yMin: -5,
      yMax: 5,
      speed: 0.1,
      cameraHeight: 13,
      particleSize: 0.2
    };
  }
  if (name === "rastrigin") {
    return {
      xMin: -5.12,
      xMax: 5.12,
      yMin: -5.12,
      yMax: 5.12,
      speed: 0.5,
      cameraHeight: 20,
      particleSize: 0.2
    };
  }
  if (name === "holder") {
    return {
      xMin: -10,
      xMax: 10,
      yMin: -10,
      yMax: 10,
      speed: 1,
      cameraHeight: 20,
      particleSize: 0.3
    };
  }
  if (name === "booth") {
    return {
      xMin: -10,
      xMax: 10,
      yMin: -10,
      yMax: 10,
      speed: 0.3,
      cameraHeight: 70,
      particleSize: 0.8
    };
  }
  if (name === "eggholder") {
    return {
      xMin: -512,
      xMax: 512,
      yMin: -512,
      yMax: 512,
      speed: 5,
      cameraHeight: 750,
      particleSize: 12
    };
  }
  if (name === "sphere") {
    return {
      xMin: -800,
      xMax: 800,
      yMin: -800,
      yMax: 800,
      speed: 8,
      cameraHeight: 2300,
      particleSize: 25
    };
  }
  if (name === "demo") {
    return {
      xMin: -1000,
      xMax: 1000,
      yMin: -1000,
      yMax: 1000,
      speed: 10,
      cameraHeight: 2000,
      particleSize: 40,
      demoMode: true
    };
  }
  return {
    xMin: -512,
    xMax: 512,
    yMin: -512,
    yMax: 512,
    speed: 10,
    cameraHeight: 750,
    particleSize: 10
  };
}

export function getOptimizationFunction(name) {
  if (name === "cross") {
    // Cross-in-tray
    return function(x, y) {
      return -0.0001 * Math.pow((
          Math.abs(
            Math.sin(x) * Math.sin(y) * Math.exp(
              Math.abs(100 - (Math.sqrt(x * x + y * y) / Math.PI)) +
              1))),
        0.1);
    }
  }

  if (name === 'styblinski') {
    // Styblinski-Tang
    return function(x, y) {
      return (Math.pow(x, 4) - 16 * Math.pow(x, 2) + 5 * x + Math.pow(y, 4) - 16 * Math.pow(y, 2) + 5 * y) / 2;
    }
  }
  if (name === "matyas") {
    // Matyas
    return function(x, y) {
      return 0.26 * (x ^ 2 + y ^ 2) - 0.48 * x * y;
    }
  }
  if (name === 'rastrigin') {
    // A = 10, rastrigin, n = 2
    return function(x, y) {
      return 20 + (x * x - 10 * Math.cos(2 * Math.PI * x)) + (y * y - 10 * Math.cos(2 * Math.PI * y));
    }
  }

  if (name === "holder") {
    return function(x, y) {
      // Holder table function
      return -Math.abs(Math.sin(x) * Math.cos(y) * Math.exp(Math.abs(1 - (Math.sqrt(x * x + y * y) / Math.PI))));
    }
  }

  if (name === 'booth') {
    // Booth
    return function(x, y) {
      return (Math.pow(x + 2 * y - 7, 2) + Math.pow(2 * x + y - 5, 2));
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
      return (-1) * (y + 47) * Math.sin(Math.sqrt(Math.abs(x / 2 + (y + 47)))) - x * Math.sin(
        Math.sqrt(Math.abs(x - (y + 47))));
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
      return Math.pow((x * x + y - 11), 2) + Math.pow((x + y * y - 7), 2);
    }
  }
  if (name === "demo") {
    return function() {
      return 0;
    }

  }


  throw Error();
}
