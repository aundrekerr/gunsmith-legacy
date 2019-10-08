import { STORE_TOOLTIP_COORDS } from './types';

export const storeTooltipCoords = (coords) => dispatch => {
	dispatch({
		type: STORE_TOOLTIP_COORDS,
		payload: coords
	})
};
