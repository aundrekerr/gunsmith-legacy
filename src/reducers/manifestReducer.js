import { FETCH_MANIFEST } from '../actions/types';

const initialState = {
	manifest: {},
}

export default function(state = initialState, action) {
	switch(action.type) {
		case FETCH_MANIFEST:
			return action.payload;
		
		default: 
			return state;
	}
}