import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';

import './style.css';

import Canvas from '../Canvas';
import Graphs from '../Graphs'
import Options from '../Options';
import CreditsDialog from '../CreditsDialog';
import ParametersDialog from '../ParametersDialog';
import AlgorithmDialog from '../AlgorithmDialog';
import GitHub from '../GitHub';
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
      openAlgorithm: false,
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
      speed: this.functionChanged ? getOptimizationParams(this.state.optimizationFunction).speed : this.state.speed,
      needsRestart: false,
    });
    this.functionChanged = false;
  }

  resetSimulation = () => {
    this.setState({ ...this.simulationDefaults, needsRestart: true });
  }

  resetVisualization = () => {
    this.setState(this.visualizationDefaults);
  }

  setValue = (field) => (value) => this.setState({ [field]: value })
  setRestartValue = (field) => (value) => this.setState({ [field]: value, needsRestart: value !== this.state[field] })

  setOptimizationFunction = (optimizationFunction) => {
    this.functionChanged = optimizationFunction !== this.state.optimizationFunction;
    this.setState({ optimizationFunction, needsRestart: this.functionChanged });
  }

  handleOpenCredits = () => this.setState({ openCredits: true })
  handleCloseCredits = () => this.setState({ openCredits: false })

  handleOpenParametersDescription = () => this.setState({ openParametersDescription: true })
  handleCloseParametersDescription = () => this.setState({ openParametersDescription: false })

  handleOpenAlgorithm = () => this.setState({ openAlgorithm: true })
  handleCloseAlgorithm = () => this.setState({ openAlgorithm: false })

  appendHistory = ({ epoch, value }) => {
    const { fitnesses, currentFitness } = this.state;
    fitnesses[currentFitness].values = fitnesses[currentFitness].values.concat([{ epoch, value: value.z }]);
    this.setState({
      fitnesses: fitnesses.slice(),
      currentBest: value,
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
            <img className="logo" src="images/logo.svg" alt="logo" />
            <Typography type="title" color="inherit" className="App-title">
              Particle swarm optimization
            </Typography>
            <Button color="contrast" onClick={this.handleOpenAlgorithm}>Algorithm</Button>
            <Button color="contrast" onClick={this.handleOpenCredits}>Credits</Button>
            <IconButton href="https://github.com/Abercus/PSOSIM" aria-labelledby="demo-github" color="contrast">
              <GitHub />
            </IconButton>
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
            onOptimizationFunctionChange={this.setOptimizationFunction}

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
        <CreditsDialog open={this.state.openCredits} onClose={this.handleCloseCredits} />
        <ParametersDialog
          open={this.state.openParametersDescription}
          onClose={this.handleCloseParametersDescription}
          onOpenAlgorithm={() => {
            this.handleCloseParametersDescription();
            this.handleOpenAlgorithm();
          }}
        />
        <AlgorithmDialog open={this.state.openAlgorithm} onClose={this.handleCloseAlgorithm} />
      </div>
    );
  }
}

export default App;
