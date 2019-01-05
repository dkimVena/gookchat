import { combineReducers } from 'redux';
import { penderReducer } from 'redux-pender';
import state from './state';
import data from './data';

export default combineReducers({
  state,
  data,
  pender: penderReducer
});
