import React, { Component } from 'react';
import './style.css';
import Canvas from '../Canvas';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Particle swarm optimization</h1>
        </header>
        <div className="App-container">
          <main className="App-main">
            <Canvas />
          </main>
          <aside className="App-aside">
            Some toggles here...
          </aside>
        </div>
      </div>
    );
  }
}

export default App;
