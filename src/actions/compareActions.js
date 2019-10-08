import { STORE_COMPARISON_WEAPON_ONE, STORE_COMPARISON_WEAPON_TWO } from './types';

export const storeComparisonWeaponOne = (weaponObject) => dispatch => {
	dispatch({
		type: STORE_COMPARISON_WEAPON_ONE,
		payload: weaponObject
	})
};

export const storeComparisonWeaponOne = (weaponObject) => dispatch => {
	dispatch({
		type: STORE_COMPARISON_WEAPON_TWO,
		payload: weaponObject
	})
};
