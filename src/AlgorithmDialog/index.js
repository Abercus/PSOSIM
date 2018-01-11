import React from "react";
import Dialog, {
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "material-ui/Dialog";

import './style.css';

const AlgorithmDialog = ({ open, onClose }) => (
  <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">Algorithm</DialogTitle>
    <DialogContent>
      <DialogContentText className="algorithm-content">
        <p>
          Particle swarm optimization (PSO) is a population based optimization
          technique developed by Dr. Eberhart and Dr. Kennedy in 1995, inspired
          by social behaviour of bird flocking or fish schooling. Suppose the
          following scenario: a group of birds are randomly searching food in an
          area. There is only one piece of food in the area being searched.
          Birds do not know where the food is, but they know how far the food is
          in each iteration. So, what's the best strategy to find the food? The
          effective one is to follow the bird which is nearest to the food.{" "}
        </p>
        <img src="images/map.jpg" alt="Map" />
        <p>
          PSO works in an iterative process. First generation of particles is
          initialised with random positions and velocities. Algorithm approaches
          optima by updating generations. Variables used in the simulation are:
          <ul>
            <li>
              <i> k </i> - iteration number
            </li>
            <li>
              <i> i </i> - particle number
            </li>
            <li>
              <i>
                {" "}
                <b>p</b>
                <sub>k</sub>
                <sup>i</sup>{" "}
              </i>{" "}
              - best solution (fitness) the particle has achieved so far
            </li>
            <li>
              <i>
                {" "}
                <b>p</b>
                <sub>k</sub>
                <sup>g</sup>{" "}
              </i>{" "}
              - best value obtained so far by any particle in the neighbourhood
            </li>
            <li>
              <i>
                {" "}
                <b>x</b>
                <sub>k</sub>
                <sup>i</sup>{" "}
              </i>{" "}
              - position of the particle
            </li>
            <li>
              <i>
                {" "}
                <b>v</b>
                <sub>k</sub>
                <sup>i</sup>{" "}
              </i>{" "}
              - velocity of the particle
            </li>
            <li>
              <i> &omega; </i> - inertia
            </li>
            <li>
              <i> r </i> - random number between (0,1)
            </li>
            <li>
              <i>
                {" "}
                &phi;<sub>p</sub>, &phi;<sub>g</sub>{" "}
              </i>{" "}
              - influence factor of personal/global best
            </li>
          </ul>
          <p>
            Selecting factors{" "}
            <i>
              {" "}
              &phi;<sub>p</sub>, &phi;<sub>g</sub>{" "}
            </i>{" "}
            that yield a good performance has been a subject of much research,
            because the choice can have a large impact on optimization
            performance. Usually{" "}
            <i>
              {" "}
              &phi;<sub>p</sub>{" "}
            </i>{" "}
            equals to{" "}
            <i>
              {" "}
              &phi;<sub>g</sub>{" "}
            </i>{" "}
            and ranges from <i>[0, 4]</i>. However, other settings are also
            used.{" "}
          </p>
          <p>
            If{" "}
            <i>
              {" "}
              &phi;<sub>p</sub>> &phi;<sub>g</sub>{" "}
            </i>, particles will move more towards their own best-found
            location. Similarly, if{" "}
            <i>
              {" "}
              &phi;<sub>p</sub>&phi;<sub>g</sub>{" "}
            </i>, particles will move more towards the global best-found
            location. Inertia weight <i> &omega; </i> determines the
            contribution rate of a particle's previous velocity to its current
            velocity.
          </p>
          <p>The formula for updating velocity is:</p>
          <p>
            {" "}
            <i>
              {" "}
              <b>v</b>
              <sub>k+1</sub>
              <sup>i</sup> = &omega;<b>v</b>
              <sub>k</sub>
              <sup>i</sup> + &phi;<sub>p</sub> r<sub>1</sub> (<b>p</b>
              <sub>k</sub>
              <sup>i</sup>-<b>x</b>
              <sub>k</sub>
              <sup>i</sup> )+ &phi;<sub>g</sub> r<sub>2</sub> (<b>p</b>
              <sub>k</sub>
              <sup>g</sup>-<b>x</b>
              <sub>k</sub>
              <sup>i</sup> ){" "}
            </i>
          </p>
          <p>and the formula for updating the position is:</p>
          <i>
            {" "}
            <b>x</b>
            <sub>k+1</sub>
            <sup>i</sup>=<b>x</b>
            <sub>k</sub>
            <sup>i</sup>+<b>v</b>
            <sub>k+1</sub>
            <sup>i</sup>{" "}
          </i>
        </p>
        <p>
          We assume that for each dimension d the particle must stay inside{" "}
          <i>
            [min<sub>d</sub> , max<sub>d</sub>]
          </i>. If this criterion is not met, the velocity is modified:
        </p>
        If{" "}
        <i>
          {" "}
          <b>x</b>
          <sub>k</sub>
          <sub>d</sub>
          <sup>i</sup> &lt; min<sub>d</sub>{" "}
        </i>{" "}
        , then{" "}
        <i>
          {" "}
          <b>x</b>
          <sub>k</sub>
          <sub>d</sub>
          <sup>i</sup> = min<sub>d</sub>{" "}
        </i>{" "}
        and{" "}
        <i>
          <b>v</b>
          <sub>k</sub>
          <sub>d</sub>
          <sup>i</sup>=-0.5 <b>v</b>
          <sub>k</sub>
          <sub>d</sub>
          <sup>i</sup>{" "}
        </i>
        <p>
          and analogically if{" "}
          <i>
            {" "}
            <b>x</b>
            <sub>k</sub>
            <sub>d</sub>
            <sup>i</sup> > max<sub>d</sub>{" "}
          </i>{" "}
          . By{" "}
          <i>
            {" "}
            <b>x</b>
            <sub>k</sub>
            <sub>d</sub>
            <sup>i</sup>{" "}
          </i>{" "}
          we mean the value of particle's location on <i>d</i>-th dimension.
        </p>
        <img src="images/vectors.jpg" alt="Vectors" />
        <p>
          Three vectors applied to a particle in one iteration of a Particle
          Swarm Optimization are:{" "}
        </p>
        <ul>
          <li>
            a cognitive influence urges the particle toward its previous best{" "}
            <i>
              {" "}
              <b>p</b>
              <sub>k</sub>
              <sup>i</sup>{" "}
            </i>,{" "}
          </li>
          <li>
            a social influence urges the particle toward the swarm's previous
            best{" "}
            <i>
              {" "}
              <b>p</b>
              <sub>k</sub>
              <sup>g</sup>{" "}
            </i>,{" "}
          </li>
          <li>
            its own velocity{" "}
            <i>
              {" "}
              <b>v</b>
              <sub>k</sub>
              <sup>i</sup>{" "}
            </i>{" "}
            provides inertia, allowing it to overshoot local minima and explore
            unknown regions of the problem domain.{" "}
          </li>
        </ul>
        ?
        <p>
          The flowchart of the full PSO algorithm with global topology is as
          follows:
        </p>
        <img className="flowchart" src="images/flow.jpg" alt="Flowchart" />
        <p>
          The simulator also gives you a chance to try out different topologies.
        </p>
        <ul>
          <li>
            In <b>global topology</b> all particles share their local best, therefore each particle has information on currently found global best
            {" "}
            <i>
              {" "}
              <b>p</b>
              <sub>k</sub>
              <sup>g</sup>{" "}
            </i>
          </li>
          <li>
            <b>Adaptive random topology</b> has each particle inform <i>K</i> random particles and itself.
            The neighbourhood will be built in the beginning and after epoch where there was no improvement on best-known fitness value.
          </li>
          <li>
            In <b>ring topology</b> each particle informs 2 other particles and itself.
            The neighbourhood of the particle <i>i</i> is: <i>i-1 mod(S), i, i+1 mod(S)</i>, where{" "}
            <i>S</i> is the total number of particles.
            The neighbourhood is set in the beginning and does not change during the simulation.
          </li>
        </ul>
        <img src="images/topologies.jpg" alt="Topologies" className="topologies"/>
        <div>Graphical representations of above-described topologies in order from left-to-right: global, ring and random topologies.</div>

        <p>
          In the simulation collisions with boundary are handled by having particle "bounce" of it.
          Particle will change its direction and lose half of its directional speed.
          Ex. if particle collided with y-boundary then its speed in y-axis direction will be reversed and halved.
          In demo case the particle will bounce off without loss of speed.
        </p>

        <p>
          {" "}
          <b>References:</b>
          <br />Xiaouhui Hu "PSO Tutorial", 2006.
          http://www.swarmintelligence.org/tutorials.php
          <br />Maurice Clerc "Standard Particle Swarm Optimisation", 2012.
          http://clerc.maurice.free.fr/pso/SPSO_descriptions.pdf
          <br />Test functions for optimization:
          https://en.wikipedia.org/wiki/Test_functions_for_optimization
          <br />https://se.mathworks.com/matlabcentral/fileexchange/43541-particle-swarm-optimization--pso-
          <br />https://dev.heuristiclab.com/trac.fcgi/wiki/Documentation/Reference/Particle%20Swarm%20Optimization
          <br />http://www.jade-cheng.com/au/coalhmm/optimization/
          <br />https://www.hindawi.com/journals/acisc/2012/897127/
        </p>
      </DialogContentText>
    </DialogContent>
  </Dialog>
);

export default AlgorithmDialog;
