import * as THREE from 'three';

import {
  euclidDistance,
  addition,
  addition_w,
  addition_2,
  addition_2_w,
  subtract,
  subtract_2,
  subtract_2_w,
  mod,
} from '../pso/math';

// Class for whole population
export default class Population {
  constructor(pop, optimizeByFunction, topology, speed, xMin, xMax, yMin, yMax) {
    this.population = pop;
    this.gBest = null;
    this.gBestNumerical = null;
    this.speed = speed;
    this.demo = !optimizeByFunction;
    this.reflection = this.demo ? 1:0.5;
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
    this.optimization_goal = vector;
    var func = function (x,y) {
      return euclidDistance({x:x, y:y}, vector);
    }
    // Reset best numerical

    this.set_optimization_function(func);

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


  updateParticle(particle, speed) {
    // CHECK VELOCITIES.. MAX LIMITS -LIMIT and LIMIT. Can be made int o a slider.
    var LIMIT = speed;
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

    // If bounded search area.
    var newLocation = addition(particle, particle.velocity);
    if (newLocation.x > this.xMax) {
      if (particle.velocity.x > 0) {
        particle.velocity.x *= -this.reflection;
      }
      newLocation.x = this.xMax;
    } else if (newLocation.x < this.xMin) {
        if (particle.velocity.x < 0) {
          particle.velocity.x *= -this.reflection;
        }
      newLocation.x = this.xMin;
    }
    if (newLocation.y > this.yMax) {
      if (particle.velocity.y > 0) {
        particle.velocity.y *= -this.reflection;
      }
        newLocation.y = this.yMax;
    } else if (newLocation.y < this.yMin) {
      if (particle.velocity.y < 0) {
        particle.velocity.y *= -this.reflection;
      }
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
    for (let particle of this.population) {
      var rand1 = Math.random();
      var rand2 = Math.random();
      particle.velocity = addition_2_w(
        omega,
        particle.velocity,
        addition_2(
          subtract_2(particle.pBest, particle, phiP, rand1),
          subtract_2(this.gBest, particle, phiG, rand2)
        ));

    }
    for (let particle of this.population) {
        this.updateParticle(particle, speed);
    }
    this.epoch++;
  }

  updateRing(omega, phiP, phiG, speed) {
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

      particle.velocity = addition_2_w(omega, particle.velocity, addition_2(subtract_2(particle.pBest, particle, phiP, rand1),subtract_2(pB, particle, phiG, rand2)));

    }

    for (let particle of this.population) {
        this.updateParticle(particle, speed);
    }
    this.epoch++;
  }

    updateRandomAdaptive(omega, phiP, phiG, speed) {

        // Network does not exist yet.
        var k = 3;
        if (this.previousGBestNumerical && this.previousGBestNumerical <= this.gBestNumerical) {
            this.adaptionNetwork = undefined;
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
          for (i=0; i<this.population.length; i++) {
            for (var j=0; j<k; j++) {
              this.adaptionNetwork[Math.floor(Math.random()*this.population.length)].push(i);
            }
          }
        }

        // update particles
        for (i=0; i<this.population.length; i++) {
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

          particle.velocity = addition_2_w(omega, particle.velocity, addition_2(subtract_2(particle.pBest, particle, phiP, rand1),subtract_2(pb, particle, phiG, rand2)));


        }

        for (let particle of this.population) {
            this.updateParticle(particle, speed);
        }
        this.epoch++;
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
