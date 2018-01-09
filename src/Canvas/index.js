import React, { Component } from 'react';
import * as THREE from 'three';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import Parser from './parser';
import OrbitControlsFactory from 'three-orbit-controls';

import './style.css'


const OrbitControls = OrbitControlsFactory(THREE);


function getOptimizationFunction(name) {


  // Eggholder
  return function(x, y) {
    return (-1)*(y+47)*Math.sin(Math.sqrt(Math.abs(x/2 + (y+47))))-x*Math.sin(
      Math.sqrt(Math.abs(x-(y+47))));
  }

  // Sphere
  return function(x, y) {
    return (0.005 * Math.pow(x, 2) + 0.005 * Math.pow(y, 2));
  }


  // Ackley
  return function(x, y) {
    return (-20 * Math.pow(Math.E, (-0.2 * Math.sqrt(0.5 * (Math.pow(x, 2) + Math.pow(y, 2)))))) - (Math.pow(Math.E, (0.5 * Math.cos(y * 2 * Math.PI))));
  }

  // Matyas
  return function(x, y) {
    return 0.26*(x^2+y^2) - 0.48*x*y;
  }

  // Himmelblau
  return function(x, y) {
    return (x^2+y-11)^2 + (x+y^2-7)^2;
  }

  if (name == "Himmelblau") {
    return Parser.parse('(x^2 + y - 11 )^2 + (x+y^2-7)^2').toJSFunction(["x", "y"]);
  }
  if (name === 'sphere') {
    return Parser.parse('(0.005 * x^2 + 0.005 * y^2)').toJSFunction( ['x','y'] );
  }
  throw Error();
}

var mod = function (n, m) {
    var remain = n % m;
    return Math.floor(remain >= 0 ? remain : remain + m);
};

function addition(v1,v2) {
  return new THREE.Vector3(v1.x+v2.x, v1.y+v2.y, v1.z+v2.z);
}
function addition_w(w,v1,v2) {
  return new THREE.Vector3(w*(v1.x+v2.x), w*(v1.y+v2.y), w*(v1.z+v2.z));
}

// Neither
function addition_2(v1,v2) {
    return new THREE.Vector3(v1.x+v2.x, v1.y+v2.y, v1.z);
}
// With inertia
function addition_2_w(w,v1,v2) {
    return new THREE.Vector3(w*(v1.x)+v2.x, w*(v1.y)+v2.y, v1.z);
}
// With constriction factor
function addition_3_w(w,v1,v2) {
    return new THREE.Vector3(w*(v1.x+v2.y), w*(v1.y+v2.y), v1.z);
}

function subtract(v1,v2,c,rand1) {
  return new THREE.Vector3(c*rand1*(v1.x-v2.x), c*rand1*(v1.y-v2.y), c*rand1*(v1.z-v2.z));
}

function subtract_2(v1,v2,c,rand1) {
    return new THREE.Vector3(c*rand1*(v1.x-v2.x), c*rand1*(v1.y-v2.y), v1.z);
}

function euclidDistance(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2)
    + Math.pow(p1.y - p2.y, 2)
    + Math.pow(p1.z - p2.z, 2));
}


function testOptimizationFunction(p, opt_vector) {
  return euclidDistance(p, opt_vector);
}

function throttle(callback, wait=0, context = this) {
  let timeout = null
  let callbackArgs = null

  const later = () => {
    callback.apply(context, callbackArgs)
    timeout = null
  }

  function throttled() {
    if (!timeout) {
      callbackArgs = arguments
      timeout = setTimeout(later, wait)
    }
  }

  throttled.setWait = (newWait) => {
    wait = newWait;
  };

  return throttled;
}

// Class for whole population
class Population {
  constructor(pop, optimizeByFunction, xMin, xMax, yMin, yMax) {
    this.population = pop;
    this.gBest = null;
    this.gBestNumerical = null;
    this.optimizeByFunction = optimizeByFunction;
    this.xMin = xMin;
    this.xMax = xMax;
    this.yMin = yMin;
    this.yMax = yMax;
    this.referenceTime = new Date().getTime();
  }

  set_optimization_goal(vector) {
    this.optimization_goal = vector;
    // When new goal then nullify bests
    this.gBest = null;
    this.gBestNumerical = null;
    for (var i=0; i<this.population.length; i++) {
      this.population[i].bestNumerical = testOptimizationFunction(this.population[i], vector);
      this.population[i].pBest = new THREE.Vector3(this.population[i].x, this.population[i].y, this.population[i].bestNumerical);

    }
    this.findPopulationBest();

  }

  set_optimization_function(func) {
    this.optimization_function = func;
    this.gBest = null;
    this.gBestNumerical = null;
    for (var i=0; i<this.population.length; i++) {
        this.population[i].bestNumerical = this.optimization_function(this.population[i].x, this.population[i].y);
        this.population[i].pBest = new THREE.Vector3(this.population[i].x, this.population[i].y, this.population[i].bestNumerical);

    }
    this.findPopulationBest();
  }


  updateParticle(particle) {
    // CHECK VELOCITIES.. MAX LIMITS -LIMIT and LIMIT. Can be made int o a slider.
    var LIMIT = 500;
    //LIMIT = 1;
    // Limit should depend on the task...
    if (particle.velocity.x < -LIMIT) {
      particle.velocity.x = -LIMIT;
    }
    if (particle.velocity.x > LIMIT) {
      particle.velocity.x = LIMIT;
    }
    if (particle.velocity.y < -LIMIT) {
      particle.velocity.y = -LIMIT;
    }
    if (particle.velocity.y > LIMIT) {
      particle.velocity.y = LIMIT;
    }
    if (!this.optimizeByFunction) {
      if (particle.velocity.z < -LIMIT) {
        particle.velocity.z = -LIMIT;
      }
      if (particle.velocity.z > LIMIT) {
        particle.velocity.z = LIMIT;
      }
    }

    // If bounded search area.
    var newLocation = addition(particle, particle.velocity);
    if (newLocation.x > this.xMax) {
      if (particle.velocity.x > 0) {
        particle.velocity.x *= -0.5;
      }
      newLocation.x = this.xMax;
    } else if (newLocation.x < this.xMin) {
        if (particle.velocity.x < 0) {
          particle.velocity.x *= -0.5;
        }
      newLocation.x = this.xMin;
    }
    if (newLocation.y > this.yMax) {
      if (particle.velocity.y > 0) {
        particle.velocity.y *= -0.5;
      }
        newLocation.y = this.yMax;
    } else if (newLocation.y < this.yMin) {
      if (particle.velocity.y < 0) {
        particle.velocity.y *= -0.5;
      }
        newLocation.y = this.yMin;
    }

    particle.x = newLocation.x;
    particle.y = newLocation.y;
    particle.z = newLocation.z;

    if (!this.optimizeByFunction) {
      particle.currentNumerical = testOptimizationFunction(particle, this.optimization_goal);
    } else {
      particle.currentNumerical = this.optimization_function(particle.x, particle.y);
      particle.z = particle.currentNumerical;

    }

    let best = null;
    if (particle.currentNumerical < particle.bestNumerical) {
      particle.pBest = new THREE.Vector3(particle.x, particle.y, particle.z);
      particle.bestNumerical = particle.currentNumerical;
      if (particle.bestNumerical < this.gBestNumerical) {
        this.gBestNumerical = particle.bestNumerical;
        this.gBest = particle.pBest;
        best = { time: new Date().getTime() - this.referenceTime, value: particle.bestNumerical };
      }
    }
    return best;
  }

  update(omega, phiP, phiG) {
    let best = null;
    for (let particle of this.population) {
      if (this.optimizeByFunction) {
        var rand1 = Math.random();
        var rand2 = Math.random();
        particle.velocity = addition_2_w(
          omega,
          particle.velocity,
          addition_2(
            subtract_2(particle.pBest, particle, phiP, rand1),
            subtract_2(this.gBest, particle, phiG, rand2)
          )
        );
      } else {
        particle.velocity = addition_2_w(omega, particle.velocity, addition(subtract(particle.pBest, particle, phiP, rand1),subtract(this.gBest, particle, phiG, rand2)));
      }

      const result = this.updateParticle(particle);
      best = result || best;
    }
    return best;
  }

  updateRing(omega, phiP, phiG) {
    let best = null;
    for (var i=0; i<this.population.length; i++) {
      var rand1 = Math.random();
      var rand2 = Math.random();
      var particle = this.population[i];
      var left_neighbour = this.population[mod(i-1, this.population.length)];
      var right_neighbour = this.population[mod(i+1, this.population.length)];
      // Who has the best personalBest
      var pB = particle.pBest;
      var pbNum = particle.bestNumerical;

      if (left_neighbour.bestNumerical < pbNum) {
        pbNum = left_neighbour.bestNumerical;
        pB = left_neighbour.pBest;
      }
      if (right_neighbour.bestNumerical < pbNum) {
        pbNum = right_neighbour.bestNumerical;
        pB = right_neighbour.pBest;
      }

      if (this.optimizeByFunction) {
          particle.velocity = addition_2_w(omega, particle.velocity, addition_2(subtract_2(particle.pBest, particle, phiP, rand1),subtract_2(pB, particle, phiG, rand2)));
      } else {
          particle.velocity = addition_w(omega, particle.velocity, addition(subtract(particle.pBest, particle, phiP, rand1),subtract(pB, particle, phiG, rand2)));
      }
      const result = this.updateParticle(particle);
      best = result || best;
    }
    return best;
  }

    updateRandomAdaptive(omega, phiP, phiG) {

        // Network does not exist yet.
        var k = 3;
        if (this.previousGBestNumerical) {
          if (this.previousGBestNumerical == this.gBestNumerical) {
            this.adaptionNetwork = null;
          }
        }
        this.previousGBestNumerical=this.gBestNumerical;
        // Array of arrays.
        if (!this.adaptionNetwork) {
          // k = 3
          this.adaptionNetwork = new Array(this.population.length);
          for (var i=0; i<this.population.length; i++) {
            this.adaptionNetwork[i] = [i]; // Everyone informs themselves
          }

          // Everyone informs k randoms
          for (var i=0; i<this.population.length; i++) {
            for (var j=0; j<k; j++) {
              this.adaptionNetwork[Math.floor(Math.random()*this.population.length)].push(i);
            }
          }
        }

        // update particles
        let best = null;
        for (var i=0; i<this.population.length; i++) {
          var particle = this.population[i];
          var rand1 = Math.random();
          var rand2 = Math.random();

          // Check through particles in its Network
          var pb = particle.pBest;
          var pbNum = particle.bestNumerical;
          for (var ind in this.adaptionNetwork[i]) {
            if (this.population[ind].bestNumerical < pbNum) {
              pbNum = this.population[ind].bestNumerical;
              pb = this.population[ind].pBest;
            }
          }

          if (this.optimizeByFunction) {
            particle.velocity = addition_2_w(omega, particle.velocity, addition_2(subtract_2(particle.pBest, particle, phiP, rand1),subtract_2(pb, particle, phiG, rand2)));
          } else {
            particle.velocity = addition_w(omega, particle.velocity, addition(subtract(particle.pBest, particle, phiP, rand1),subtract(pb, particle, phiG, rand2)));
          }

          const result = this.updateParticle(particle);
          best = result || best;
        }
        return best;
    }

  findPopulationBest() {
    var bestNumerical = this.population[0].bestNumerical;
    var best = this.population[0].pBest;
    for (var i=1; i<this.population.length; i++) {
      // Currently minimizing... Use a fitness function instead.
      // Might add a checker to maximize, dependent on task.
      if (this.population[i].bestNumerical < bestNumerical) {
        bestNumerical = this.population[i].bestNumerical;
        best = this.population[i].pBest;
      }
    }
    if (this.gBestNumerical) {
      if (bestNumerical < this.gBestNumerical) {
          this.gBestNumerical = bestNumerical;
          this.gBest = best;
      }
    } else {
      this.gBestNumerical = bestNumerical;
      this.gBest = best;
    }

  }
}

export default class Canvas extends Component {
    constructor() {
      super();
      this.segments = 200;
      this.xMin = -512;
      this.xMax = 512;
      this.yMin = -512;
      this.yMax = 512;
      this.xRange = this.xMax - this.xMin;
      this.yRange = this.yMax - this.yMin;
    }


    updateParticles = throttle(() => {
//      this.pop.update(this.props.omega, this.props.phiP, this.props.phiG);
      const newRecord = this.pop.updateRandomAdaptive(this.props.omega, this.props.phiP, this.props.phiG);
//      this.pop.updateRing(this.props.omega, this.props.phiP, this.props.phiG);
      this.particleSystem.geometry.verticesNeedUpdate = true;
      if (newRecord !== null) {
        this.props.onImprovement(newRecord);
      }
    })

    startAnimating(fps) {
        this.fpsInterval = 1000 / fps;
        this.then = Date.now();
        this.startTime = this.then;
        this.animate();
    }
    animate() {
      var rem = this.animate.bind(this);

      requestAnimationFrame(rem);


      var now = Date.now();
      var elapsed = now - this.then;
      // Can do this better. SetTimeout shouldn't be a good idea
      if (elapsed > this.fpsInterval) {
          this.then = now - (elapsed % this.fpsInterval);
          this.updateParticles();
          this.sphere.position.x = this.pop.gBest.x;
          this.sphere.position.y = this.pop.gBest.y;
          this.sphere.position.z = this.pop.gBest.z * this.zScale();

          this.particleSystem.geometry.verticesNeedUpdate = true;
           // This hack does not work.. think of something else..
          for (var i = 0; i < this.particles.vertices.length; i++) {
            this.particles.vertices[i].z *= this.zScale();
          }


          this.renderer.render(this.scene, this.camera);
      }
    }

    zScale(landscapeFlatness = this.props.landscapeFlatness) {
      return ((100 - landscapeFlatness) / 100);
    }

    // FROM HERE ADDITIONS.. RELOCATE.

    createCircleTexture(color, size) {
      var matCanvas = document.createElement('canvas');
      matCanvas.width = matCanvas.height = size;
      var matContext = matCanvas.getContext('2d');
      // create texture object from canvas.
      var texture = new THREE.Texture(matCanvas);
      // Draw a circle
      var center = size / 2;
      matContext.beginPath();
      matContext.arc(center, center, size/2, 0, 2 * Math.PI, false);
      matContext.closePath();
      matContext.fillStyle = color;
      matContext.fill();
      // need to set needsUpdate
      texture.needsUpdate = true;
      // return a texture made from the canvas
      return texture;
    }


    // FINISH ADDITIONS!!!! END

    trackResize() {
        this.resizeSensor = new ResizeSensor(this.root, () => {
            this.camera.aspect = this.root.offsetWidth/this.root.offsetHeight;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(this.root.offsetWidth, this.root.offsetHeight);
        });
    }

    resetSimulation() {
        const optimizationFunction = getOptimizationFunction(this.props.optimizationFunction);

        // MOve this
        this.scene.remove(this.particleSystem);
        this.particles =  new THREE.Geometry();

        this.pMaterial = new THREE.PointsMaterial({
          size: 10,
          map: this.createCircleTexture('#ff0000', 256),
          transparent: true,
          depthWrite: false
        })

        for (var p = 0; p < this.props.particlesNumber; p++) {
          var pX = Math.random() * 1024 - 512,
            pY = Math.random() * 1024 - 512;
            if (this.CLICKABLE_DEMO) {
              var pZ = Math.random() * 800 - 400;
            } else {
              var pZ = optimizationFunction(pX, pY);
            }

            var particle = new THREE.Vector3(pX, pY, pZ);
            //particle.velocity = new THREE.Vector3((Math.random()*1024-512 - pX)/2, (Math.random()*1024-512 - pY)/2, 0);
            // TODO: velocity initialization
            particle.velocity = new THREE.Vector3(Math.random()*20-10, Math.random()*20-10, 0);

            if (this.CLICKABLE_DEMO) {
              particle.bestNumerical = testOptimizationFunction(particle,
                this.sphere.position);
            } else {
              particle.bestNumerical = pZ;
            }
            particle.pBest = new THREE.Vector3(pX, pY, pZ);

            // add it to the geometry
            this.particles.vertices.push(particle);
        }

        this.particleSystem = new THREE.Points(
            this.particles,
            this.pMaterial);
        this.particleSystem.sortParticles = true;
        const bounds = [this.xMin, this.xMax, this.yMin, this.yMax];
        if (this.CLICKABLE_DEMO) {
          this.pop = new Population(this.particles.vertices, false, ...bounds);
          this.pop.set_optimization_goal(this.sphere.position);

        } else {
          this.pop = new Population(this.particles.vertices, true, ...bounds);
          this.pop.set_optimization_function(optimizationFunction);
        }

        this.particleSystem.geometry.verticesNeedUpdate = true;

        this.scene.add(this.particleSystem);
    }

    setupVisualization() {

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        const light = new THREE.PointLight(0xffffff);
        light.position.set(0,250,0);
        this.scene.add(light);

        this.scene.add( new THREE.AxisHelper() );
        // wireframe for xy-plane

        var wireframeMaterial = new THREE.MeshBasicMaterial( { color: 0x000088, wireframe: true, side:THREE.DoubleSide } );
        var floorGeometry = new THREE.PlaneGeometry(1000,1000,10,10);
        var floor = new THREE.Mesh(floorGeometry, wireframeMaterial);
        floor.position.z = -0.01;
        // rotate to lie in x-y plane
        // floor.rotation.x = Math.PI / 2;
        this.scene.add(floor);
        // bgcolor
        this.renderer.setClearColor( 0xbebebe, 1 );

        // Don't draw graph if not clickable demo.
        if (!this.CLICKABLE_DEMO) {
          this.createGraph();
        }
    }

    setupLandscapeColors(graphGeometry) {
      ///////////////////////////////////////////////
      // calculate vertex colors based on Z values //
      ///////////////////////////////////////////////
      graphGeometry.computeBoundingBox();
      const zMin = graphGeometry.boundingBox.min.z;
      const zMax = graphGeometry.boundingBox.max.z;
      const zRange = zMax - zMin;
      var color, point, face, numberOfSides, vertexIndex;
      // faces are indexed using characters
      var faceIndices = [ 'a', 'b', 'c', 'd' ];
      // first, assign colors to vertices as desired
      for ( var i = 0; i < graphGeometry.vertices.length; i++ ) {
        point = graphGeometry.vertices[ i ];
        color = new THREE.Color( 0x0000ff );
        color.setHSL( 0.7 * (zMax - point.z) / zRange, 1, 0.5 );
        graphGeometry.colors[i] = color; // use this array for convenience
      }
      // copy the colors as necessary to the face's vertexColors array.
      for ( var i = 0; i < graphGeometry.faces.length; i++ ) {
        face = graphGeometry.faces[ i ];
        numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;
        for( var j = 0; j < numberOfSides; j++ )
        {
          vertexIndex = face[ faceIndices[ j ] ];
          face.vertexColors[ j ] = graphGeometry.colors[ vertexIndex ];
        }
      }
    }

    createGraph() {
      const zFunc = getOptimizationFunction(this.props.optimizationFunction);

      const meshFunction = (x, y) => {
        x = this.xRange * x + this.xMin;
        y = this.yRange * y + this.yMin;
        var z = zFunc(x,y) * this.zScale();
        if (isNaN(z))
          return new THREE.Vector3(0,0,0); // TODO: better fix
        else
          return new THREE.Vector3(x, y, z);
      };

      // true => sensible image tile repeat...
      const graphGeometry = new THREE.ParametricGeometry(meshFunction, this.segments, this.segments, true );
      console.log(graphGeometry);
      this.setupLandscapeColors(graphGeometry);

      // material choices: vertexColorMaterial, wireMaterial , normMaterial , shadeMaterial
      const wireTexture = new THREE.ImageUtils.loadTexture( 'images/square.png' );
      wireTexture.wrapS = wireTexture.wrapT = THREE.RepeatWrapping;
      wireTexture.repeat.set( 40, 40 );

      const normMaterial = new THREE.MeshNormalMaterial();
      const shadeMaterial = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
      const wireMaterial = new THREE.MeshBasicMaterial({
        map: wireTexture,
        vertexColors: THREE.VertexColors,
        side:THREE.DoubleSide,
        transparent:true,
        opacity: 0.5
      });
      const vertexColorMaterial  = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

      if (this.graphMesh) {
        this.scene.remove(this.graphMesh);
        // renderer.deallocateObject( graphMesh );
      }

      wireMaterial.map.repeat.set( this.segments, this.segments );

      this.graphMesh = new THREE.Mesh( graphGeometry, wireMaterial );
      this.graphMesh.doubleSided = true;
      this.scene.add(this.graphMesh);
    }

    setupScene() {
        // Set true for clickable demo
        this.CLICKABLE_DEMO = false;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
          75, this.root.offsetWidth/this.root.offsetHeight, 0.1, 100000 );

        // ?
        //this.camera.near = 0.001;
        //this.camera.far = 100000;
        this.camera.up.set(0,0,1);
        this.renderer = new THREE.WebGLRenderer({logarithmicDepthBuffer: true, antialias:true});
        this.renderer.setSize(this.root.offsetWidth, this.root.offsetHeight);
        this.root.appendChild(this.renderer.domElement);

        // We won't need those otherwise.
        if (this.CLICKABLE_DEMO) {
          this.ballGeom = new THREE.SphereGeometry( 8, 32, 32 );
          this.ballMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
          this.sphere = new THREE.Mesh( this.ballGeom, this.ballMaterial );
          this.scene.add(this.sphere);
          this.mouse = { x: 0, y: 0, z: 0 };
        } else {
          this.ballGeom = new THREE.SphereGeometry( 5, 32, 32 );
          this.ballMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
          this.sphere = new THREE.Mesh( this.ballGeom, this.ballMaterial );
          this.scene.add(this.sphere);
        }


        if (this.CLICKABLE_DEMO) {
          this.camera.position.set(0, 0, 500);
        } else {
          // Set camera depending on task
          this.camera.position.set(0, 0, 750);
        }

        this.setupVisualization();
        this.resetSimulation();


        // Those either.
        if (this.CLICKABLE_DEMO) {

          // Add mousedown event
          this.renderer.domElement.addEventListener("mousedown", (event_info) => {
            event_info.preventDefault();
            this.mouse.x = ( event_info.clientX / window.innerWidth ) * 2 - 1;
            this.mouse.y = - ( event_info.clientY / window.innerHeight ) * 2 + 1;
            var x = this.mouse.x*this.root.offsetWidth;
            var y = this.mouse.y*this.root.offsetHeight;
            this.sphere.position.x = x;
            this.sphere.position.y = y;
            this.sphere.position.z = 0;
            this.pop.set_optimization_goal({ x: x, y: y, z: this.mouse.z });

          });

        // Set random interval to pick new locations.. Move this stuff.
          setInterval(() => {
              var x = Math.random() * 500 - 250;
              var y = Math.random() * 500 - 250;
              var z = Math.random() * 500 - 250;
              this.pop.set_optimization_goal({x:x,
                  y:y, z:z});
              this.sphere.position.x = x;
              this.sphere.position.y = y;
              this.sphere.position.z = z;
            },
            10000);
        }

        this.startAnimating(30);
    }

    componentDidMount() {
        this.trackResize();
        this.setupScene();
    }

    shouldComponentUpdate() {
      return false;
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.playbackSpeed !== this.props.playbackSpeed) {
        this.updateParticles.setWait(1000 / nextProps.playbackSpeed);
      }
      if (nextProps.landscapeFlatness !== this.props.landscapeFlatness) {
        const zFunc = getOptimizationFunction(this.props.optimizationFunction);
        for (let vertice of this.graphMesh.geometry.vertices) {
          vertice.z = zFunc(vertice.x, vertice.y) * this.zScale(nextProps.landscapeFlatness);
        }
        this.graphMesh.geometry.verticesNeedUpdate = true;
      }
      if (nextProps.landscapeOpacity !== this.props.landscapeOpacity) {
        this.graphMesh.material.opacity = nextProps.landscapeOpacity / 100;
        this.graphMesh.material.needsUpdate = true;
      }
    }

    render() {
        return <div className="Canvas" ref={root => { this.root = root; }}></div>
    }
}