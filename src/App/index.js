import React, { Component } from 'react';
import './style.css';
import Canvas from '../Canvas';
import AppBar from 'material-ui/AppBar';
import Options from '../Options';


class App extends Component {
  render() {
    return (
      <div className="App">
        <AppBar className="App-header">Particle swarm optimization</AppBar>
        <div className="App-container">
          <Options className="App-aside">
            Some toggles here...
          </Options>
          <main className="App-main">
            <Canvas />
          </main>
        </div>
      </div>
    );
  }
}

export default App;
