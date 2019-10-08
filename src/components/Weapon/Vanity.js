import React, { Component } from 'react';
import { connect } from 'react-redux';
import Stats from './Stats';

class Vanity extends Component {

	constructor(props) {
		super(props);

		const {
			manifest,
			weapon
		} = this.props; 
	
		
		this.state = {
			currentWeapon: manifest.DestinyInventoryItemDefinition[weapon.hash],
			dmgType: this.getDamageType(manifest.DestinyInventoryItemDefinition[weapon.hash].defaultDamageType)
		}
	}

	componentDidUpdate(prevProps) {
		const { manifest, weapon } = this.props;
		if ( weapon.hash !== prevProps.weapon.hash ) { 
			this.setState({
				currentWeapon: manifest.DestinyInventoryItemDefinition[weapon.hash],
				dmgType:  this.getDamageType(manifest.DestinyInventoryItemDefinition[weapon.hash].defaultDamageType)
			})
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
		const {
			currentWeapon,
			dmgType
		} = this.state;

		return (
			<div className={`weapon__vanity ${dmgType}`} style={{backgroundImage: `url(https://bungie.net${ currentWeapon.screenshot })`}}>
				<div className="weapon__display">
					<div className="icon" style={{ backgroundImage: `url(https://bungie.net${ currentWeapon.displayProperties.icon })`}}></div>
					<div className="title">
						<span className="bold uppercase name">{ currentWeapon.displayProperties.name }</span>
						<span className="uppercase type">{ currentWeapon.itemTypeDisplayName }</span>
					</div>
				</div>
				<Stats />
			</div>
		)
	}
}

const mapStateToProps = state => ({
	manifest: state.manifest,
	weapon: state.weapon,
});

export default connect(mapStateToProps, { 
	
})(Vanity);