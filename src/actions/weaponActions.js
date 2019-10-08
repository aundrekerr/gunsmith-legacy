// import store from './../utils/store.js';
import { STORE_WEAPON, STORE_PERKS, STORE_MOD, STORE_MW } from './types';
	
// const state = store.getState();

export const storeWeapon = (hash) => dispatch => {
	dispatch({
		type: STORE_WEAPON,
		payload: hash
	})
};



let perkSet = {
	slotOne: { hash: 0 },
	slotTwo: { hash: 0 },
	slotThree: { hash: 0 },
	slotFour: { hash: 0 },
};
export const storePerks = (perk, slot) => dispatch => {
	// start at 1 because of the intrinsic perk.
	if (slot === 1) {
		if (perkSet.slotOne.hash !== perk.hash) {
			perkSet.slotOne = perk;
		} else {
			perkSet.slotOne = { hash: 0 };
		}
	}

	if (slot === 2) {
		if (perkSet.slotTwo.hash !== perk.hash) {
			perkSet.slotTwo = perk;
		} else {
			perkSet.slotTwo = { hash: 0 };
		}
	}

	if (slot === 3) {
		if (perkSet.slotThree.hash !== perk.hash) {
			perkSet.slotThree = perk;
		} else {
			perkSet.slotThree = { hash: 0 };
		}
	}

	if (slot === 4) {
		if (perkSet.slotFour.hash !== perk.hash) {
			perkSet.slotFour = perk;
		} else {
			perkSet.slotFour = { hash: 0 };
		}
	}


	dispatch({
		type: STORE_PERKS,
		payload: perkSet
	})
};



let modSlot = { hash: 0 };
export const storeMod = (mod) => dispatch => {
	modSlot.hash === mod.hash
		? modSlot = { hash: 0 }
		: modSlot = mod

	dispatch({
		type: STORE_MOD,
		payload: modSlot
	})
}


let mwSlot = { hash: 0 };
export const storeMasterwork = (mw) => dispatch => {
	mwSlot.hash === mw.hash
		? mwSlot = { hash: 0 }
		: mwSlot = mw

	dispatch({
		type: STORE_MW,
		payload: mwSlot
	})
}