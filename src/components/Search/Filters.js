import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import collections from './../../utils/custom-data/weaponSets.js';

class SearchFilter extends Component {
	
	constructor(props) {
		super(props)

		this.state = {
			currentList: this.props.weaponList,
			currentCollection: null,
			currentRarity: 4008398120,
			currentWeaponType: 0,
			currentDamage: 0,
			weaponRarity: [
				{ hash: null, name: 'Any' },
				{ hash: 2759499571, name: 'Exotic' },
				{ hash: 4008398120, name: 'Legendary' },
				{ hash: 2127292149, name: 'Rare' },
				{ hash: 2395677314, name: 'Common' },
				{ hash: 3340296461, name: 'Basic' },
			],
			weaponTypes: [
				{ itemType: null, name: 'Any' },
				{ itemType: 6, name: 'Auto Rifle' },
				{ itemType: 9, name: 'Hand Cannon' },
				{ itemType: 13, name: 'Pulse Rifle' },
				{ itemType: 14, name: 'Scout Rifle' },
				{ itemType: 17, name: 'Sidearm' },
				{ itemType: 24, name: 'Submachine Gun' },
				{ itemType: 31, name: 'Bow' },
				{ itemType: 7, name: 'Shotgun' },
				{ itemType: 12, name: 'Sniper Rifle' },
				{ itemType: 11, name: 'Fusion Rifle' },
				{ itemType: 25, name: 'Trace Rifle' },
				{ itemType: 23, name: 'Grenade Launcher' },
				{ itemType: 10, name: 'Rocket Launcher' },
				{ itemType: 22, name: 'Linear Fusion Rifle' },
				{ itemType: 8, name: 'Machinegun' },
				{ itemType: 18, name: 'Sword' },
			],
			damageTypes: [
				{ hash: null, name: 'Any' },
				{ hash: 3373582085, name: 'Kinetic' },
				{ hash: 1847026933, name: 'Solar' },
				{ hash: 2303181850, name: 'Arc' },
				{ hash: 3454344768, name: 'Void' }
			],
		}
	}

	render() {
		const { 
			state: {
				weaponTypes, 
				damageTypes, 
				weaponRarity,
			},
			props: {
				changeCollection,
				changeRarity,
				changeWeaponType,
				changeDamage,
				currentCollection,
				currentRarity,
				currentWeaponType,
				currentDamage,
			}
		} = this;
		
		return (
			<ul className="search__filters" ref={this.props.filtersRef}>
				<li>
					<label htmlFor="weapon-collection">
						<span className="tracked-wide small">Collection</span>
						<CollectionSelect 
							collectionList={ collections } 
							changeCollection={changeCollection }
							currentCollection={ currentCollection }
						/>
					</label>
				</li>
				<li>
					<label htmlFor="weapon-rarity">
						<span className="tracked-wide small">Rarity</span>
						<RaritySelect 
							weaponRarity={ weaponRarity } 
							changeRarity={ changeRarity }
							currentRarity={ currentRarity }
						/>
					</label>
				</li>
				<li>
					<label htmlFor="weapon-type">
						<span className="tracked-wide small">Weapon Type</span>
						<WeaponTypeSelect 
							weaponTypes={ weaponTypes } 
							changeWeaponType={ changeWeaponType }
							currentWeaponType={ currentWeaponType }
						/>
					</label>
				</li>
				<li>
					<label htmlFor="damage-type">
						<span className="tracked-wide small">Damage Type</span>
						<DamageSelect 
							damageTypes={ damageTypes } 
							changeDamage={ changeDamage }
							currentDamage={ currentDamage }
						/>
					</label>
				</li>
			</ul>
		)
	}
}
  
const mapStateToProps = state => ({
	manifest: state.manifest
});

export default connect(mapStateToProps, {  })(SearchFilter);


// Collection 
const CollectionSelect = (props) => {
	const { collectionList, changeCollection, currentCollection } = props;
	return (
		<select 
			name="damage-type" 
			onChange={ changeCollection } 
			value={ currentCollection === null ? 0 : currentCollection }
		>
			{collectionList.map((col, index) => {
				return (
					<option 
						value={ col.name } 
						key={ index }
					>
						{ col.name }
					</option>
				)
			})}
		</select>
	)	
}

// Damage 
const DamageSelect = (props) => {
	const { damageTypes, changeDamage, currentDamage } = props;
	return (
		<select 
			name="damage-type" 
			onChange={ changeDamage } 
			value={ currentDamage === null ? 0 : currentDamage }
		>
			{damageTypes.map((type) => {
				return (
					<option 
						value={ type.hash === null ? 0 : type.hash } 
						key={ type.hash === null ? 0 : type.hash }
					>
						{ type.name }
					</option>
				)
			})}
		</select>
	)	
}

// Weapon Type
const WeaponTypeSelect = (props) => {
	const { weaponTypes, changeWeaponType, currentWeaponType } = props;
	return (
		<select 
			name="weapon-type" 
			onChange={ changeWeaponType } 
			value={ currentWeaponType === null ? 0 : currentWeaponType }
		>
			{weaponTypes.map((type) => {
				return (
					<option 
						value={ type.itemType === null ? 0 : type.itemType } 
						key={ type.itemType === null ? 0 : type.itemType }
					>
						{ type.name }
					</option>
				)
			})}
		</select>
	)	
}

// Rarity 
const RaritySelect = (props) => {
	const { weaponRarity, changeRarity, currentRarity } = props;
	return (
		<select 
			name="weapon-rarity"  
			onChange={ changeRarity } 
			value={ currentRarity === null ? 0 : currentRarity }
		>
			{weaponRarity.map((type) => {
				return (
					<option 
						value={ type.hash === null ? 0 : type.hash } 
						key={ type.hash === null ? 0 : type.hash }
					>
						{ type.name }
					</option>
				)
			})}
		</select>
	)
}