import React, { Component } from 'react';
import { connect } from 'react-redux';
import Stats from './Stats';
import Tooltip from './../Tooltip.js';
import {
	Globals
} from './../../utils/globals';

const CameraIcon = () => (
	<svg 
		xmlns="http://www.w3.org/2000/svg" 
		version="1.1" 
		viewBox="0 0 40 40" 
		width="40" 
		height="40">
			<g transform="matrix(1.6666666666666667,0,0,1.6666666666666667,0,0)">
				<path 
					d="M15.335,10.493c-0.099-0.472-0.561-0.775-1.033-0.676c-0.325,0.068-0.584,0.315-0.667,0.637l-1.592,3.5 c-0.057,0.126-0.205,0.181-0.331,0.124c-0.034-0.016-0.065-0.039-0.089-0.068l-1.1-1.314c-0.381-0.517-1.109-0.627-1.626-0.246 c-0.142,0.105-0.259,0.241-0.341,0.398l-2.485,4.145c-0.142,0.237-0.065,0.544,0.172,0.686C6.321,17.725,6.409,17.75,6.5,17.75h11 c0.276,0,0.5-0.224,0.5-0.5c0-0.064-0.012-0.127-0.036-0.186L15.335,10.493z M8,5.75c1.105,0,2,0.895,2,2s-0.895,2-2,2 s-2-0.895-2-2S6.895,5.75,8,5.75z M4,2.75H2c-1.105,0-2,0.895-2,2v2c0,0.552,0.448,1,1,1s1-0.448,1-1v-1.5 c0-0.276,0.224-0.5,0.5-0.5H4c0.552,0,1-0.448,1-1S4.552,2.75,4,2.75z M5,20.25c0-0.552-0.448-1-1-1H2.5 c-0.276,0-0.5-0.224-0.5-0.5v-1.5c0-0.552-0.448-1-1-1s-1,0.448-1,1v2c0,1.105,0.895,2,2,2h2C4.552,21.25,5,20.802,5,20.25z M22,2.75h-2c-0.552,0-1,0.448-1,1s0.448,1,1,1h1.5c0.276,0,0.5,0.224,0.5,0.5v1.5c0,0.552,0.448,1,1,1s1-0.448,1-1v-2 C24,3.645,23.105,2.75,22,2.75z M23,16.25c-0.552,0-1,0.448-1,1v1.5c0,0.276-0.224,0.5-0.5,0.5H20c-0.552,0-1,0.448-1,1 s0.448,1,1,1h2c1.105,0,2-0.895,2-2v-2C24,16.698,23.552,16.25,23,16.25z" 
					stroke="none" fill="#ffffff" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round"/>
			</g>
	</svg>
)

export class ScreenshotElement extends React.Component {
	
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

	getDamageType = (dmgType) => {
		switch(true) {
			case (dmgType === 1): return 'kinetic';
			case (dmgType === 2): return 'arc';
			case (dmgType === 3): return 'solar';
			case (dmgType === 4): return 'void';

			default:
				return 'kinetic';
		}
	}

	

	render(){
		const { manifest, weapon } = this.props;
		const { perks, masterwork, mod } = weapon;
		let mwStatName = '';
		const currentWeapon = manifest.DestinyInventoryItemDefinition[weapon.hash];

		if ( weapon.masterwork.hash !== 0 ) {
			const mwDef = manifest.DestinyInventoryItemDefinition[masterwork.hash];
			const mwStatSplit = mwDef.plug.plugCategoryIdentifier.split('.');
			mwStatName = mwStatSplit[mwStatSplit.length - 1];
		}

		return (
			<div 
				className={`inner-container ${this.getDamageType(manifest.DestinyInventoryItemDefinition[weapon.hash].defaultDamageType)}`}
				style={{backgroundImage: `url(https://www.bungie.net${ currentWeapon.screenshot })`}}>
				<div className="weapon__display">
					<div className="icon" style={{ backgroundImage: `url(https://www.bungie.net${ currentWeapon.displayProperties.icon })`}}></div>
					<div className="title">
						<span className="bold uppercase name">{ currentWeapon.displayProperties.name }</span>
						<span className="uppercase type">{ currentWeapon.itemTypeDisplayName }</span>
					</div>
				</div>
				<div className="stat-half">
					<Stats />
				</div>
				
				<div className="weapon__current-perks">
				{/* <span className="uppercase tracked-wide underline">Perks</span> */}
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
											<div className='perk-icon'>
												<img 
													src={ `https://www.bungie.net${perkDef.displayProperties.icon}` } 
													alt={`Destiny 2 Perk - ${perkDef.displayProperties.name}`} />
											</div>
											<span>{perkDef.displayProperties.name}</span>
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
						{
							masterwork.hash !== 0 
								? <li>
										<div className="masterwork-icon">
											<img src={`https://www.bungie.net${masterwork.displayProperties.icon}`} alt="" />
										</div>
										<span>{this.swapTitle(mwStatName)} Masterwork</span>
									</li>
								: <li>
										<div className="masterwork-icon">
											<img src={`https://www.bungie.net${manifest.DestinyInventoryItemDefinition[1176735155].displayProperties.icon}`} alt="" />
										</div>
									</li>
						}
						{
							mod.hash !== 0 
								? <li>
										<div className="mod-icon">
											<img src={`https://www.bungie.net${mod.displayProperties.icon}`} alt="" />
										</div>
										<span>{mod.displayProperties.name}</span>
									</li>
								: <li>
										<div className="mod-icon">
											<img src={`https://www.bungie.net${manifest.DestinyInventoryItemDefinition[1176735155].displayProperties.icon}`} alt="" />
										</div>
									</li>
						}
					</ul>
				</div>
			</div>
		)
	}
}

class Screenshot extends Component {

	render(){
		return (
			<div className="current__screenshot">
				<div
					data-for={`getContent-screenshot`} 
					data-tip>
						<button
							// onClick={() => {
							// 	this.props.toggleScreenshotView();
							// }}
							>
							<CameraIcon />
							<Tooltip 
								hash={`screenshot`}
								title={ 'Save Screenshot' }
								description={ 'Coming soon.' }
							/>
						</button>
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

})(Screenshot);