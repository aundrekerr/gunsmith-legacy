import { combineReducers } from 'redux';
import manifestReducer from './manifestReducer';
import manifestStatusReducer from './manifestStatusReducer';
import compareReducer from './compareReducer';
import weaponReducer from './weaponReducer';
import filterReducer from './filterReducer';

export default combineReducers({
	manifest: manifestReducer,
	manifestLoaded: manifestStatusReducer,
	compare: compareReducer,
	weapon: weaponReducer,
	filters: filterReducer,
})