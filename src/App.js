import React from 'react';
import Almanac from './Almanac'
import Question2 from './question2'

function App() {
  return (
    <div className="App">
      <Almanac/>
      <div>
        <button onClick={()=>Question2([7,9,8,9,2,4,7])}>testQusetion2</button>        
      </div>
    </div>
  );
}

export default App;
