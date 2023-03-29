import React, { createContext, useContext, useReducer } from 'react';

// Prepares the data layer
export const StateContext = createContext();

// State
export const initialState = {
    currentUser: null,
    comments: [],
};

// Wrap the app and provide the data layer
export const StateProvider = ({children }) => (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </StateContext.Provider>
);

// Reducer
const reducer = (state, action) => { 
     
    switch(action.type) {
        case "SET_DATA": 
            return { ...state, currentUser: action.data.currentUser, comments: action.data.comments, };

        case "SET_COMMENTS":
            return { ...state, comments: action.comments };
            
        default:
            return state;
    }
};

// Pull information from data layer
export const useStateValue = () => useContext(StateContext);

