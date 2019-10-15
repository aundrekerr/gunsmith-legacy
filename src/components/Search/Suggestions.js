import React, { Component } from 'react';
import { connect } from 'react-redux';

let curatedList = [
	48643186, // Ancient Gospel
	2408405461, // Sacred Provenance
	4020742303, // Prophet of Doom
	3454326177, // Omniscient Eye
	4095896073, // Accrued Redemption
	1645386487, // Tranquility
	3690523502, // Love and Death
	208088207, // Premonition
	2138599001, // Optative
	1167153950, // Adhortative
	3535742959, // Randy's Throwing Knife
	755130877, // Last Man Standing
	3524313097, // Eriana's Vow
	4068264807, // Monte Carlo
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
						: window.innerWidth >= 992
							? curated
								? <CuratedList 
									curatedList={ curated }
									manifest={ manifest }
									onSuggestionClick={ onSuggestionClick } 
									sugHeight={ sugHeight }/> 
								: null
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
						return (
							<li 
								key={ suggestion.hash } 
								onClick={() => { onSuggestionClick(suggestion.hash) }}
							>
								<div className="suggestion-icon">
									<img src={`https://www.bungie.net${manifest.DestinyInventoryItemDefinition[suggestion.hash].displayProperties.icon}`} alt=""/>
								</div>
								<div className="suggestion-title tracked-thin small">{ manifest.DestinyInventoryItemDefinition[suggestion.hash].displayProperties.name }</div>
							</li>
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
						return (
							<li 
								key={ suggestion.hash } 
								onClick={() => { onSuggestionClick(suggestion.hash) }}
							>
								<div className="suggestion-icon">
									<img src={`https://www.bungie.net${manifest.DestinyInventoryItemDefinition[suggestion.hash].displayProperties.icon}`} alt=""/>
								</div>
								<div className="suggestion-title tracked-thin small">{ manifest.DestinyInventoryItemDefinition[suggestion.hash].displayProperties.name }</div>
							</li>
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