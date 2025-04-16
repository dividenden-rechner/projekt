import React from 'react';
import DividendenChart from './DividendenChart';
import './App.css';

function App() {
  return (
    <div className="App" style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Dividendenrechner
      </h1>
      <DividendenChart />
    </div>
  );
}

export default App;
