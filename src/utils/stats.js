let manifest;

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

const statsNoBar = [
	4284893193, // Rounds Per Minute
	3871231066, // Magazine
	2961396640, // Charge Time
	447667954, // Draw Time
	1931675084, // Recovery
	2715839340 // Recoil Direction
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








export function buildStats (
	theManifest,
	itemHash
) {
	// console.log('----- Building stats. -----');
	manifest = theManifest;

	const itemDef = manifest.DestinyInventoryItemDefinition[itemHash];
	if (!itemDef.stats || !itemDef.stats.statGroupHash) {
		return null;
	}

	const statGroup = manifest.DestinyStatGroupDefinition[itemDef.stats.statGroupHash];
	if (!statGroup) {
		return null;
	}

	let investmentStats = buildInvestmentStats(itemDef, statGroup);
	return investmentStats.sort((a, b) => { return a.sort-b.sort })
}

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

function buildInvestmentStats (
	itemDef, 
	statGroup
) {
	const itemStats = itemDef.investmentStats;
	const statDisplays = statGroup.scaledStats;

	return itemStats.map(itemStat => {
		const statHash = itemStat.statTypeHash;
		if (!itemStat || !shouldShowStat(itemDef, statHash, statDisplays)) {
			return undefined
		}

		const def = manifest.DestinyStatDefinition[statHash];
		if (!def) {
			return undefined;
		}

		return buildStat(itemStat, statGroup, def, statDisplays);
	})
}

function buildStat (
	itemStat,
	statGroup,
	statDef,
	statDisplays
) {
	const statHash = itemStat.statTypeHash;
	let value = itemStat.value || 0;
	let maximumValue = statGroup.maximumValue;
	let bar = !statsNoBar.includes(statHash);
	let smallerIsBetter = false;
	const statDisplay = statDisplays.filter(s => statHash === s.statHash)[0];
	let intd = false;

	if ( statDisplay ) {
		const firstInterp = statDisplay.displayInterpolation[0];
		const lastInterp = statDisplay.displayInterpolation[statDisplay.displayInterpolation.length - 1];

		smallerIsBetter = firstInterp.weight > lastInterp.weight;
		maximumValue = Math.max(statDisplay.maximumValue, firstInterp.weight, lastInterp.weight);
		bar = !statDisplay.displayAsNumeric;
		value = interpolateStatValue(value, statDisplay);
		intd = true;
	}
	value = Math.max(0, value);

	return {
		investmentValue: itemStat.value || 0,
		value,
		intd,
		statHash,
		displayProperties: statDef.displayProperties,
		sort: statWhiteList.indexOf(statHash),
		maximumValue,
		bar,
		smallerIsBetter
	}
}

function interpolateStatValue (
	value,
	statDisplay
) {
	const interp = statDisplay.displayInterpolation;
	
	value = Math.max(0, Math.min(value, statDisplay.maximumValue));

	let endIndex = interp.findIndex(p => p.value > value);
	if (endIndex < 0) {
		endIndex = interp.length - 1;
	}
	const startIndex = Math.max(0, endIndex - 1);

	const start = interp[startIndex];
	const end = interp[endIndex];
	const range = end.value - start.value;
	if (range === 0) {
		return start.weight;
	}

	const t = (value - start.value) / (end.value - start.value);
	return Math.round(start.weight + t * (end.weight - start.weight));
}

export function enhanceStatsWithPlugs (
	stats,
	hash,
	perks,
	mod,
	masterwork
) {
	const itemDef = manifest.DestinyInventoryItemDefinition[hash];
	const statGroup = manifest.DestinyStatGroupDefinition[itemDef.stats.statGroupHash];
	const statDisplays = statGroup.scaledStats;
	let noMWStats;
	const modifiedStats = new Set();
	
	Object.keys(perks).map(perk => {
		const perkDef = manifest.DestinyInventoryItemDefinition[perks[perk].hash];

		if (perkDef) {
			if (perkDef.investmentStats.length > 0) {
				for ( const perkStat of perkDef.investmentStats) {
					const statHash = perkStat.statTypeHash;
					const itemStat = stats.filter(s => { if (s) { return statHash === s.statHash } else { return false } })[0];
					// const itemStatIndex = stats.map(s => { 
					// 	if (s) return s.statHash; 
					// }).indexOf(statHash);
					const value = perkStat.value || 0;

					if (itemStat) {
						itemStat.investmentValue += value;				
					} 
					// else if (shouldShowStat(itemDef, statHash, statDisplays)) { // need to complete this 
					// 	const stat = perkDef.investmentStats.find(
					// 			(s) => s.statTypeHash === statHash
					// 		);

					// 	if (stat && stat.value) {
					// 		const statDef = manifest.DestinyStatGroupDefinition[statHash];
					// 		const builtStat = buildStat(stat, statGroup, statDef, statDisplays);
					// 	}
					// }

					modifiedStats.add(statHash);
				}
			}
		}

		return true;
	});

	if ( mod.hash !== 0 ) {
		if (mod.investmentStats.length > 0) {
			for ( const perkStat of mod.investmentStats) {
				const statHash = perkStat.statTypeHash;
				const itemStat = stats.filter(s => { if (s) { return statHash === s.statHash } else { return false } })[0];
				const value = perkStat.value || 0;
				if (itemStat) { itemStat.investmentValue += value; }
				modifiedStats.add(statHash);
			}
		}
	}

	noMWStats = JSON.parse(JSON.stringify(stats));

	for (const stat of noMWStats) {
		if (stat) {
			if ( modifiedStats.has(stat.statHash) ) {
				const statDisplay = statDisplays.filter(s => stat.statHash === s.statHash )[0];
				stat.value = statDisplay
					? interpolateStatValue(stat.investmentValue, statDisplay)
					: Math.min(stat.investmentValue, stat.maximumValue);
			}
		}
	}
	
	if ( masterwork.hash !== 0 ) {
		if (masterwork.investmentStats.length > 0) {
			for ( const perkStat of masterwork.investmentStats) {
				const statHash = perkStat.statTypeHash;
				const itemStat = stats.filter(s => { if (s) { return statHash === s.statHash } else { return false } })[0];
				const value = perkStat.value || 0;
				if (itemStat) { itemStat.investmentValue += value; } 
				modifiedStats.add(statHash);
			}
		}
	}

	for (const stat of stats) {
		if (stat) {
			if ( modifiedStats.has(stat.statHash) ) {
				const statDisplay = statDisplays.filter(s => stat.statHash === s.statHash )[0];
				stat.value = statDisplay
					? interpolateStatValue(stat.investmentValue, statDisplay)
					: Math.min(stat.investmentValue, stat.maximumValue);
			}
		}
	}

	for(let i = 0; i <= stats.length; i++) {
		const stat = stats[i];
		const mw = noMWStats[i];

		if (stat && mw) {
			if (stat.value !== mw.value) {
				stats[i].mwDiff = Math.abs(mw.value - stat.value);
			}
		}
	}

	return stats;
}







export function buildSingleStat (
	stats,
	perk,
	weaponHash,
	mod,
	masterwork
) {
	const itemDef = manifest.DestinyInventoryItemDefinition[weaponHash];
	const statGroup = manifest.DestinyStatGroupDefinition[itemDef.stats.statGroupHash];
	const statDisplays = statGroup.scaledStats;
	let noPerkStats;
	let finalPerkVal = perk.value;
	const modifiedStats = new Set();

	if ( mod.hash !== 0 ) {
		if (mod.investmentStats.length > 0) {
			for ( const perkStat of mod.investmentStats) {
				const statHash = perkStat.statTypeHash;
				const itemStat = stats.filter(s => { if (s) { return statHash === s.statHash } else { return false } })[0];
				const value = perkStat.value || 0;
				if (itemStat) { itemStat.investmentValue += value; }
				modifiedStats.add(statHash);
			}
		}
	}

	if ( masterwork.hash !== 0 ) {
		if (masterwork.investmentStats.length > 0) {
			for ( const perkStat of masterwork.investmentStats) {
				const statHash = perkStat.statTypeHash;
				const itemStat = stats.filter(s => { if (s) { return statHash === s.statHash } else { return false } })[0];
				const value = perkStat.value || 0;
				if (itemStat) { itemStat.investmentValue += value; }	
				modifiedStats.add(statHash);
			}
		}
	}

	noPerkStats = JSON.parse(JSON.stringify(stats));

	for (const stat of noPerkStats) {
		if (stat) {
			if ( modifiedStats.has(stat.statHash) ) {
				const statDisplay = statDisplays.filter(s => stat.statHash === s.statHash )[0];
				stat.value = statDisplay
					? interpolateStatValue(stat.investmentValue, statDisplay)
					: Math.min(stat.investmentValue, stat.maximumValue);
			}
		}
	}

	
	const perkStatHash = perk.statTypeHash;
	const itemStat = stats.filter(s => { if (s) { return perkStatHash === s.statHash } else { return false } })[0];
	const settingVal = perk.value || 0;
	if (itemStat) { itemStat.investmentValue += settingVal; }	
	modifiedStats.add(perkStatHash);

	for (const stat of stats) {
		if (stat) {
			if ( modifiedStats.has(stat.statHash) ) {
				const statDisplay = statDisplays.filter(s => stat.statHash === s.statHash )[0];
				stat.value = statDisplay
					? interpolateStatValue(stat.investmentValue, statDisplay)
					: Math.min(stat.investmentValue, stat.maximumValue);
			}
		}
	}

	for(let i = 0; i <= stats.length; i++) {
		const stat = stats[i];
		const p = noPerkStats[i];

		if (stat && p) {
			if (stat.value !== p.value) {
				finalPerkVal = stat.value - p.value;
			}
		}
	}

	return finalPerkVal;
}