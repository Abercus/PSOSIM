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
    landscapeFlatness: 70,
  }

  constructor() {
    super();
    this.index = 0;
    this.state = {
      currentBest: null,
      fitnesses: [{values: [], index: 0}],
      currentFitness: 0,
      openCredits: false,
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
    });
  }

  resetSimulation = () => {
    this.setState(this.simulationDefaults);
  }

  resetVisualization = () => {
    this.setState(this.visualizationDefaults);
  }

  setValue = (field) => (value) => this.setState({ [field]: value })

  handleOpenCredits = () => this.setState({ openCredits: true })
  handleCloseCredits = () => this.setState({ openCredits: false })

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
            onParticlesNumberChange={this.setValue('particlesNumber')}
            onTopologyChange={this.setValue('topology')}
            onOmegaChange={this.setValue('omega')}
            onPhiPChange={this.setValue('phiP')}
            onPhiGChange={this.setValue('phiG')}
            onSpeedChange={this.setValue('speed')}
            onOptimizationFunctionChange={this.setValue('optimizationFunction')}

            onPlaybackSpeedChange={this.setValue('playbackSpeed')}
            onLandscapeOpacityChange={this.setValue('landscapeOpacity')}
            onLandscapeFlatnessChange={this.setValue('landscapeFlatness')}

            onResetSimulation={this.resetSimulation}
            onResetVisualization={this.resetVisualization}

            onSimulate={this.startSimulation}
          />
          <main className="App-main">
            <Canvas
              ref={canvas => { this.canvas = canvas; }}
              {...this.state}
              optimizationFunction={getOptimizationFunction(this.state.optimizationFunction)}
              optimizationParams={getOptimizationParams(this.state.optimizationFunction)}
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
              Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a>&nbsp;
              from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by&nbsp;
              <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default App;
