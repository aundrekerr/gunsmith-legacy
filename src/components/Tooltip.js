import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import { buildSingleStat, buildStats } from '../utils/stats';
import bonusDetails from './../utils/custom-data/bonus.js';

const details = [];
bonusDetails.forEach(mod => {
	return details.push(mod);
});

class Tooltip extends Component {
	getTooltipNode = () => {
		const domNode = ReactDOM.findDOMNode(this.hash);
		return {
			width: domNode.getBoundingClientRect().width,
			height: domNode.getBoundingClientRect().height,
		}
	}

	render(){
		const {
			props: {
				hash,
				title,
				subtitle,
				description,
				stats,
				
				manifest,
				weapon
			},
		} = this;

		const detail = (details.filter(data => hash === data.hash))[0];

		return (
			<ReactTooltip 
				id={`getContent-${hash}`}
				offset={{top: 0, right: 20}}
				overridePosition={ ({ left, top }, currentEvent, currentTarget, node) => {
					const d = document.documentElement;

					const tooltipWidth = this.getTooltipNode().width;
					const tooltipHeight = this.getTooltipNode().height;
					
					left = Math.min(d.clientWidth - node.clientWidth, left);
					top = Math.min(d.clientHeight - node.clientHeight, top);
					
					left = Math.max(0, left);
					top = Math.max(0, top);
					
					if (left + tooltipWidth > window.innerWidth) {
						left = window.innerWidth - (tooltipWidth + 20)
					}
					
					if (top + tooltipHeight > window.innerHeight) {
						top = window.innerHeight - (tooltipHeight + 20)
					}

					return { top, left }
				} }
			>
				<div className="tooltip" ref={(c) => this['hash'] = c}>
					<header>
						<h3>{ title }</h3>
						{ subtitle ? <span>{ subtitle }</span> : null }
					</header>
					<div className="tooltip-content">
						{ description ? <pre className="description">{ description }</pre> : null }
						{ detail ? <span>{ detail.description }</span> : null }
						{ stats ? <TooltipStats stats={ stats } manifest={ manifest } weapon={ weapon }/> : null }
					</div>
				</div>
			</ReactTooltip>
		)
	}
}

const TooltipStats = (props) => {
	const {
		stats,
		manifest,
		weapon
	} = props;

	return (
		<div className='tooltip-stats'>
			<ul>
				{
					stats.map((stat, index) => {
						const perkVal = buildSingleStat(
							buildStats(
								manifest,
								weapon.hash
							),
							stat,
							weapon.hash,
							weapon.mod,
							weapon.masterwork
						)

						return (
							<li key={ index } className="stat">
								{ 
									<React.Fragment>
										<span className="stat__desc">{ manifest.DestinyStatDefinition[stat.statTypeHash].displayProperties.name }</span>
										<span className="stat__value">
											{
												perkVal >= 0 
													? perkVal === 0
														? `±${perkVal}` 
														: `+${perkVal}` 
													: perkVal
											}
										</span>
									</React.Fragment>
								}
							</li>
						)
					})
				}
			</ul>
		</div>
	)
}

const mapStateToProps = state => ({
	manifest: state.manifest,
	weapon: state.weapon,
});

export default connect(mapStateToProps, {
	
})(Tooltip);