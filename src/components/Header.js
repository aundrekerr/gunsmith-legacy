import React, { Component } from 'react';
import { connect } from 'react-redux';
// import Tooltip from './Tooltip.js';
import Search from './Search';

class Header extends Component {

	render() {
		return (
			<header className="app__header">
				<div className="header__container">
					<div className="app__logo tracked-wide" data-for='getContent-0000' data-tip><span>GUNSMITH</span></div>
					{/* <Tooltip 
						hash='0000'
						title='title'
						subtitle='subtitle'
						description='description'
					/> */}
					<Search />
				</div>
			</header>
		)
	}
}

const mapStateToProps = state => ({
	manifest: state.manifest
});

export default connect(mapStateToProps, { })(Header);