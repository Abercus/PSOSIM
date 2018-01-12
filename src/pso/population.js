import * as THREE from 'three';

import {
  euclidDistance,
  addition,
  addition_w,
  subtract,
  mod,
} from '../pso/math';

// Class for whole population
export default class Population {
  constructor(pop, demo, topology, xMin, xMax, yMin, yMax) {
    this.population = pop;
    this.gBest = null;
    this.gBestNumerical = null;
    this.demo = demo;
    this.reflection = this.demo ? 1 : 0.5; // If demo then reflection factor is 1
    this.xMin = xMin;
    this.xMax = xMax;
    this.yMin = yMin;
    this.yMax = yMax;
    this.epoch = 0;
    if (topology === "global") {
      this.updateFn = this.updateGlobal;
    } else if (topology === "random") {
      this.updateFn = this.updateRandomAdaptive;
    } else if (topology === "ring") {
      this.updateFn = this.updateRing;
    } else {
      this.updateFn = this.updateGlobal;
    }
  }


  set_optimization_goal(vector) {
    // Used for demo function. We set vector/location to be the location we optimize for
    // Build the function based on the vector
    var func = function(x, y) {
      return euclidDistance({
        x: x,
        y: y
      }, vector);
    }
    // Make population optimize according to the function
    this.set_optimization_function(func);

  }

  set_optimization_function(func) {
    // Set a function to optimize for
    this.optimization_function = func;
    this.findPopulationBest();
  }


  updateParticle(particle, speed) {
    var LIMIT = speed;

    // Limit of the particle speed. If higher then clip it to maximum.
    // Minimum of upper limit and particle's velocity.
    particle.velocity.x = Math.min(LIMIT, particle.velocity.x);
    particle.velocity.y = Math.min(LIMIT, particle.velocity.y);
    // Maximum of lower limit and particle's velocity.
    particle.velocity.x = Math.max(-LIMIT, particle.velocity.x);
    particle.velocity.y = Math.max(-LIMIT, particle.velocity.y);

    let newLocation = addition(particle, particle.velocity);
    // Check if particle would go out of boundaries
    if (newLocation.x > this.xMax) {
      particle.velocity.x *= -this.reflection;
      newLocation.x = this.xMax;
    } else if (newLocation.x < this.xMin) {
      particle.velocity.x *= -this.reflection;
      newLocation.x = this.xMin;
    }
    if (newLocation.y > this.yMax) {
      particle.velocity.y *= -this.reflection;
      newLocation.y = this.yMax;
    } else if (newLocation.y < this.yMin) {
      particle.velocity.y *= -this.reflection;
      newLocation.y = this.yMin;
    }

    particle.x = newLocation.x;
    particle.y = newLocation.y;

    particle.currentNumerical = this.optimization_function(particle.x, particle.y);

    if (this.demo) {
      particle.z = 0;
    } else {
      particle.z = particle.currentNumerical;

    }

    if (particle.currentNumerical < particle.bestNumerical) {
      particle.pBest = new THREE.Vector3(particle.x, particle.y, particle.z);
      particle.bestNumerical = particle.currentNumerical;
      if (particle.bestNumerical < this.gBestNumerical) {
        this.gBestNumerical = particle.bestNumerical;
        this.gBest = particle.pBest;
      }
    }
  }


  updateGlobal(omega, phiP, phiG, speed) {
    // Neighbourhood is global.
    for (let particle of this.population) {
      let rand1 = Math.random();
      let rand2 = Math.random();
      particle.velocity = addition_w(
        omega,
        particle.velocity,
        addition(
          subtract(particle.pBest, particle, phiP, rand1),
          subtract(this.gBest, particle, phiG, rand2)
        ));

    }
  }

  updateRing(omega, phiP, phiG, speed) {
    // Ring topology.
    for (let i = 0; i < this.population.length; i++) {
      let rand1 = Math.random();
      let rand2 = Math.random();
      let particle = this.population[i];
      let left_neighbour = this.population[mod(i - 1, this.population.length)];
      let right_neighbour = this.population[mod(i + 1, this.population.length)];

      // Find best of the neighbourhood
      let neighbourhoodBest = particle.pBest;
      let neighbourhoodBestNum = particle.bestNumerical;

      // Check if left has found better best value  (ind -1)
      if (left_neighbour.bestNumerical < neighbourhoodBestNum) {
        neighbourhoodBest = left_neighbour.pBest;
        neighbourhoodBestNum = left_neighbour.bestNumerical;
      }
      // Check right neighbour
      if (right_neighbour.bestNumerical < neighbourhoodBestNum) {
        neighbourhoodBest = left_neighbour.pBest;
        neighbourhoodBestNum = left_neighbour.bestNumerical;
      }
      // New velocity is based on neighbouhood best and particles own best
      particle.velocity = addition_w(omega, particle.velocity,
        addition(
          subtract(particle.pBest, particle, phiP, rand1),
          subtract(neighbourhoodBest, particle, phiG, rand2)
        )
      );

    }
  }


  runIteration(omega, phiP, phiG, speed) {
    // Update velocities according to the function
    this.updateFn(omega, phiP, phiG, speed);
    // Update locations of the particles
    for (let particle of this.population) {
      this.updateParticle(particle, speed);
    }
    // Increase epoch count
    this.epoch++;
  }

  updateRandomAdaptive(omega, phiP, phiG, speed) {
    // Random Adaptive
    const k = 3; // How many neighbours are informed?
    // If global best did not improve, force rebuild of the network
    if (this.previousGBestNumerical && this.previousGBestNumerical <= this.gBestNumerical) {
      this.informationNetwork = undefined;
    }
    // Set previous best from current best.
    this.previousGBestNumerical = this.gBestNumerical;

    // Build the information network
    if (!this.informationNetwork) {
      // k = 3
      this.informationNetwork = new Array(this.population.length);
      for (let i = 0; i < this.population.length; i++) {
        this.informationNetwork[i] = [i]; // Particle informs themselves
      }
      // Particle informs k other random particles
      for (let i = 0; i < this.population.length; i++) {
        for (let j = 0; j < k; j++) {
          this.informationNetwork[Math.floor(Math.random() * this.population.length)].push(i);
        }
      }
    }
    // Update particles
    for (let i = 0; i < this.population.length; i++) {
      let particle = this.population[i];
      let rand1 = Math.random();
      let rand2 = Math.random();

      // Check through particles in its network
      let neighbourhoodBest = particle.pBest;
      let neighbourhoodBestNum = particle.bestNumerical;
      for (let ind of this.informationNetwork[i]) {
        if (this.population[ind].bestNumerical < neighbourhoodBestNum) {
          neighbourhoodBestNum = this.population[ind].bestNumerical;
          neighbourhoodBest = this.population[ind].pBest;
        }
      }
      // Change velocity of the particle
      particle.velocity = addition_w(omega, particle.velocity,
        addition(
          subtract(particle.pBest, particle, phiP, rand1),
          subtract(neighbourhoodBest, particle, phiG, rand2)));
    }
  }

  findPopulationBest() {
    // First reset best and numerical best variables.
    // This initializes the population.
    this.gBest = null;
    this.gBestNumerical = null;
    for (let i = 0; i < this.population.length; i++) {
      // For each particle find its value according to the
      this.population[i].bestNumerical = this.optimization_function(
        this.population[i].x,
        this.population[i].y);

      this.population[i].pBest = new THREE.Vector3(
        this.population[i].x,
        this.population[i].y,
        this.population[i].bestNumerical);

    }

    let bestNumerical = this.population[0].bestNumerical;
    let best = this.population[0].pBest;
    for (let i = 1; i < this.population.length; i++) {
      // Currently minimizing... Use another fitness function instead,
      if (this.population[i].bestNumerical < bestNumerical) {
        bestNumerical = this.population[i].bestNumerical;
        best = this.population[i].pBest;
      }
    }
    // Set best numerical of the population.
    if (this.gBestNumerical) {
      // If better than current best founds
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
