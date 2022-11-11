import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h3>Welcome to Health Maps</h3>
        <input id="pac-input" className="controls" type="text" placeholder="Search Box"></input>
        <div id = "map"></div>
        
      </header>
    </div>
  );
}

export default App;
