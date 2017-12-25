


function addition(v1,v2) {
  // adds v1 and v2
  var newS = [];
  for (var i=0; i<v1.length; i++) {
    newS.push(v1[i] + v2[i]);
  }
  return newS;
}

function subtract(v1,v2,c,rand1) {
  // subtracts v2 from v1
  var newS = [];
  for (var i=0; i<v1.length; i++) {
      newS.push(c*rand1*(v1[i] - v2[i]));
  }
  return newS;

}

// Class for whole population
class Population {
  constructor(pop) {
    this.population = pop;
    this.gBest = null;
    this.gBestNumerical = null;
  }

  update() {
    // Learning factors (c1 and c2). These can be sliders later (or input box)
    var c1 = 2, c2 = 2;
    // TODO: put particle logic into particle's method.
    for (var i=0; i<this.population.length; i++) {
      var particle = this.population[i];
      var rand1 = Math.random();
      var rand2 = Math.random();
      particle.velocity = addition(particle.velocity, addition(
        subtract(particle.pBest, particle.current,c1,rand1),
        subtract(this.gBest, particle.current,c2,rand2)));

      // Check max/min velocity.... TODO: Put this in update function..
      // Also all subtracting and adding should be in one function.
      // ARe there vector operations in js?
      for (var j=0; j<particle.velocity.length; j++) {
        if (particle.velocity[j] < -10) {
          particle.velocity[j] = -10;
        }
        if (particle.velocity[j] > 10) {
          particle.velocity[j] = 10;
        }

      }
      particle.current = addition(particle.current, particle.velocity);

      particle.currentNumerical = testOptimizationFunction(particle);
      if (particle.currentNumerical < particle.bestNumerical) {
        particle.pBest = particle.current;
        particle.bestNumerical = particle.currentNumerical;
        if (particle.bestNumerical < this.gBestNumerical) {
          this.gBestNumerical = particle.bestNumerical;
          this.gBest = particle.pBest;
        }
      }
    }
  }


  findPopulationBest() {
    // TODO: This can be done more efficiently (do compares on updating each particle pBest)
    // If at that point pBest < gBest then gBest = pBest
    var bestNumerical = this.population[0].bestNumerical;
    var best = this.population[0].pBest;
    for (var i=1; i<this.population.length; i++) {
      // Currently minimizing... Might add a checker to maximize, dependent on task.
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
class Particle {
  constructor(px,py,pz) {
    // TODO: Just build another constructor for array..
    this.current = [px,py,pz];
    this.pBest = [px,py,pz];
    this.velocity = [0,0,0];
  }

  toString() {
    return "[X: " + String(this.current[0]) + ", Y: "
      + String(this.current[1]) + ", Z:"
      + String(this.current[2]) + ", pBest: "
      + String(this.bestNumerical) +  "]";
  }

  toStringBest() {
    return "[X: " + String(this.pBest[0]) + ", Y: "
      + String(this.pBest[1]) + ", Z:"
      + String(this.pBest[2])
      + ", pBest: " + String(this.bestNumerical) +  "]";

  }


  update() {
    // Maybe a particle should have a update method instead of population?
    // Or both is the right .
  }

}

function generateRandomPoint() {
  var pX = Math.random() * 500 - 250,
      pY = Math.random() * 500 - 250,
      pZ = Math.random() * 500 - 250;

  var particle = new Particle(pX, pY, pZ);
  return particle;

}


function generateNParticles(n) {
  var pList = [];
  for (var i=0; i<n; i++) {
    pList.push(generateRandomPoint());
  }

  return pList;
}

function euclidDistance(p1, p2) {
  var dist = 0;
  for (var i=0; i<p1.current.length; i++) {
    dist += Math.pow(p1.current[i] - p2.current[i], 2);
  }

  return Math.sqrt(dist);
}

function euclidDistance2(p1, p2) {
  var dist = 0;
  for (var i=0; i<p1.length; i++) {
    dist += Math.pow(p1[i] - p2[i], 2);
  }

  return Math.sqrt(dist);
}



function testOptimizationFunction(p) {
  // Distance from 0.
  var pZero = new Particle(0, 0, 0);
  return euclidDistance(p, pZero);
}

function mainSimulation() {
  var div = document.getElementById('playground');
  // Generate particles
  var particleList = generateNParticles(20);

  // Find personal best for each
  for (var i=0; i<particleList.length; i++) {
    particleList[i].bestNumerical = testOptimizationFunction(particleList[i]);
  }

  var pop = new Population(particleList);
  pop.findPopulationBest();


  div.innerHTML += "<p>Population best: " + String(pop.gBestNumerical) + "</p>";
  for (var i=0; i<pop.population.length; i++) {
    div.innerHTML += "<p>" + pop.population[i].toString() + "</p>";
  }

  var ITCOUNT = 1000;
  for (var i=1; i<=ITCOUNT; i++) {
      pop.update();
//      div.innerHTML += "<p> Iteration #: " + String(i)   + ", Current best: "
//        + String(pop.gBestNumerical) + "</p>"
      if (i%100 == 0) {
        console.log(i);
      }
  }


  div.innerHTML += "<p>---FINAL POPULATION AFTER " + String(ITCOUNT) + "------</p>";
  div.innerHTML += "<p>Population best: " + String(pop.gBestNumerical) + "</p>";
  div.innerHTML += "<p> Current Locations </p>";
  for (var i=0; i<pop.population.length; i++) {
    div.innerHTML += "<p>" + pop.population[i].toString() + "</p>";
  }
  div.innerHTML += "<p> Best Locations </p>";

  for (var x=0; x<pop.population.length; x++) {
    div.innerHTML += "<p>" + pop.population[x].toStringBest()
      + " Debug: " + String(euclidDistance2(pop.population[x].pBest, [0,0,0])) + "</p>";
  }



//  div.innerHTML += particle.toString();
}


window.addEventListener('load', function() {
  mainSimulation();

})
