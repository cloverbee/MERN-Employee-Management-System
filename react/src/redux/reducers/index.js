import { combineReducers } from "redux";
import list from "./list";
import userDetail from "./userDetail";
import getSearchResult from "./getSearchResult";
import saveUser from './saveUser';
import deleteUser from './deleteUser';
import getManager from './getManager';
import DR from './DR';
import datePicker from './datePicker';


const reducers = combineReducers({
  list,
  userDetail,
  getSearchResult,
  saveUser,
  deleteUser,
  getManager,
  DR,
  datePicker,
});

export default reducers;
