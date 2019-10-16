import React from 'react';
import { connect } from 'react-redux';

const SearchInput = (props) => {
	const {
		onInputChange,
		userInput,
		manifestLoaded,
	} = props;
	
	return (
		<React.Fragment>
			<div className="search__input" ref={props.inputRef}>
				<input
					type='text'
					onChange={ onInputChange }
					value={ userInput }
					placeholder='Find a weapon'
					id='search'
					disabled={ manifestLoaded === false ? true : false }
					autoComplete="off"
				/>
				<i className="icon"></i>
			</div>
		</React.Fragment>
	)
}

const mapStateToProps = state => ({
	manifestLoaded: state.manifestLoaded
});

export default connect(mapStateToProps, { })(SearchInput);