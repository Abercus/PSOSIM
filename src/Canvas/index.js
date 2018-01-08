import React, { Component } from 'react';
import * as THREE from 'three';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import Parser from './parser';
import OrbitControlsFactory from 'three-orbit-controls';

import './style.css'


const OrbitControls = OrbitControlsFactory(THREE);


function getOptimizationFunction(name) {
  if (name === 'sphere') {
    return Parser.parse('x^2 - y^2').toJSFunction( ['x','y'] );
  }
  throw Error();
}


function addition(v1,v2) {
  // adds v1 and v2

  return new THREE.Vector3(v1.x+v2.x, v1.y+v2.y, v1.z+v2.z);
}

function subtract(v1,v2,c,rand1) {
  return new THREE.Vector3(c*rand1*(v1.x-v2.x), c*rand1*(v1.y-v2.y), c*rand1*(v1.z-v2.z));
}


function euclidDistance(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2)
    + Math.pow(p1.y - p2.y, 2)
    + Math.pow(p1.z - p2.z, 2));
}


function testOptimizationFunction(p, opt_vector) {
  return euclidDistance(p, opt_vector);
}


// Class for whole population
class Population {
  constructor(pop, optimization_goal) {
    this.population = pop;
    this.gBest = null;
    this.gBestNumerical = null;
    //this.optimization_goal = {x:0, y:0, z:0};
    this.optimization_goal = optimization_goal;
  }


  set_optimization_goal(vector) {
    this.optimization_goal = vector;
    // When new goal then nullify bests
    this.gBest = null;
    this.gBestNumerical = null;
    for (var i=0; i<this.population.length; i++) {
      this.population[i].bestNumerical = testOptimizationFunction(this.population[i], vector);
      this.population[i].pBest = new THREE.Vector3(vector.x, vector.y, vector.z);

    }
    this.findPopulationBest();

  }

  update(phiP, phiG) {
    // Learning factors (c1 and c2). These can be sliders later (or input box)
    // TODO: put particle logic into particle's method.
    for (var i=0; i<this.population.length; i++) {
      var particle = this.population[i];
      var rand1 = Math.random();
      var rand2 = Math.random();
      particle.velocity = addition(particle.velocity, addition(subtract(particle.pBest, particle, phiP ,rand1),subtract(this.gBest, particle, phiG, rand2)));

      // Check max/min velocity.... TODO: Put this in update function..
      // Also all subtracting and adding should be in one function.
      // ARe there vector operations in js?

    //  console.log(addition(particle.velocity, addition(subtract(particle.pBest, particle, phiP,rand1),subtract(this.gBest, particle,phiG,rand2))));

      // CHECK VELOCITIES.. MAX LIMITS -LIMIT and LIMIT
      var LIMIT = 8;
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
      if (particle.velocity.z < -LIMIT) {
        particle.velocity.z = -LIMIT;
      }
      if (particle.velocity.z > LIMIT) {
        particle.velocity.z = LIMIT;
      }

      var newLocation = addition(particle, particle.velocity);

      //
      particle.x = newLocation.x;
      particle.y = newLocation.y;
      particle.z = newLocation.z;
      particle.currentNumerical = testOptimizationFunction(particle, this.optimization_goal);
      if (particle.currentNumerical < particle.bestNumerical) {
        particle.pBest = new THREE.Vector3(particle.x, particle.y, particle.z);
        particle.bestNumerical = particle.currentNumerical;
        if (particle.bestNumerical < this.gBestNumerical) {
          this.gBestNumerical = particle.bestNumerical;
          this.gBest = particle.pBest;
        }
      }
    }
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
    animate() {
      var rem = this.animate.bind(this);
      // Can do this better. SetTimeout shouldn't be a good idea
      this.pop.update(this.props.phiP, this.props.phiG);
      this.particleSystem.geometry.verticesNeedUpdate = true;
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(rem);
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
          map: this.createCircleTexture('#00ff00', 256),
          transparent: true,
          depthWrite: false
        })

        for (var p = 0; p < this.props.particlesNumber; p++) {
            var pX = Math.random() * 800 - 400,
            pY = Math.random() * 800 - 400,
            pZ = Math.random() * 800 - 400,
            particle = new THREE.Vector3(pX, pY, pZ);
            particle.velocity = new THREE.Vector3(0,0,0);
            particle.bestNumerical = testOptimizationFunction(particle,
              this.sphere.position);
            particle.pBest = new THREE.Vector3(pX, pY, pZ);

            // add it to the geometry
            this.particles.vertices.push(particle);
        }



        this.particleSystem = new THREE.Points(
            this.particles,
            this.pMaterial);
        this.particleSystem.sortParticles = true;
        this.pop = new Population(this.particles.vertices,
          this.sphere.position);
        this.pop.set_optimization_goal(this.sphere.position);


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
        this.renderer.setClearColor( 0x888888, 1 );
    }

    createGraph() {
      const segments = 20;
      const xMin = -250
      const xMax = 250
      const yMin = -250
      const yMax = 250
      const xRange = xMax - xMin;
      const yRange = yMax - yMin;
      const zFunc = getOptimizationFunction(this.props.optimizationFunction);

      const meshFunction = (x, y) => {
        x = xRange * x + xMin;
        y = yRange * y + yMin;
        var z = zFunc(x,y);
        if (isNaN(z))
          return new THREE.Vector3(0,0,0); // TODO: better fix
        else
          return new THREE.Vector3(x, y, z);
      };
      
      // true => sensible image tile repeat...
      const graphGeometry = new THREE.ParametricGeometry( meshFunction, segments, segments, true );
      
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
      for ( var i = 0; i < graphGeometry.vertices.length; i++ ) 
      {
        point = graphGeometry.vertices[ i ];
        color = new THREE.Color( 0x0000ff );
        color.setHSL( 0.7 * (zMax - point.z) / zRange, 1, 0.5 );
        graphGeometry.colors[i] = color; // use this array for convenience
      }
      // copy the colors as necessary to the face's vertexColors array.
      for ( var i = 0; i < graphGeometry.faces.length; i++ ) 
      {
        face = graphGeometry.faces[ i ];
        numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;
        for( var j = 0; j < numberOfSides; j++ ) 
        {
          vertexIndex = face[ faceIndices[ j ] ];
          face.vertexColors[ j ] = graphGeometry.colors[ vertexIndex ];
        }
      }
      ///////////////////////
      // end vertex colors //
      ///////////////////////
      
      // material choices: vertexColorMaterial, wireMaterial , normMaterial , shadeMaterial
      const wireTexture = new THREE.ImageUtils.loadTexture( 'images/square.png' );
      wireTexture.wrapS = wireTexture.wrapT = THREE.RepeatWrapping; 
      wireTexture.repeat.set( 40, 40 );

      const normMaterial = new THREE.MeshNormalMaterial;
      const shadeMaterial = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
      const wireMaterial = new THREE.MeshBasicMaterial( { map: wireTexture, vertexColors: THREE.VertexColors, side:THREE.DoubleSide } );
      const vertexColorMaterial  = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );
      
      if (this.graphMesh) {
        this.scene.remove(this.graphMesh);
        // renderer.deallocateObject( graphMesh );
      }

      wireMaterial.map.repeat.set( segments, segments );
      
      this.graphMesh = new THREE.Mesh( graphGeometry, wireMaterial );
      this.graphMesh.doubleSided = true;
      this.scene.add(this.graphMesh);
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.root.offsetWidth/this.root.offsetHeight, 0.1, 1000 );

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.root.offsetWidth, this.root.offsetHeight);
        this.root.appendChild(this.renderer.domElement);


        this.ballGeom = new THREE.SphereGeometry( 5, 32, 32 );
        this.ballMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        this.sphere = new THREE.Mesh( this.ballGeom, this.ballMaterial );
        this.scene.add(this.sphere);

        this.camera.position.set(0, 0, 500);

        this.mouse = { x: 0, y: 0, z: 0 }

        this.setupVisualization();
        this.resetSimulation();

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

        this.animate();
    }

    componentDidMount() {
        this.trackResize();
        this.setupScene();
    }

    shouldComponentUpdate() {
      return false;
    }

    render() {
        return <div className="Canvas" ref={root => { this.root = root; }}></div>
    }


}
