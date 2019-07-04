
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
//import Home from '../../Components/Home'
import reducer from "../reducers/";

const logger = store => next => action => {
  console.log('dispatching', action);
  next(action);
  console.log('next state', store.getState());
};

const store = createStore(reducer, applyMiddleware(thunk, logger));

export default store;
