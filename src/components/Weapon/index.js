import React, { Component } from 'react';
import { connect } from 'react-redux';
import Current from './Current';
import Vanity from './Vanity';
import Perks from './Perks';
import Mods from './Mods';
import Masterworks from './Masterworks';
import Hashids from 'hashids';
import { storeWeapon, storePerks, storeMod, storeMasterwork } from './../../actions/weaponActions';
import { Route, withRouter } from "react-router-dom";
const hashids = new Hashids();

class Weapon extends Component {

	componentDidMount() {
		const { weapon } = this.props;

		if ( !weapon.hash ) {
			this.unpackBuiltId(this.props.match.params.builtId);
		}
	}

	unpackBuiltId = (builtId) => {
		const { manifest } = this.props;
		const decoded = hashids.decode(builtId);
		this.props.storeWeapon( decoded[0] );

		if ( decoded[1] ) this.props.storePerks({ hash: decoded[1] }, 1);
		if ( decoded[2] ) this.props.storePerks({ hash: decoded[2] }, 2);
		if ( decoded[3] ) this.props.storePerks({ hash: decoded[3] }, 3);
		if ( decoded[4] ) this.props.storePerks({ hash: decoded[4] }, 4);
		if ( decoded[5] ) {
			if ( decoded[5] !== 0) {
				const modDef = manifest.DestinyInventoryItemDefinition[ decoded[5] ];
				this.props.storeMod( modDef );
			}
		}
		if ( decoded[6] ) {
			if ( decoded[6] !== 0) {
				const mwDef = manifest.DestinyInventoryItemDefinition[ decoded[6] ];
				this.props.storeMasterwork( mwDef );
			}
		}
	}

	render(){
		const {
			props: {
				weapon 
			}
		} = this;

		if ( weapon.hash !== null ) {
			return (
				<React.Fragment>
					<Route path='/w' render={({ history }) => (
						<div className="weapon__wrapper">
							<Vanity />
							<Current />
							<Perks />
							<Masterworks />
							<Mods />
						</div>
					)}/>
				</React.Fragment>
			)
		} else {
			return (
				<Empty />
			)
		}
	}
}

const mapStateToProps = state => ({
	manifest: state.manifest,
	weapon: state.weapon,
});

export default connect(mapStateToProps, {
	storeWeapon, storePerks, storeMod, storeMasterwork,
})(withRouter(Weapon));


const Empty = (props) => {
	return (
		<div className="weapon__wrapper empty">
			<p>Uh oh.</p>
		</div>
	)
}