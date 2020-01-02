import React, { Component } from 'react';
import Hashids from 'hashids';
import { connect } from 'react-redux';
import { Route } from "react-router-dom";
const hashids = new Hashids();

let curatedList = [
	3393519051, // Perfect Paradox
	3850168899, // Martyr's Retribution
	1251729046, // Steelfeather Repeater
	2723241847, // Patron of Lost Causes
	1289997971, // Breachlight
	946443267, // Line in the Sand
	3569802112, // The Old Fashioned
	410996590, // Jack Queen King 3
	3233390913, // Infinite Paths 8
	4149758318, // Traveler's Judgement 5
	3622137132, // Last Hope 
	4166221755, // Trophy Hunter
	1289324202, // Pyroclastic Flow
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