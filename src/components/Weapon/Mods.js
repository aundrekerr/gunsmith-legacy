import React, { Component } from 'react';
import { connect } from 'react-redux';
import { storeMod } from './../../actions/weaponActions';
import Tooltip from './../Tooltip.js';
import { Route } from "react-router-dom";
import Hashids from 'hashids';
const hashids = new Hashids();

class Mods extends Component {
	constructor(props) {
		super(props)

		const { manifest } = this.props;
		let modList = [];
		
		Object.keys(manifest.DestinyInventoryItemDefinition).map(mod => {
			return manifest.DestinyInventoryItemDefinition[mod].itemType === 19
				&& manifest.DestinyInventoryItemDefinition[mod].itemCategoryHashes.includes(1052191496)
				&& manifest.DestinyInventoryItemDefinition[mod].plug.plugCategoryIdentifier.includes('v400')
					? modList.push(manifest.DestinyInventoryItemDefinition[mod])
					: null
		})
		

		this.state = {
			modList: modList,
			activeMod: { hash: 0 },
			toggleActiveMod: ( mod ) => {
				this.setState(({ activeMod }) => ({
					activeMod: activeMod.hash === mod.hash ? { hash: 0 } : mod
				}))
			}
		}
	}

	componentDidMount() {
		const { weapon } = this.props;

		if ( weapon.mod.hash !== 0 ) { 	
			this.setState({
				activeMod: { hash: weapon.mod.hash }
			})
		}
	}

	componentDidUpdate(prevProps) {
		const { weapon } = this.props;

		if ( weapon.hash !== prevProps.weapon.hash ) { 	
			this.setState({
				activeMod: { hash: 0 }
			})
		}
	}

	render(){
		const {
			state: {
				modList,
				activeMod,
				toggleActiveMod
			},
			props: {
				manifest,
				weapon,
			}
		} = this;

		const itemDef = manifest.DestinyInventoryItemDefinition[weapon.hash];
		const itemTier = itemDef.inventory.tierType;

		if (itemTier !== 5) {
			return (
				<div className="weapon__tab weapon__mods empty">
					<span className="uppercase tracked-wide underline">Weapon Mods</span>
					<span>This weapon cannot equip a mod.</span>
				</div>
			)
		} else {
			return (
				<div className="weapon__tab weapon__mods">
					<span className="uppercase tracked-wide underline">Weapon Mods</span>
					<div className="mod-list__wrapper">
						<ul className="mod-list">
							{
								modList.map(mod => {
									return (
										<Route key={mod.hash} render={({ history }) => (
											<li className={ 
													activeMod.hash === mod.hash ? 'node active' : 'node' 
												}
												onClick={() => { 
													this.props.storeMod(mod); 
													toggleActiveMod(mod);
													let builtId = hashids.encode(
														weapon.hash, 
														weapon.perks.slotOne.hash, 
														weapon.perks.slotTwo.hash, 
														weapon.perks.slotThree.hash, 
														weapon.perks.slotFour.hash, 
														activeMod.hash !== mod.hash ? mod.hash : 0,
														weapon.masterwork.hash
												);
												history.push(`/w/${ builtId }`); 
											} }>
												<div className="mod-icon" data-for={`getContent-${mod.hash}`} data-tip>
													<img src={`https://bungie.net${ mod.displayProperties.icon }`} alt="" />
												</div>
												<Tooltip 
													hash={ mod.hash }
													title={ mod.displayProperties.name }
													subtitle={ mod.itemTypeDisplayName }
													description={ manifest.DestinySandboxPerkDefinition[mod.perks[0].perkHash].displayProperties.description }
													stats={ mod.investmentStats.length > 0 ? mod.investmentStats : null }
												/>
											</li>
										)} />
									)
								})
							}
						</ul>
					</div>
				</div>
			)
		}
	}
}

const mapStateToProps = state => ({
	manifest: state.manifest,
	weapon: state.weapon,
});

export default connect(mapStateToProps, {
	storeMod
})(Mods);