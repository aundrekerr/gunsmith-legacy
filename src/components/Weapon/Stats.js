import React, { Component } from 'react';
import { connect } from 'react-redux';
import { buildStats, enhanceStatsWithPlugs } from './../../utils/stats.js';

class Stats extends Component {
	constructor(props) {
		super(props)

		this.state = {
			displayInfo: {},
			baseStats: [],
		}
	}

	componentDidMount() {
		const { manifest, weapon } = this.props;
		if ( weapon.hash ) {
			this.setState({
				displayInfo: manifest.DestinyInventoryItemDefinition[weapon.hash].displayProperties,
				baseStats: buildStats(manifest, weapon.hash),
			});
		}
	}

	componentDidUpdate(prevProps) {
		const { manifest, weapon } = this.props;

		if ( weapon.hash !== prevProps.weapon.hash ) { 	
			this.setState({
				displayInfo: manifest.DestinyInventoryItemDefinition[weapon.hash].displayProperties,
				baseStats: buildStats(manifest, weapon.hash),
			});
		}
	}
	
	render(){
		const { manifest, weapon } = this.props;
		const { baseStats } = this.state;
		const weaponSubType = manifest.DestinyInventoryItemDefinition[weapon.hash].itemSubType;

		const enhancedStats = enhanceStatsWithPlugs(
			buildStats(manifest, weapon.hash),
			weapon.hash,
			weapon.perks, 
			weapon.mod, 
			weapon.masterwork
		);
		
		return (
			<div className="weapon__stats">
				
				<ul className="stat-list">
					{ 
						enhancedStats.map(stat => {
							if ( stat !== undefined ) {
								const {
									statHash,
									displayProperties,
									bar,
									value,
									mwDiff
								} = stat;

								const baseStat = baseStats.filter(base => {
									return base ? (
										base.statHash === stat.statHash
									) : (
										null
									)
								});

								const baseVal = baseStat.length > 0 ? baseStat[0].value : 0;
								let modifier = baseStat.length > 0 ? stat.value - baseVal : 0;
								let masterwork = mwDiff ? mwDiff : 0;


								// Hide the Zoom stat for Swords.
								if (weaponSubType === 18 && statHash === 3555269338) return null

								// Bar stats
								return (
									<li key={statHash} className="stat__container">
										<div className="stat__name">
											<span>{ displayProperties.name }</span>
										</div>
										<div className={`stat__data ${bar ? 'bar' : 'num'}`}>
											{
												bar 
													? (
														<React.Fragment>
															<div 
																className='progress main' 
																data-value={value}>
																{value}
																<i style={{width: `${value}%`}}></i>
															</div> 
															<div 
																className={`progress modifier ${modifier >= 0 ? modifier !== 0 ? 'positive' : 'neutral' : 'negative'}`} 
																data-value={modifier >= 0 ? modifier : -modifier}
																// style={{left: `${baseVal}%`}}
																style={ modifier >= 0 
																		? {left: `${baseVal}%`} 
																		: {left: `-${100 - baseVal}%`}
																}
																>
																<i style={{width: `${modifier >= 0 ? modifier : Math.abs(modifier)}%`}}></i>
															</div>
															<div 
																className="progress masterwork"
																data-value={masterwork > 0 ? masterwork : 0}
																style={ {left: `${baseVal}%`} }
																>
																<i style={{width: `${masterwork}%`}}></i>
															</div>

															<span className={`benefit-value ${modifier >= 0 ? modifier !== 0 ? 'positive' : 'neutral' : 'negative'}`}>
																{
																	modifier >= 0 
																		? modifier === 0
																			? '±' + modifier 
																			: '+' + modifier
																		: modifier
																}
															</span>
														</React.Fragment>
													) : (
														<span className={`stat__value ${
															modifier >= 0 
																? modifier !== 0 
																	? stat.smallerIsBetter 
																		? 'negative reverse'
																		: 'positive'
																	: 'neutral' 
																: stat.smallerIsBetter 
																	? 'positive reverse'
																	: 'negative'
														}`}>
															{value}
														</span>
													)
											}
										</div>
									</li>
								)
							}

							return true;
						})
					}
				</ul>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	manifest: state.manifest,
	weapon: state.weapon,
});

export default connect(mapStateToProps, { 
	
})(Stats);