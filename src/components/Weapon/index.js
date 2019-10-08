import React, { Component } from 'react';
import { connect } from 'react-redux';
import Current from './Current';
import Vanity from './Vanity';
import Perks from './Perks';
import Mods from './Mods';
import Masterworks from './Masterworks';

class Weapon extends Component {

	render(){
		const {
			props: {
				weapon 
			}
		} = this;

		if ( weapon.hash !== null ) {
			return (
				<div className="weapon__wrapper">
					<Vanity />
					<Current />
					<Perks />
					<Masterworks />
					<Mods />
				</div>
			)
		} else {
			return (
				<div className="weapon__wrapper empty">
					<span className="tracked-wide underline uppercase">What is this?</span>
					<p>A weapon roll builder for Destiny 2 that calculates perk benefits on the fly.</p>
					<br/>
					<span className="tracked-wide underline uppercase">How do I use it?</span>
					<p>Search for a weapon then select the perks, mods, and/or masterwork that you'd like to see.</p>
					<p>Some perks will have extra info under their tooltip such as the calculated stat benefits or in-depth information how it works.</p>
					<p>Gold rings on a perk indicate that it's for the curated roll, but not all are accurate (see Tigerspite) or even drop in-game (see 
					Parcel of Stardust). Red indicates that the perk is exclusive to the curated roll.</p>
					<br/>
					<span className="tracked-wide underline uppercase">Is OEM balanced?</span>
					<p>Does Shaxx take off his helmet?</p>
					<br/>
					<span className="tracked-wide underline uppercase">More questions?</span>
					<p>Ask me on <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/aundre_kerr">Twitter</a>.</p>
				</div>
			)
		}
	}
}

const mapStateToProps = state => ({
	weapon: state.weapon,
});

export default connect(mapStateToProps, {})(Weapon);