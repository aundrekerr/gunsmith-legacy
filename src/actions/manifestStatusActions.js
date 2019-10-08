import { STORE_MANIFEST_STATUS } from './types';

export const storeManifestStatus = () => dispatch => {
	dispatch({
		type: STORE_MANIFEST_STATUS,
		payload: true
	})
};
