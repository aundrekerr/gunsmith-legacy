import { STORE_MANIFEST_STATUS } from '../actions/types';

const initialState = {
	manifestLoaded: false,
}

export default function(state = initialState, action) {
	switch(action.type) {
		case STORE_MANIFEST_STATUS:
			return {
				...state,
				manifestLoaded: action.payload,
			};

		default: 
			return state;
	}
}