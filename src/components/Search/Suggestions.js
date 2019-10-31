import React, { Component } from 'react';
import Hashids from 'hashids';
import { connect } from 'react-redux';
import { Route } from "react-router-dom";
const hashids = new Hashids();

let curatedList = [
	3645283765, // BrayTech Werewolf
	2164448701, // Apostate
	2782847179, // Blasphemer
	3067821200, // Heretic
	2138599001, // Optative
	1167153950, // Adhortative
	1645386487, // Tranquility
	3690523502, // Love and Death
	208088207, // Premonition
	48643186, // Ancient Gospel
	2408405461, // Sacred Provenance
	4020742303, // Prophet of Doom
	3454326177, // Omniscient Eye
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