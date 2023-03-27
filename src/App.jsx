import React, { useEffect } from 'react';
import "./styles/App.sass";
import data from "./data.json";
import Comments from './components/Comments';
import { useStateValue } from './StateProvider';
import { Compose } from './components/Compose';
import { Modal } from './components/Modal';

export const App = () => {

  const [{}, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "SET_DATA",
      data: data
    })
  }, [data]);

  return (
    <div className='App'>
      <Comments />
      <Compose />
    </div>
  )
};

export default App;