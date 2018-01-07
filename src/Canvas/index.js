import React, { Component } from 'react';
import * as THREE from 'three';
import ResizeSensor from 'css-element-queries/src/ResizeSensor.js';

import './style.css'



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

  update() {
    // Learning factors (c1 and c2). These can be sliders later (or input box)
    var c1 = 2, c2 = 2;
    // TODO: put particle logic into particle's method.
    for (var i=0; i<this.population.length; i++) {
      var particle = this.population[i];
      var rand1 = Math.random();
      var rand2 = Math.random();
      particle.velocity = addition(particle.velocity, addition(subtract(particle.pBest, particle,c1,rand1),subtract(this.gBest, particle,c2,rand2)));

      // Check max/min velocity.... TODO: Put this in update function..
      // Also all subtracting and adding should be in one function.
      // ARe there vector operations in js?

    //  console.log(addition(particle.velocity, addition(subtract(particle.pBest, particle,c1,rand1),subtract(this.gBest, particle,c2,rand2))));

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
      this.pop.update();
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
        // MOve this

        this.particles =  new THREE.Geometry();
        this.particleCount = 50;

        this.pMaterial = new THREE.PointsMaterial({
          size: 10,
          map: this.createCircleTexture('#00ff00', 256),
          transparent: true,
          depthWrite: false
        })

        for (var p = 0; p < this.particleCount; p++) {
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

        this.camera.position.z = 500;
        this.camera.position.x = 0;
        this.camera.position.y = 0;

        this.mouse = { x: 0, y: 0, z: 0 }

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

    render() {
        return <div className="Canvas" ref={root => { this.root = root; }}></div>
    }


}
