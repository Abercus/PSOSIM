import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Dialog, {
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

import './style.css';

import Canvas from '../Canvas';
import Graphs from '../Graphs'
import Options from '../Options';
import { getOptimizationParams, getOptimizationFunction } from '../pso/functions';


class App extends Component {
  simulationDefaults = {
    particlesNumber: 15,
    topology: 'global',
    omega: 0.768,
    phiP: 0.5,
    phiG: 0.5,
    speed: 5,
    optimizationFunction: 'eggholder',
  }

  visualizationDefaults = {
    playbackSpeed: 60,
    landscapeOpacity: 50,
    landscapeFlatness: 95,
  }

  constructor() {
    super();
    this.index = 0;
    this.state = {
      currentBest: null,
      fitnesses: [{values: [], index: 0}],
      currentFitness: 0,
      openCredits: false,
      openParametersDescription: false,
      needsRestart: false,
      ...this.simulationDefaults,
      ...this.visualizationDefaults
    };
  }

  startSimulation = () => {
    this.canvas.resetSimulation();
    this.index += 1;
    this.setState({
      fitnesses: this.state.fitnesses.concat([{values: [], index: this.index }]),
      currentFitness: this.state.fitnesses.length,
      currentBest: null,
      speed: getOptimizationParams(this.state.optimizationFunction).speed,
      needsRestart: false,
    });
  }

  resetSimulation = () => {
    this.setState({ ...this.simulationDefaults, needsRestart: true });
  }

  resetVisualization = () => {
    this.setState(this.visualizationDefaults);
  }

  setValue = (field) => (value) => this.setState({ [field]: value })
  setRestartValue = (field) => (value) => this.setState({ [field]: value, needsRestart: true })

  handleOpenCredits = () => this.setState({ openCredits: true })
  handleCloseCredits = () => this.setState({ openCredits: false })

  handleOpenParametersDescription = () => this.setState({ openParametersDescription: true })
  handleCloseParametersDescription = () => this.setState({ openParametersDescription: false })

  appendHistory = (value) => {
    const { fitnesses, currentFitness } = this.state;
    fitnesses[currentFitness].values = fitnesses[currentFitness].values.concat([value]);
    this.setState({
      fitnesses: fitnesses.slice(),
      currentBest: value.value,
    });
  }

  clearHistory = () => {
    const { fitnesses, currentFitness } = this.state;
    this.setState({
      fitnesses: [fitnesses[currentFitness]],
      currentFitness: 0,
    });
  }

  render() {
    return (
      <div className="App">
        <AppBar className="App-header">
          <Toolbar>
            <img className="logo" src="images/logo.svg" />
            <Typography type="title" color="inherit" className="App-title">
              Particle swarm optimization
            </Typography>
            <Button color="contrast" onClick={this.handleOpenCredits}>Credits</Button>
          </Toolbar>
        </AppBar>
        <div className="App-container">
          <Options
            className="App-aside"
            {...this.state}
            onParticlesNumberChange={this.setRestartValue('particlesNumber')}
            onTopologyChange={this.setRestartValue('topology')}
            onOmegaChange={this.setValue('omega')}
            onPhiPChange={this.setValue('phiP')}
            onPhiGChange={this.setValue('phiG')}
            onSpeedChange={this.setValue('speed')}
            onOptimizationFunctionChange={this.setRestartValue('optimizationFunction')}

            onPlaybackSpeedChange={this.setValue('playbackSpeed')}
            onLandscapeOpacityChange={this.setValue('landscapeOpacity')}
            onLandscapeFlatnessChange={this.setValue('landscapeFlatness')}

            onResetSimulation={this.resetSimulation}
            onResetVisualization={this.resetVisualization}

            onSimulate={this.startSimulation}
            needsRestart={this.state.needsRestart}

            onOpenParametersDescription={this.handleOpenParametersDescription}
          />
          <main className="App-main">
            <Canvas
              ref={canvas => { this.canvas = canvas; }}
              {...this.state}
              optimizationFunction={getOptimizationFunction(this.state.optimizationFunction)}
              optimizationParams={{ ...getOptimizationParams(this.state.optimizationFunction), speed: this.state.speed }}
              onImprovement={this.appendHistory}
            />
          </main>
          <Graphs histories={this.state.fitnesses} onClear={this.clearHistory} currentBest={this.state.currentBest} />
        </div>
        <Dialog
          open={this.state.openCredits}
          onClose={this.handleCloseCredits}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Credits</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <div className="credits-imgs">
                <img src="images/ut_logo.png"></img>
                <img src="images/study_it.jpg"></img>
              </div>
              <div className="credits-icons">
                Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>, licensed by&nbsp;
                <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.openParametersDescription}
          onClose={this.handleCloseParametersDescription}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Parameters description</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Parameter</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Number of particles</TableCell>
                    <TableCell>Size of the swarm</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Topology</TableCell>
                    <TableCell>The topology of the swarm defines the subset of particles with which each particle can exchange information.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>ω</TableCell>
                    <TableCell>Previous velocity coefficient</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>φ<sub>p</sub></TableCell>
                    <TableCell>Particle best coefficient</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>φ<sub>g</sub></TableCell>
                    <TableCell>Global (or group's) best coefficient</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>max v.</TableCell>
                    <TableCell>Maximum velocity of a particle, after which the value is cut.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Optimization function</TableCell>
                    <TableCell>One of the possible fitness landscapes for optimal value search</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default App;
