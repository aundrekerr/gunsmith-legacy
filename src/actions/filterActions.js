// import store from './../utils/store.js';
import { STORE_RARITY, STORE_WEAPON_TYPE, STORE_DAMAGE, } from './types';

// const state = store.getState();

export const storeRarity = (rarityHash) => dispatch => {
	dispatch({
		type: STORE_RARITY,
		payload: rarityHash
	})
};

export const storeWeaponType = (typeHash) => dispatch => {
	dispatch({
		type: STORE_WEAPON_TYPE,
		payload: typeHash
	})
};

export const storeDamage = (damageHash) => dispatch => {
	dispatch({
		type: STORE_DAMAGE,
		payload: damageHash
	})
};
