import { STORE_COMPARISON_WEAPON_ONE, STORE_COMPARISON_WEAPON_TWO } from '../actions/types';

const initialState = {
	weaponOne: {},
	weaponTwo: {},
}

export default function(state = initialState, action) {
	switch(action.type) {
		case STORE_COMPARISON_WEAPON_ONE:
			return {
				...state,
				weaponOne: action.payload,
			};

		case STORE_COMPARISON_WEAPON_TWO:
			return {
				...state,
				weaponTwo: action.payload,
			};

		default: 
			return state;
	}
}