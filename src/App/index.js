import React, { Component } from 'react';
import './style.css';
import Canvas from '../Canvas';
import AppBar from 'material-ui/AppBar';
import Options from '../Options';


class App extends Component {
  swarmDefaults = {
    particlesNumber: 12,
    topology: 'global',
    omega: 0.5,
    phiP: 0.5,
    phiG: 0.5,
  }

  functionDefaults = {
    optimizationFunction: 'sphere',
  }

  visualizationDefaults = {
    playbackSpeed: 60,
    landscapeOpacity: 50,
    landscapeFlatness: 50,
  }

  constructor() {
    super();
    this.state = {
      ...this.swarmDefaults,
      ...this.functionDefaults,
      ...this.visualizationDefaults
    };
  }

  resetSwarm = () => {
    this.setState(this.swarmDefaults);
    this.canvas.resetSimulation();
  }

  resetFunction = () => {
    this.setState(this.functionDefaults);
    this.canvas.resetSimulation();
  }

  resetVisualization = () => {
    this.setState(this.visualizationDefaults);
  }

  setValue = (field) => (value) => this.setState({ [field]: value })

  render() {
    return (
      <div className="App">
        <AppBar className="App-header">Particle swarm optimization</AppBar>
        <div className="App-container">
          <Options
            className="App-aside"
            {...this.state}
            onParticlesNumberChange={this.setValue('particlesNumber')}
            onTopologyChange={this.setValue('topology')}
            onOmegaChange={this.setValue('omega')}
            onPhiPChange={this.setValue('phiP')}
            onPhiGChange={this.setValue('phiG')}
            onOptimizationFunctionChange={this.setValue('optimizationFunction')}
            onPlaybackSpeedChange={this.setValue('playbackSpeed')}
            onLandscapeOpacityChange={this.setValue('landscapeOpacity')}
            onLandscapeFlatnessChange={this.setValue('landscapeFlatness')}
            onResetSwarm={this.resetSwarm}
            onResetFunction={this.resetFunction}
            onResetVisualization={this.resetVisualization}
          />
          <main className="App-main">
            <Canvas
              ref={canvas => { this.canvas = canvas; }}
              {...this.state}
            />
          </main>
        </div>
      </div>
    );
  }
}

export default App;
