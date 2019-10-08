export const statWhiteList = [
	3614673599, // Blast Radius
	2523465841, // Velocity

	4043523819, // Impact
	1240592695, // Range
	1591432999, // Accuracy
	155624089, // Stability
	943549884, // Handling
	4188031367, // Reload Speed

	2837207746, // Swing Speed (sword)
	2762071195, // Efficiency (sword)
	209426660, // Defense (sword)
	
	1345609583, // Aim Assistance
	3555269338, // Zoom
	2715839340, // Recoil Direction

	4284893193, // Rounds Per Minute
	2961396640, // Charge Time
	447667954, // Draw Time

	3871231066, // Magazine
	1931675084, // Inventory Size
	925767036, // Ammo Capacity
];

export const statsMs = [
	447667954, // Draw Time
	2961396640 // Charge Time
];

const hiddenStatsWhitelist = [
	1345609583, // Aim Assistance
	3555269338, // Zoom
	2715839340 // Recoil Direction
];


export function getMasterworks(
	theManifest,
	weaponHash
) {
	let manifest = theManifest;
	const itemDef = manifest.DestinyInventoryItemDefinition[weaponHash];
	const socketEntries = itemDef.sockets.socketEntries;
	const y2MasterworkItems = manifest.DestinyPlugSetDefinition[1117738936].reusablePlugItems;
	const statGroup = manifest.DestinyStatGroupDefinition[itemDef.stats.statGroupHash];
	const statDisplays = statGroup.scaledStats;
	if ( itemDef.sockets.socketCategories.filter(c => c.socketCategoryHash === 2685412949).length === 0) {
		return null;
	}
	const socketIndexes = itemDef.sockets.socketCategories.filter(c => c.socketCategoryHash === 2685412949)[0].socketIndexes;
	let isY1 = false;
	const isLegendary = itemDef.inventory.tierType === 5 ? true : false;
	const isExotic = itemDef.inventory.tierType === 6 ? true : false;

	let mwCollection = {
		stability: { benefits: [], hash: 155624089, active: false, },
		range: { benefits: [], hash: 1240592695, active: false, },
		handling: { benefits: [], hash: 943549884, active: false, },
		damage: { benefits: [],  hash: 4043523819, active: false, }, // Impact
		reload: { benefits: [], hash: 4188031367, active: false, },
		blast_radius: { benefits: [], hash: 3614673599, active: false, },
		projectile_speed: { benefits: [],  hash: 2523465841, active: false, }, // Velocity
		charge_time: { benefits: [], hash: 2961396640, active: false, },
		draw_time: { benefits: [], hash: 447667954, active: false, },
		accuracy: { benefits: [], hash: 1591432999, active: false, },
	};
	let catalystDefs = [];
	

	if ( isLegendary ) {
		// const socketIndexes = itemDef.sockets.socketCategories.filter(c => c.socketCategoryHash === 2685412949)[0].socketIndexes;
	
		socketIndexes.map(socket => {
			if (
				socketEntries[socket].plugSources !== 3 &&
				socket.preventInitializationOnVendorPurchase !== true 
			) {
				const modDef = manifest.DestinyInventoryItemDefinition[socketEntries[socket].singleInitialItemHash];
				const modIdentifiers = modDef.plug.plugCategoryIdentifier.split('.');
		
				if (modIdentifiers.includes('v300', 'weapon')) {
					isY1 = true;
				}
			}

			return true;
		});

		if (isY1){
			
		} else {
			// Map through the MW benefits.
			y2MasterworkItems.map(mw => {
				const mwDef = manifest.DestinyInventoryItemDefinition[mw.plugItemHash];
				const mwStatSplit = mwDef.plug.plugCategoryIdentifier.split('.');
				const mwStatName = mwStatSplit[mwStatSplit.length - 1];
				
				mwCollection[mwStatName].benefits.push(mwDef);
				return true;
			});

			for (const [statType, data] of Object.entries(mwCollection)) {
				if (shouldShowStat(itemDef, data.hash, statDisplays)) {

					// Don't include Impact if it's not a fusion rifle.
					if ( itemDef.itemSubType !== 11 && statType === 'damage'  ) {
						mwCollection[statType].active = false;
						continue;
					}
					
					mwCollection[statType].active = true;
				} else {
					mwCollection[statType].active = false;
				}
			}
		}
	}

	if ( isExotic && socketIndexes.length > 0) {
		socketIndexes.map(socket => {
			socketEntries[socket].reusablePlugItems.map(p => {
				const plugDef = manifest.DestinyInventoryItemDefinition[p.plugItemHash];
				catalystDefs.push(plugDef);

				return true;
			})

			return true;
		})
	}

	return {
		isY1,
		mwCollection,
		catalystDefs,
	};
}



// function oldGetMasterworks(
// 	theManifest,
// 	weaponHash
// ) {
// 	// console.log('----- Building masterworks. -----');
// 	let manifest = theManifest;
// 	const itemDef = manifest.DestinyInventoryItemDefinition[weaponHash];
// 	const sockets = itemDef.sockets;
// 	const socketEntries = itemDef.sockets.socketEntries;

// 	// Place this here so it resets.
// 	let mwCollection = {
// 		stability: { 
// 			benefits: [], hash: 155624089, active: false,
// 		},
// 		range: { 
// 			benefits: [], hash: 1240592695, active: false,
// 		},
// 		handling: { 
// 			benefits: [], hash: 943549884, active: false,
// 		},
// 		damage: { // Impact
// 			benefits: [],  hash: 4043523819, active: false,
// 		},
// 		reload: { 
// 			benefits: [], hash: 4188031367, active: false,
// 		},
// 		blast_radius: { 
// 			benefits: [], hash: 3614673599, active: false,
// 		},
// 		projectile_speed: { // Velocity
// 			benefits: [],  hash: 2523465841, active: false,
// 		},
// 		charge_time: { 
// 			benefits: [], hash: 2961396640, active: false,
// 		},
// 		draw_time: { 
// 			benefits: [], hash: 447667954, active: false,
// 		},
// 		accuracy: { 
// 			benefits: [], hash: 1591432999, active: false,
// 		},
// 	};

// 	if (!itemDef.sockets || !itemDef.sockets.socketEntries) {
// 		return null;
// 	}

// 	if (!socketEntries) {
// 		return null;
// 	}

// 	const statGroup = manifest.DestinyStatGroupDefinition[itemDef.stats.statGroupHash];
// 	const statDisplays = statGroup.scaledStats;
// 	if (!statGroup) {
// 		return null;
// 	}

	

// 	if ( !socketEntries.every(noRandomPerks) ) {
// 		// Map through slots to find ones that are genuine perks.
// 		socketEntries.map(socket => {

// 			// console.log(manifest.DestinyInventoryItemDefinition[socket.plugItemHash].itemCategoryHashes)
// 			// console.log(socket)
// 			// console.log(socket.socketCategories.filter(c => c.socketCategoryHash === 2685412949))

// 			if (socket.plugSources === 3 // not perks
// 				&& socket.preventInitializationOnVendorPurchase === true // something only MWs had???
// 				&& socket.socketTypeHash !== 1288200359 // not default shader
// 			) {
// 				// Map through MW levels
// 				socket.reusablePlugItems.map(mw => {
// 					const mwDef = manifest.DestinyInventoryItemDefinition[mw.plugItemHash];
// 					const mwStatSplit = mwDef.plug.plugCategoryIdentifier.split('.');
// 					const mwStatName = mwStatSplit[mwStatSplit.length - 1];
					
// 					mwCollection[mwStatName].benefits.push(mwDef);
// 					return true;
// 				})
// 			}

// 			return true;
// 		})
// 	}

// 	// Filter out Masterworks that don't apply to this weapon.
// 	for (const [statType, data] of Object.entries(mwCollection)) {
// 		if (shouldShowStat(itemDef, data.hash, statDisplays)) {

// 			// Don't include Impact if it's not a fusion rifle.
// 			if ( itemDef.itemSubType !== 11 && statType === 'damage'  ) {
// 				mwCollection[statType].active = false;
// 				continue;
// 			}
			
// 			mwCollection[statType].active = true;
// 		} else {
// 			mwCollection[statType].active = false;
// 		}
// 	}

// 	return mwCollection;
// }

// function noRandomPerks (
// 	socket
// ) {
// 	return socket.hasOwnProperty('randomizedPlugSetHash')
// }

function shouldShowStat (
	itemDef, 
	statHash, 
	statDisplays
) {
	if (
		statHash === 2961396640 &&
		itemDef.itemCategoryHashes &&
		itemDef.itemCategoryHashes.includes(3317538576)
	) {
		return false;
	}

	return (
		// Must be on the whitelist
		statWhiteList.includes(statHash) &&
		// Must be on the list of interpolated stats, or included in the hardcoded hidden stats list
		(statDisplays.filter(s => statHash === s.statHash)[0] || hiddenStatsWhitelist.includes(statHash))
	);
}