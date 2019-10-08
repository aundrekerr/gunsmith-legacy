import { FETCH_MANIFEST } from './types';
import * as bungie from './../utils/bungie';

export const fetchManifest = () => dispatch => {
	bungie.manifestIndex().then(res => {
		bungie.manifest(res.jsonWorldContentPaths['en'])
			.then((res) => {
				dispatch({
					type: FETCH_MANIFEST,
					payload: res
				})
			})
 	})
	.catch(err => { throw err })
};