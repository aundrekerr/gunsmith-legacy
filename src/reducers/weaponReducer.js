import { STORE_WEAPON, STORE_PERKS, STORE_MOD, STORE_MW } from '../actions/types';

const initialState = {
	hash: null,
	mod: { hash: 0 },
	masterwork: { hash: 0 },
}

export default function(state = initialState, action) {
	const data = action.payload;

	switch(action.type) {
		case STORE_WEAPON:
			return {
				...state,
				hash: data,
			};

		case STORE_PERKS:
			return {
				...state,
				perks: data,
			};

		case STORE_MOD:
			return {
				...state,
				mod: data,
			};

		case STORE_MW:
			return {
				...state,
				masterwork: data,
			};

		default: 
		return state;
	}
}