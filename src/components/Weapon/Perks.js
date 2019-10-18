import React, { Component } from 'react';
import { connect } from 'react-redux';
import { buildPerks } from '../../utils/perks.js';
import { storePerks } from './../../actions/weaponActions';
import Tooltip from './../Tooltip.js';
import Hashids from 'hashids';
import { Route } from "react-router-dom";
const hashids = new Hashids();

class Perks extends Component {
	constructor(props) {
		super(props)

		this.state = {
			perks: [],
			activePerks: [null, null, null, null],
			toggleActivePerkNode: (perkSlot, perkIndex) => {
				if (perkSlot === 0) { 
					this.setState(({ activePerks }) => { 
						if (activePerks[0] === perkIndex) {
							activePerks[0] = null; 
						} else {
							activePerks[0] = perkIndex;
						}
					}) 
				};
				if (perkSlot === 1) { 
					this.setState(({ activePerks }) => { 
						if (activePerks[1] === perkIndex) {
							activePerks[1] = null; 
						} else {
							activePerks[1] = perkIndex;
						}
					}) 
				};
				if (perkSlot === 2) { 
					this.setState(({ activePerks }) => { 
						if (activePerks[2] === perkIndex) {
							activePerks[2] = null; 
						} else {
							activePerks[2] = perkIndex;
						}
					}) 
				};
				if (perkSlot === 3) { 
					this.setState(({ activePerks }) => { 
						if (activePerks[3] === perkIndex) {
							activePerks[3] = null; 
						} else {
							activePerks[3] = perkIndex;
						}
					}) 
				};
			},
		}
	}

	componentDidMount() {
		const { manifest, weapon } = this.props;
		if ( weapon.hash ) {
			const weaponPerks = buildPerks(manifest, weapon);

			let slotOne = weaponPerks[1].findIndex(e => { return e.hash === weapon.perks.slotOne.hash }) >= 0 
				? weaponPerks[1].findIndex(e => { return e.hash === weapon.perks.slotOne.hash })
				: null
			let slotTwo = weaponPerks[2].findIndex(e => { return e.hash === weapon.perks.slotTwo.hash }) >= 0 
				? weaponPerks[2].findIndex(e => { return e.hash === weapon.perks.slotTwo.hash })
				: null
			let slotThree = weaponPerks[3].findIndex(e => { return e.hash === weapon.perks.slotThree.hash }) >= 0 
				? weaponPerks[3].findIndex(e => { return e.hash === weapon.perks.slotThree.hash })
				: null
			let slotFour = weaponPerks[4].findIndex(e => { return e.hash === weapon.perks.slotFour.hash }) >= 0 
				? weaponPerks[4].findIndex(e => { return e.hash === weapon.perks.slotFour.hash })
				: null

			this.setState({ 
				perks: buildPerks(manifest, weapon),
				activePerks: [
					slotOne,
					slotTwo,
					slotThree,
					slotFour
				]
			});
		}
	}

	componentDidUpdate(prevProps) {
		const { manifest, weapon } = this.props;
		if ( weapon.hash !== prevProps.weapon.hash ) {
			this.setState({ 
				perks: buildPerks(manifest, weapon),
				activePerks: [null, null, null, null],
			});
		}
	}


	render(){
		const {
			state: {
				perks,
				activePerks,
				toggleActivePerkNode
			},
			props: {
				manifest,
				weapon,
				storePerks
			}
		} = this;

		return (
			<div className="weapon__tab weapon__perks">
				<span className="uppercase tracked-wide underline">Weapon Perks</span>
				<div className="perk-grid__wrapper">
					{
						perks.map((perkColumn, index) => {
							let columnIndex = index;
							return (
								<ul className="perk-grid__column" key={index}>
									{
										perkColumn.map((perk, perkIndex) => {
											const perkDef = manifest.DestinyInventoryItemDefinition[perk.hash];
											return (
												<Route key={ `${perk.hash}-${perk.isCurated ? 'curated' : 'random'}` } render={({ history }) => (
													<li className={
															`${ perk.isCurated ? 'curated' : '' } 
															${ perk.curatedOnly ? 'curated-only ' : '' } 
															${ perk.isIntrinsic ? 'frame ' : '' }
															${ activePerks[columnIndex - 1] === perkIndex ? 'active ' : '' }
															node`
														}
														onClick={ () => {
															storePerks(perk, columnIndex);
															toggleActivePerkNode(columnIndex - 1, perkIndex);
															let builtId = hashids.encode(
																	weapon.hash, 
																	columnIndex === 1 
																		? activePerks[columnIndex - 1] === perkIndex
																			? 0
																			: perk.hash 
																		: weapon.perks.slotOne.hash, 
																	columnIndex === 2 
																		? activePerks[columnIndex - 1] === perkIndex
																			? 0
																			: perk.hash 
																		: weapon.perks.slotTwo.hash, 
																	columnIndex === 3 
																		? activePerks[columnIndex - 1] === perkIndex
																			? 0
																			: perk.hash 
																		: weapon.perks.slotThree.hash, 
																	columnIndex === 4
																		? activePerks[columnIndex - 1] === perkIndex
																			? 0
																			: perk.hash 
																		: weapon.perks.slotFour.hash, 
																	weapon.mod.hash, 
																	weapon.masterwork.hash
															);
															history.push(`/w/${ builtId }`); 
													}}>
														<div className='perk-icon' data-for={`getContent-${perk.hash}`} data-tip>
															<img 
																src={ `https://bungie.net${perkDef.displayProperties.icon}` } 
																alt={`Destiny 2 Perk - ${perkDef.displayProperties.name}`} />
														</div>
														<Tooltip 
															hash={ perk.hash }
															title={ perkDef.displayProperties.name }
															subtitle={ perkDef.itemTypeDisplayName }
															description={ perkDef.displayProperties.description }
															stats={ perkDef.investmentStats.length > 0 ? perkDef.investmentStats : null }
														/>
													</li>
												)}/>
											)
										})
									}
								</ul>
							)
						})
					}
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
	storePerks, 
})(Perks);