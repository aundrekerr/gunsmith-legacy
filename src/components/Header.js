import React, { Component } from 'react';
import { connect } from 'react-redux';
// import Tooltip from './Tooltip.js';
import Search from './Search';

class Header extends Component {

	constructor(props){
		super(props)

		this.state = {
			menuView: 'hide',
			toggleMenu: () => {
				this.setState(({ menuView }) => ({
					menuView: menuView === 'hide' ? 'show' : 'hide'
				}))
			},
		}
	}

	render() {
		return (
			<header className="app__header">
				<div className="header__container">
					<div className="app__logo tracked-wide" data-for='getContent-0000' data-tip>
						<span>GUNSMITH</span>
						<div className="menu-icon__wrapper">
							<i 
								className={`menu-icon ${this.state.menuView}`} 
								onClick={() => this.state.toggleMenu()}>	
							</i>
						</div>
					</div>
					{/* <Tooltip 
						hash='0000'
						title='title'
						subtitle='subtitle'
						description='description'
					/> */}
					<Search 
						menuView={ this.state.menuView }
						toggleMenu={ () => this.state.toggleMenu() } />
				</div>
			</header>
		)
	}
}

const mapStateToProps = state => ({
	manifest: state.manifest
});

export default connect(mapStateToProps, { })(Header);