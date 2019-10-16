import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SearchInput from './SearchInput';
import Filters from './Filters';
import Suggestions from './Suggestions';
import { storeWeapon, storePerks, storeMod, storeMasterwork } from './../../actions/weaponActions';
import { storeRarity, storeWeaponType, storeDamage } from './../../actions/filterActions';

class Search extends Component {
	constructor(props) {
		super(props)

		this.state = {
			weaponList: [],
			filteredSuggestions: [],
			showSuggestions: false,
			userInput: '',
			currentRarity: null,
			currentWeaponType: 0,
			currentDamage: 0,
		}
	}

	componentDidMount() {
		const { manifest } = this.props;
		const { currentRarity } = this.state;
		
		let fullList = [];
		
		// All Weapons
		Object.keys(manifest.DestinyInventoryItemDefinition).map(weapon => {
			return manifest.DestinyInventoryItemDefinition[weapon].itemType === 3
				? fullList.push(manifest.DestinyInventoryItemDefinition[weapon])
				: null
		})

		let filteredList = fullList.filter(weapon => { 
			return weapon.inventory.tierTypeHash === currentRarity
		})

		this.setState({ 
			filteredSuggestions: filteredList,
			weaponList: fullList
		})
	}

	updateSuggestions = (input, from = {}) => {
		const { weaponList } = this.state;
		let { rarity, weaponType, damage } = this.props.filters;
		let { userInput } = this.state;

		// If the input field sends over data, make that the new input data to filter with.
		userInput = input;	
		
		// If a select field sends over a new filter, update the settings here.
		if ( from.hasOwnProperty('rarity') ) rarity = from.rarity;
		if ( from.hasOwnProperty('weaponType') ) weaponType = from.weaponType;
		if ( from.hasOwnProperty('damage') ) damage = from.damage;

		// Filter through the full weapons list based on the select field filters.
		let filteredList = weaponList;
		if (rarity) filteredList = filteredList.filter(weapon => { return weapon.inventory.tierTypeHash === rarity });
		if (weaponType) filteredList = filteredList.filter(weapon => { return weapon.itemSubType === weaponType });
		if (damage) filteredList = filteredList.filter(weapon => { return weapon.defaultDamageTypeHash === damage });

		// Filter through what's left based on the input field.
		let suggestions = filteredList.filter( suggestion => (suggestion.displayProperties.name).toLowerCase().indexOf(userInput.toLowerCase()) > -1 );

		// Set the new list and give the OK to display the suggestions.
		this.setState({
			filteredSuggestions: suggestions,
			showSuggestions: true,
		})
	}

	// SearchInput.js
	onInputChange = e => {
		this.setState({
			userInput: e.currentTarget.value
		})

		this.updateSuggestions(e.currentTarget.value);
	}

	// Filters.js
	changeRarity = (e) => {
		let toStore = e.target.value === 0 ? null : parseInt(e.target.value);
		this.setState({ currentRarity: toStore }); 
		this.props.storeRarity(toStore);
		this.updateSuggestions(this.state.userInput, { rarity: toStore });
	}
	changeWeaponType = (e) => {
		let toStore = e.target.value === 0 ? null : parseInt(e.target.value);
		this.setState({ currentWeaponType: toStore }); 
		this.props.storeWeaponType(toStore);
		this.updateSuggestions(this.state.userInput, { weaponType: toStore });
	}
	changeDamage = (e) => {
		let toStore = e.target.value === 0 ? null : parseInt(e.target.value);
		this.setState({ currentDamage: toStore }); 
		this.props.storeDamage(toStore);
		this.updateSuggestions(this.state.userInput, { damage: toStore });
	}
	

	onSuggestionClick = (hash) => {
		// console.log(hash)
		this.props.storeWeapon(hash);	
		this.props.storePerks({ hash: 0 }, 1);
		this.props.storePerks({ hash: 0 }, 2);
		this.props.storePerks({ hash: 0 }, 3);
		this.props.storePerks({ hash: 0 }, 4);
		this.props.storeMod({ hash: 0 });
		this.props.storeMasterwork({ hash: 0 });

		if ( window.innerWidth < 992) {
			this.setState({
				activeSuggestion: 0,
				filteredSuggestions: [],
				showSuggestions: false,
				userInput: ''
			})
		}

		this.props.toggleMenu();
	}

	getRefData = () => {
		let input = this.inputElem;
		let filters = this.filtersElem;
		const inputDomNode = ReactDOM.findDOMNode(input);
		const filtersDomNode = ReactDOM.findDOMNode(filters);
		input = inputDomNode.getBoundingClientRect();
		filters = filtersDomNode.getBoundingClientRect();

		return { filters, input };
	}

	render() {
		const {
			onInputChange,
			changeRarity,
			changeWeaponType,
			changeDamage,
			onSuggestionClick,
			
			state: {
				weaponList,
				filteredSuggestions,
				showSuggestions,
				userInput,
				currentRarity,
				currentWeaponType,
				currentDamage,
			},
			props: {
				manifestLoaded,
				menuView
			}
		} = this;
		
		return (
			<div className={`search__wrapper ${menuView}`}>
				<SearchInput 
					onInputChange={ onInputChange }
					userInput={ userInput }
					manifestLoaded={ manifestLoaded }
					inputRef={el => this.inputElem = el}
				/>
				<Filters 
					changeRarity={ changeRarity }
					changeWeaponType={ changeWeaponType }
					changeDamage={ changeDamage }
					currentRarity={ currentRarity }
					currentWeaponType={ currentWeaponType }
					currentDamage={ currentDamage }
					filtersRef={el => this.filtersElem = el}
				/>
				<Suggestions 
					weaponList={ weaponList }
					filteredSuggestions={ filteredSuggestions }
					showSuggestions={ showSuggestions }
					userInput={ userInput }
					onSuggestionClick={ onSuggestionClick }
					getRefData={ () => this.getRefData() }
				/>
			</div>
		)
	}
}

Search.propTypes = {
	storeWeapon: PropTypes.func.isRequired,
	storeRarity: PropTypes.func.isRequired,
	storeWeaponType: PropTypes.func.isRequired,
	storeDamage: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	manifest: state.manifest,
	manifestLoaded: state.manifestLoaded,
	filters: state.filters,
	weapon: state.weapon,
});

export default connect(mapStateToProps, { 
	storeWeapon, storePerks, storeMod, storeMasterwork,
	storeRarity, storeWeaponType, storeDamage,
})(Search);