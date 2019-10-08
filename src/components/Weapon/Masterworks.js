import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getMasterworks } from './../../utils/masterworks.js';
import { storeMasterwork } from './../../actions/weaponActions';
import Tooltip from './../Tooltip.js';

class Masterworks extends Component {

	constructor(props) {
		super(props)

		const { manifest, weapon } = this.props;
		const retrievedMWs = getMasterworks(manifest, weapon.hash);

		this.state = {
			masterworks: retrievedMWs,
			activeMW: { hash: 0 },
			currentMWStat: Object.keys(retrievedMWs.mwCollection)[0],
			toggleActiveMW: ( mod ) => {
				this.setState(({ activeMW }) => ({
					activeMW: activeMW.hash === mod.hash ? { hash: 0 } : mod
				}))
			},
		}
	}

	componentDidUpdate(prevProps) {
		const { manifest, weapon } = this.props;
		if ( weapon.hash !== prevProps.weapon.hash ) {
			this.setState({ 
				masterworks: getMasterworks(manifest, weapon.hash),
				activeMW: { hash: 0 }
			})
		}
	}

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

	changeCurrentMWStat = e => {
		this.setState({
			currentMWStat: e.target.value
		})
	}
	
	render(){
		const {
			state: {
				masterworks,
				activeMW,
				toggleActiveMW,
				currentMWStat,
			},
			props: {
				manifest,
				weapon,
				storeMasterwork,
			},
			swapTitle,
			changeCurrentMWStat
		} = this;

		const itemDef = manifest.DestinyInventoryItemDefinition[weapon.hash];
		const itemTier = masterworks !== null ? itemDef.inventory.tierType : 0;

		if (itemTier === 5) { // Legendary
			return (
				<div className="weapon__tab weapon__masterworks">
					<Masterwork 
						weapon={ weapon }
						masterworks={ masterworks.mwCollection }
						
						isY1={ masterworks.isY1 }
						activeMW={ activeMW }
						currentMWStat={ currentMWStat }
						changeCurrentMWStat={ changeCurrentMWStat }
						toggleActiveMW={ toggleActiveMW }

						storeMasterwork={ storeMasterwork }
						swapTitle={ swapTitle }
					/>
				</div>
			)
		} else if (itemTier === 6) { // Exotic
			return (
				<div className="weapon__tab weapon__masterworks">
					<Catalyst 
						activeMW={ activeMW }
						catalyst={ masterworks.catalystDefs }
						toggleActiveMW={ toggleActiveMW }
						storeMasterwork={ storeMasterwork }
					/>
				</div>
			)
		} else {
			return (
				<div className="weapon__tab weapon__masterworks">
					<span className="uppercase tracked-wide underline">Masterwork</span>
					<span>This weapon cannot equip a masterwork.</span>
				</div>
			)
		}
	}
}

const Masterwork = (props) => {
	const {
		masterworks,

		isY1,
		currentMWStat,
		changeCurrentMWStat,
		activeMW,
		toggleActiveMW,
		storeMasterwork,

		swapTitle,
	} = props;

	if (isY1) {
		return (
			<React.Fragment>
				<span className="uppercase tracked-wide underline">Masterwork</span>
				<span>Under construction.</span>
			</React.Fragment>
		)
	} else {
		return (
			<React.Fragment>
				<span className="uppercase tracked-wide underline">Masterwork</span>
				<div className="masterwork-sections">
					{
						<React.Fragment>
							<label htmlFor="mw-stat">
								<select
									name="mw-stat" 
									onChange={ changeCurrentMWStat } 
									value={ currentMWStat }>
									{
										Object.keys(masterworks).map(mwStat => {
											if (masterworks[mwStat].active) {
												return <option key={mwStat} value={mwStat}>{ swapTitle(mwStat) }</option>
											} 
											return true;
										})
									}
								</select>
							</label>
							<ul className="masterwork-list">
								{
									masterworks[currentMWStat].benefits.map(mw => {
										return (
											<li key={mw.hash}
											className={ 
												activeMW.hash === mw.hash ? 'node active' : 'node' 
											}
											onClick={() => {
												storeMasterwork(mw); 
												toggleActiveMW(mw);
											}}>
												<div className="mw-icon" data-for={`getContent-${mw.hash}`} data-tip><img src={`https://bungie.net${mw.displayProperties.icon}`} alt=""/></div>
												<Tooltip 
													hash={ mw.hash }
													title={ mw.displayProperties.name }
													subtitle={ mw.itemTypeDisplayName }
													description={ mw.displayProperties.description }
													stats={ mw.investmentStats.length > 0 ? mw.investmentStats : null }
												/>
											</li>
										)
									})
								}
							</ul>
						</React.Fragment>
					}
				</div>
			</React.Fragment>
		)
	}
}

const Catalyst = (props) => {
	const {
		catalyst,
		activeMW,
		toggleActiveMW,
		storeMasterwork,
	} = props;

	return (
		<React.Fragment>
			<span className="uppercase tracked-wide underline">Catalyst</span>
			<div className="masterwork-sections">
				<ul className="masterwork-list">
					{
						catalyst.map(mw => {
							return (
								<li key={mw.hash}
									className={ 
										activeMW.hash === mw.hash ? 'node active' : 'node' 
									}
									onClick={ () => { 
										storeMasterwork(mw); 
										toggleActiveMW(mw);
								} }>
									<div className="mw-icon">
										<img src={`https://bungie.net${mw.displayProperties.icon}`} alt="" />
									</div>
									{/* <Tooltip 
										title={ mw.displayProperties.name }
										subtitle={ mw.itemTypeDisplayName }
										description={ mw.displayProperties.description }
										stats={ mw.investmentStats.length > 0 ? mw.investmentStats : null }
									/> */}
								</li>
							)
						})
					}
				</ul>
			</div>
		</React.Fragment>
	)
}

const mapStateToProps = state => ({
	manifest: state.manifest,
	weapon: state.weapon,
	tooltip: state.tooltip,
});

export default connect(mapStateToProps, {
	storeMasterwork
})(Masterworks);