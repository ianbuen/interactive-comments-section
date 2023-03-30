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
    let cache = localStorage.getItem('cache');
    cache = JSON.parse(cache);

    dispatch({
      type: "SET_DATA",
      data: cache ? cache : data
    });
  }, []);


  useEffect(() => {
    // also make a cache to localstorage, when Context updates
    const [{ currentUser, comments }] = state;

    if (currentUser && comments) {
        const data = { currentUser, comments };
        localStorage.setItem('cache', JSON.stringify(data));
    }
  }, [state]);

  return (
    <div className='App'>
      <main>
        <Comments />
        <Compose ref={refCompose} />
      </main>
    </div>
  )
};

export default App;