import React, { Component } from 'react';
import Hashids from 'hashids';
import { connect } from 'react-redux';
import { Route } from "react-router-dom";
const hashids = new Hashids();

let curatedList = [
	3143732432, // False Promises
	1690783811, // The Forward Path
	1216130969, // Cold Denial
	211938782, // The Whispering Slab
	607191995, // Hollow Words
	1096206669, // IKELOS Shotgun
	1200824700, // IKELOS HC
	2222560548, // IKELOS SMG
	1253087083, // IKELOS Sniper
	1835747805, // Nature of the Beast
	2742490609, // Death Adder 
	65611680, // The Fool's Remedy
	3616586446, // First In, Last Out
	1271343896, // Widow's Bite
	407621213, // Berenger's Memory
	3669616453, // Hoosegow
	3629968765, // Negative Space
	35794111, // Temptation's Hook
	614426548, //Falling Guillotine

];


class Suggestions extends Component {
	constructor(props) {
		super(props)

		this.state = {
			sugHeight: 0
		}
	}
	
	componentDidMount(){
		const siblings = this.props.getRefData();
		let finalHeight = window.innerHeight - (siblings.filters.height + siblings.input.height + 128);

		this.setState({
			sugHeight: finalHeight
		})
	}
	
	render(){
		const {
			manifest,
			manifestLoaded,
			weaponList,
			filteredSuggestions,
			showSuggestions,
			// userInput,
			onSuggestionClick,
		} = this.props;

		const { sugHeight } = this.state;

		let curated;
		if ( weaponList.length && manifestLoaded){
			curated = curatedList.map(test => {
				return weaponList.filter(weapon => { return weapon.hash === test })[0];
			})
		}
		
		return (
			<div className="search__suggestions">
				{
					showSuggestions
						? filteredSuggestions.length 
							? <SuggestionList 
								filteredSuggestions={ filteredSuggestions }
								manifest={ manifest }
								onSuggestionClick={ onSuggestionClick } 
								sugHeight={ sugHeight }/>
							: <SuggestionListEmpty />
						: curated
							? <CuratedList 
								curatedList={ curated }
								manifest={ manifest }
								onSuggestionClick={ onSuggestionClick } 
								sugHeight={ sugHeight }/> 
							: null
				}
			</div>
		)
	}
}

const mapStateToProps = state => ({
	manifest: state.manifest,
	manifestLoaded: state.manifestLoaded
});
export default connect(mapStateToProps, { })(Suggestions);

 
const CuratedList = (props) => {
	const { manifest, curatedList, onSuggestionClick, sugHeight } = props;

	return (
		<React.Fragment>
			<span className="tracked-wide small">Featured</span>
			<ul className="suggestions-list" style={window.innerWidth >= 992 ? { height: sugHeight } : { height: 'auto' }}>
				{
					curatedList.map((suggestion) => {
						const builtId = hashids.encode(suggestion.hash);
						return (
							<Route key={ suggestion.hash } render={({ history }) => (
								<li onClick={() => {
									onSuggestionClick(suggestion.hash); 
									history.push(`/w/${ builtId }`); 
								}}>
									<div className="suggestion-icon">
										<img src={`https://www.bungie.net${manifest.DestinyInventoryItemDefinition[suggestion.hash].displayProperties.icon}`} alt=""/>
									</div>
									<div className="suggestion-title tracked-thin small">{ manifest.DestinyInventoryItemDefinition[suggestion.hash].displayProperties.name }</div>
								</li>
							)} />
						)
					})
				}
			</ul>
		</React.Fragment>
	)
}

const SuggestionList = (props) => {
	const { manifest, filteredSuggestions, onSuggestionClick, sugHeight } = props;

	return (
		<React.Fragment>
			<span className="tracked-wide small">Results</span>
			<ul className="suggestions-list" style={window.innerWidth >= 992 ? { height: sugHeight } : { height: 'auto' }}>
				{
					filteredSuggestions.map((suggestion) => {
						const builtId = hashids.encode(suggestion.hash);
						return (
							<Route key={ suggestion.hash } render={({ history }) => (
								<li onClick={() => { 
									onSuggestionClick(suggestion.hash); 
									history.push(`/w/${ builtId }`); 
								}}>
									<div className="suggestion-icon">
										<img src={`https://www.bungie.net${manifest.DestinyInventoryItemDefinition[suggestion.hash].displayProperties.icon}`} alt=""/>
									</div>
									<div className="suggestion-title tracked-thin small">{ manifest.DestinyInventoryItemDefinition[suggestion.hash].displayProperties.name }</div>
								</li>
							)} />
						)
					})
				}
			</ul>
		</React.Fragment>
	)
}

const SuggestionListEmpty = () => {
	return (
		<ul className="suggestion-list no-suggestion">
			<em>No weapon found. Use your light.</em>
		</ul>
	)
}