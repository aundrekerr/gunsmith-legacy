let manifest;

export function buildPerks(
	theManifest,
	weapon
) {
	// console.log('----- Building perks. -----');

	// Set up inital variables.
	manifest = theManifest;
	const itemDef = manifest.DestinyInventoryItemDefinition[weapon.hash];
	let perkList;
	
	perkList = collectPerks(itemDef)

	return perkList;
}

function collectPerks (
	itemDef
) {
	// The goods.
	const socketEntries = itemDef.sockets.socketEntries;

	// Maximum of 4 perk slots. Not a good idea since if 5-perk weapon could come later on.
	let perkList = [ [], [], [], [], [] ];

	// Used to jump from perk columns.
	let slotCheck = 0;

	// Map through slots to find ones that are genuine perks.
	socketEntries.map(socket => {
	
		// Check if perk is intrinsic. Weapon frames and exotic perks).
		let intrinsicHash = socket.singleInitialItemHash;
		let isIntrinsic;

		if ( intrinsicHash !== 0) {
			isIntrinsic = manifest.DestinyInventoryItemDefinition[socket.singleInitialItemHash].itemCategoryHashes.includes(2237038328);
		} else {
			isIntrinsic = false;
		}

		// some are just 0 and won't return anything
		if (socket.socketTypeHash !== 0) {

			// If this socket category is "WEAPON PERKS"
			if (manifest.DestinySocketTypeDefinition[socket.socketTypeHash].socketCategoryHash === 4241085061) {

				if (
					socket.preventInitializationOnVendorPurchase === true
					|| socket.singleInitialItemHash === 2285418970
				) {
					return null;
				}

				// If this is the WEAPON FRAME or INTRINSIC PERK
				if (isIntrinsic) {

					perkList[slotCheck].push({	
						// hash: socket.reusablePlugItems[0].plugItemHash,
						hash: manifest.DestinyPlugSetDefinition[socket.reusablePlugSetHash].reusablePlugItems[0].plugItemHash,
						isCurated: false,
						curatedOnly: false,
						isIntrinsic: isIntrinsic
					});

					// Increment to move to next perk slot.
					slotCheck++;
				} else {
					// Work on the random/set perks of the weapon.
					// SET PERKS
					if ( socket.reusablePlugSetHash ) {
						for (let i = 0; i < manifest.DestinyPlugSetDefinition[socket.reusablePlugSetHash].reusablePlugItems.length; i++) {
							const plugItemHash = manifest.DestinyPlugSetDefinition[socket.reusablePlugSetHash].reusablePlugItems[i].plugItemHash;
							let curatedOnlyCheck = true;

							// If it's undefined, it's a Kill Tracker 
							if ( typeof perkList[slotCheck] !== 'undefined' ) {

								// if it has random perks, check to see if the perk is also available without being curated.
								if (socket.hasOwnProperty('randomizedPlugSetHash')) {
									const perkSet = manifest.DestinyPlugSetDefinition[socket.randomizedPlugSetHash];
									for(var j = 0; j < perkSet.reusablePlugItems.length; j++) {
										if (perkSet.reusablePlugItems[j].plugItemHash === plugItemHash) {
											curatedOnlyCheck = false;
											break;
										}
									}

									// Only push this perk if it's exclusive to the curated roll.
									if ( curatedOnlyCheck ) {
										perkList[slotCheck].push({	
											hash: plugItemHash,
											isCurated: socket.hasOwnProperty('randomizedPlugSetHash') ? true : false,
											curatedOnly: curatedOnlyCheck,
											isIntrinsic: isIntrinsic
										});
									}

								} else {
									// Just push the perk normally if there are no random rolls tied to it.
									perkList[slotCheck].push({	
										hash: plugItemHash,
										isCurated: socket.hasOwnProperty('randomizedPlugSetHash') ? true : false,
										curatedOnly: socket.hasOwnProperty('randomizedPlugSetHash') ? curatedOnlyCheck : false,
										isIntrinsic: isIntrinsic
									});
								}

								
							}
						}
					}
					
					// RANDOM PERKS
					if (socket.hasOwnProperty('randomizedPlugSetHash')) {
						const perkSet = manifest.DestinyPlugSetDefinition[socket.randomizedPlugSetHash];

						for (let i = 0; i < perkSet.reusablePlugItems.length; i++) {
							const plugItemHash = perkSet.reusablePlugItems[i].plugItemHash;

							// If this perk is curated, but not exclusive to the curated roll.
							perkList[slotCheck].push({	
								hash: plugItemHash,
								isCurated: (socket.reusablePlugItems).some(p => p.plugItemHash === perkSet.reusablePlugItems[i].plugItemHash),
								curatedOnly: false,
								isIntrinsic: isIntrinsic
							});
							
						}
					}

					// Increment to move to next perk slot.
					slotCheck++;
				}
			}
		}

		return true;
	});

	return perkList;
}






// function oldCollectPerks(
// 	itemDef
// ) {
// 	const socketEntries = itemDef.sockets.socketEntries;
// 	let perkList = [ [], [], [], [], [] ];
// 	let slotCheck = 0;

// 	// Map through slots to find ones that are genuine perks.
// 	socketEntries.map(socket => {
// 		// Check if perk is intrinsic.
// 		let intrinsicHash = socket.singleInitialItemHash;
// 		let isIntrinsic;

// 		// Check if the socket is the instrinsic perk (weapon frame/exotic perk).
// 		if ( intrinsicHash !== 0) {
// 			isIntrinsic = manifest.DestinyInventoryItemDefinition[socket.singleInitialItemHash].itemCategoryHashes.includes(2237038328);
// 		} else {
// 			isIntrinsic = false;
// 		}

// 		// Check plug sources to filter out MWs, mods, shaders, etc.
// 		if (socket.plugSources === 1 || socket.plugSources === 2) {

// 			// Curated & Year 1 weapons. Loop through perk columns.
// 			for (let i = 0; i < socket.reusablePlugItems.length; i++) {
// 				const plugItemHash = socket.reusablePlugItems[i].plugItemHash;
// 				const plugItemsCategories = manifest.DestinyInventoryItemDefinition[plugItemHash].itemCategoryHashes;

// 				// Filter out Kill Trackers.
// 				if (plugItemsCategories.includes(59) && plugItemsCategories.length > 1) {

// 					// Check for perks that are curated/static but not exclusive. 
// 					if (!(socket.randomizedPlugItems).some(p => p.plugItemHash === socket.reusablePlugItems[i].plugItemHash)) {
// 						// If it has reusables AND randoms, it's curated.
// 						if (socket.reusablePlugItems.length > 0 && socket.randomizedPlugItems.length > 0) {
// 							perkList[slotCheck].push({	
// 								hash: socket.reusablePlugItems[i].plugItemHash,
// 								isCurated: true,
// 								curatedOnly: true,
// 								isIntrinsic: isIntrinsic
// 							});
// 						} else {
// 							perkList[slotCheck].push({
// 								hash: socket.reusablePlugItems[i].plugItemHash,
// 								isCurated: false,
// 								curatedOnly: false,
// 								isIntrinsic: isIntrinsic
// 							});
// 						}
// 					}
// 				}
// 			}

// 			// Year 2+. Loop through perk columns.
// 			for (let i = 0; i < socket.randomizedPlugItems.length; i++) {
// 				const plugItemHash = socket.randomizedPlugItems[i].plugItemHash;
// 				const plugItemsCategories = manifest.DestinyInventoryItemDefinition[plugItemHash].itemCategoryHashes;

// 				// Filter out Kill Trackers.
// 				if (plugItemsCategories.includes(59) && plugItemsCategories.length > 1) {

// 					// Same as before, reversed for random perks. 
// 					if ((socket.reusablePlugItems).some(p => p.plugItemHash === socket.randomizedPlugItems[i].plugItemHash)) {
// 						perkList[slotCheck].push({
// 							hash: socket.randomizedPlugItems[i].plugItemHash,
// 							isCurated: true,
// 							curatedOnly: false,
// 							isIntrinsic: isIntrinsic
// 						});
// 					} else {
// 						perkList[slotCheck].push({
// 							hash: socket.randomizedPlugItems[i].plugItemHash,
// 							isCurated: false,
// 							curatedOnly: false,
// 							isIntrinsic: isIntrinsic
// 						});
// 					}
// 				}
// 			}
			
// 			// Increment to move to next perk slot.
// 			slotCheck++;
// 		}

// 		// ???
// 		return true;
// 	});

// 	return perkList;
// }


// Old way of determining perks that were both curated and within random 
// rolls. Outputs an array of the perks that had duplicates.
	// let duplicatePerks = [];
	// perkList.map(column => {
	// 	let seen = new Set();
	// 	return column.some(currentPerk => {	
	// 		if (seen.size === seen.add(currentPerk.hash).size){
	// 			duplicatePerks.push(currentPerk);
	// 			return true;
	// 		}
	// 		return false;
	// 	});
	// });