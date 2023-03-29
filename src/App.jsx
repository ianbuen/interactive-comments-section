import React, { createRef, useEffect } from 'react';
import "./styles/App.sass";
import data from "./data.json";
import Comments from './components/Comments';
import { useStateValue } from './StateProvider';
import { Compose } from './components/Compose';

export const App = () => {

  const state = useStateValue();
  const [{}, dispatch] = state;
  const refCompose = createRef();

  useEffect(() => {
    dispatch({
      type: "SET_DATA",
      data: data
    });
  }, []);

  return (
    <div className='App'>
      <Comments />
      <Compose />
    </div>
  )
};

export default App;