import React, { Component } from 'react';
import { connect } from 'react-redux';
import Tooltip from './../Tooltip.js';
// import { buildStats, enhanceStatsWithPlugs } from './../../utils/stats.js';

class Current extends Component {
	
	swapTitle = (title) => {
		switch(title) {
			case 'stability': return 'Stability';
			case 'range': return 'Range';
			case 'handling': return 'Handling';
			case 'damage': return 'Impact';
			case 'reload': return 'Reload Speed';
			case 'blast_radius': return 'Blast Radius';
			case 'projectile_speed': return 'Velocity';
			case 'charge_time': return 'Charge Time';
			case 'draw_time': return 'Draw Time';
			case 'accuracy': return 'Accuracy';

			default: return title;
		}
	}

	buildMWName = (string) => {
		const mwStatSplit = string.split('.');
		const mwStatName = mwStatSplit[mwStatSplit.length - 1];
		return this.swapTitle(mwStatName);
	}
	render(){
		const {
			props: {
				manifest,
				weapon: {
					// hash,
					perks,
					mod,
					masterwork
				}
			}
		} = this;
		
		return (
			<div className="weapon__tab weapon__current">
				<span className="uppercase tracked-wide underline">Current</span>
				<div className="current__benefits-wrapper">
					<div className="weapon__current-perks">
						<ul className="perk-list">
						{
							Object.keys(perks).map(perk => {
								if ( perks[perk].hash !== 0) {
									const perkDef = manifest.DestinyInventoryItemDefinition[perks[perk].hash];
									return (
										<li key={perk}
										className={
											`${ perks[perk].isCurated ? 'curated' : '' } 
											${ perks[perk].curatedOnly ? 'curated-only ' : '' } 
											${ perks[perk].isIntrinsic ? 'frame ' : '' }
											node`
										}>
											<div className='perk-icon' data-for={`getContent-current-${perkDef.hash}`} data-tip>
												<img 
													src={ `https://bungie.net${perkDef.displayProperties.icon}` } 
													alt={`Destiny 2 Perk - ${perkDef.displayProperties.name}`} />
											</div>
											<Tooltip 
												hash={ `current-${perkDef.hash}` }
												title={ perkDef.displayProperties.name }
												subtitle={ perkDef.itemTypeDisplayName }
												description={ perkDef.displayProperties.description }
												stats={ perkDef.investmentStats.length > 0 ? perkDef.investmentStats : null }
											/>
										</li>
									)
								} else {
									return (
										<li key={perk}
											className="node">
											<div className='perk-icon'></div>
										</li>
									)
								}
								
							})
						}
						</ul>
					</div>
					<br/>
					<div className="weapon__current-masterwork">
						{
							masterwork.hash !== 0 
								? <React.Fragment>
										<div className="mw-icon" data-for={`getContent-current-${masterwork.hash}`} data-tip><img src={`https://bungie.net${masterwork.displayProperties.icon}`} alt="" /></div>
										<Tooltip 
											hash={ `current-${masterwork.hash}` }
											title={ masterwork.displayProperties.name }
											subtitle={ masterwork.itemTypeDisplayName }
											description={ masterwork.displayProperties.description }
											stats={ masterwork.investmentStats.length > 0 ? masterwork.investmentStats : null }
										/>
									</React.Fragment>
								: <React.Fragment>
										<div className="mw-icon"><img src={`https://bungie.net${manifest.DestinyInventoryItemDefinition[1176735155].displayProperties.icon}`} alt="" /></div>
									</React.Fragment>
						}
					</div>
					<div className="weapon__current-mod">
						{
							mod.hash !== 0 
								? <React.Fragment>
										<div className="mod-icon" data-for={`getContent-current-${mod.hash}`} data-tip><img src={`https://bungie.net${mod.displayProperties.icon}`} alt="" /></div>
										<Tooltip 
											hash={ `current-${mod.hash}` }
											title={ mod.displayProperties.name }
											subtitle={ mod.itemTypeDisplayName }
											description={ mod.displayProperties.description }
											stats={ mod.investmentStats.length > 0 ? mod.investmentStats : null }
										/>
									</React.Fragment>
								: <React.Fragment>
										<div className="mod-icon"><img src={`https://bungie.net${manifest.DestinyInventoryItemDefinition[1176735155].displayProperties.icon}`} alt="" /></div>
									</React.Fragment>
						}
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	manifest: state.manifest,
	weapon: state.weapon,
});

export default connect(mapStateToProps, {

})(Current);