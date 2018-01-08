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
    dimensions: '2d',
    optimasNumber: 1,
    optimizationFunction: 'sphere'
  }

  constructor() {
    super();
    this.state = {
      ...this.swarmDefaults,
      ...this.functionDefaults,
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
            onDimensionsChange={this.setValue('dimensions')}
            onOptimasNumberChange={this.setValue('optimasNumber')}
            onOptimizationFunctionChange={this.setValue('optimizationFunction')}
            onResetSwarm={this.resetSwarm}
            onResetFunction={this.resetFunction}
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
