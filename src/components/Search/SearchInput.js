import React from 'react';
import { connect } from 'react-redux';

const SearchInput = (props) => {
	const {
		onInputChange,
		userInput,
		manifestLoaded,
		toggleFilter,
		filterView,
	} = props;
	
	return (
		<React.Fragment>
			<div className={`search__input filter-${window.innerWidth >= 992 ? 'hide' : 'show'}`} ref={props.inputRef}>
				<input
					type='text'
					onChange={ onInputChange }
					value={ userInput }
					placeholder='Find a weapon.'
					id='search'
					disabled={ manifestLoaded === false ? true : false }
					autoComplete="off"
				/>
			</div>
			<i 
				onClick={() => toggleFilter()}
				className={`filter-toggle ${filterView}`}
			>
			</i>
		</React.Fragment>
	)
}

const mapStateToProps = state => ({
	manifestLoaded: state.manifestLoaded
});

export default connect(mapStateToProps, { })(SearchInput);