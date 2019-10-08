import React, { Component } from 'react';
import { connect } from 'react-redux';
import { buildPerks } from '../../utils/perks.js';
import { storePerks } from './../../actions/weaponActions';
import Tooltip from './../Tooltip.js';
// import { buildStats, enhanceStatsWithPlugs } from '../../utils/stats.js';

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
			this.setState({ perks: buildPerks(manifest, weapon) });
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
												<li key={ `${perk.hash}-${perk.isCurated ? 'curated' : 'random'}` }
													className={
														`${ perk.isCurated ? 'curated' : '' } 
														${ perk.curatedOnly ? 'curated-only ' : '' } 
														${ perk.isIntrinsic ? 'frame ' : '' }
														${ activePerks[columnIndex - 1] === perkIndex ? 'active ' : '' }
														node`
													}
													onClick={ () => {
														storePerks(perk, columnIndex);
														toggleActivePerkNode(columnIndex-1, perkIndex);
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