import React from 'react';
import "./styles/App.sass";
import data from "./data.json";
import Comments from './components/Comments';

export const App = () => {
  return (
    <div className='App'>
      <Comments data={data} />
    </div>
  )
};

export default App;