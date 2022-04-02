import { combineReducers } from "redux";
import authReducer from "./auth";
import profileReducer from "./profile";
import locationReducer from "./loction";
import notificationReducer from "./notification";
import officerReducer from "./officer";

export default combineReducers({
  authReducer,
  profileReducer,
  locationReducer,
  notificationReducer,
  officerReducer,
});
