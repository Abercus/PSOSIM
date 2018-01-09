import React, { Component } from 'react';
import './style.css';
import Canvas from '../Canvas';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Options from '../Options';
import Button from 'material-ui/Button';
import Dialog, {
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';


class App extends Component {
  swarmDefaults = {
    particlesNumber: 40,
    topology: 'global',
    omega: 0.768,
    phiP: 0.5,
    phiG: 0.5,
  }

  functionDefaults = {
    optimizationFunction: 'sphere',
  }

  visualizationDefaults = {
    playbackSpeed: 60,
    landscapeOpacity: 50,
    landscapeFlatness: 70,
  }

  constructor() {
    super();
    this.state = {
      openCredits: false,
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

  handleOpenCredits = () => this.setState({ openCredits: true })
  handleCloseCredits = () => this.setState({ openCredits: false })

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
