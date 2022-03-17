import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';


const museumsReducer = (state = [], action)=> {
  if(action.type === 'LOAD'){
    return action.museums;
  }
  if(action.type === 'CREATE'){
    return [...state, action.museum ];
  }
  if(action.type === 'UPDATE'){
    return state.map(museum => museum.id === action.museum.id ? action.museum : museum );
  }
  return state;
};

const viewReducer = (state = '', action)=> {
  if(action.type === 'SET_VIEW'){
    return action.view;
  }
  return state;
};

const initialState = {
  museums: [],
  view: ''
};

const changeToBooked = (museum)=> {
  return async(dispatch)=> {
    const updated = (await axios.put(`/api/museums/${museum.id}`, { booked: !museum.booked })).data;
    dispatch({ type: 'UPDATE', museum: updated});
  };
};

const createMuseum = ()=> {
  return async(dispatch)=> {
    const museum = (await axios.post('/api/museums/random')).data;
    dispatch({ type: 'CREATE', museum });
  };
};

const fetchMuseums = ()=> {
  return async(dispatch)=> {
    const museums = (await axios.get('/api/museums')).data;
    dispatch({
      type: 'LOAD',
      museums
    })
  };
};


const store = createStore(
  combineReducers({
    museums: museumsReducer,
    view: viewReducer
  }),
  applyMiddleware(thunk)
);

export { changeToBooked, fetchMuseums, createMuseum };

export default store;