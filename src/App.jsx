import React, { useEffect } from 'react';
import "./styles/App.sass";
import data from "./data.json";
import Comments from './components/Comments';
import { useStateValue } from './StateProvider';

export const App = () => {

  const [{ currentUser, comments }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: "SET_DATA",
      data: data
    })
  }, [data]);

  return (
    <div className='App'>
      <Comments />
    </div>
  )
};

export default App;