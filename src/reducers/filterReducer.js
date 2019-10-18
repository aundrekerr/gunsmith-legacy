import { STORE_COLLECTION, STORE_RARITY, STORE_WEAPON_TYPE, STORE_DAMAGE, } from '../actions/types';

const initialState = {
	collection: null,
	rarity: 4008398120,
	weaponType: null,
	damage: null
}

export default function(state = initialState, action) {
	const data = action.payload;

	switch(action.type) {
		case STORE_COLLECTION:
			return {
				...state,
				collection: data,
			};

		case STORE_RARITY:
			return {
				...state,
				rarity: data,
			};

		case STORE_WEAPON_TYPE:
			return {
				...state,
				weaponType: data,
			};

		case STORE_DAMAGE:
			return {
				...state,
				damage: data,
			};

		default: 
		return state;
	}
}