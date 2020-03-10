import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchManifest } from './../actions/manifestActions';
import { storeManifestStatus } from './../actions/manifestStatusActions';
import { Route } from "react-router-dom";
import Header from './Header';
import Weapon from './Weapon';

class Base extends Component {
	componentDidMount() {
		this.props.fetchManifest();
	}

	componentDidUpdate(prevProps) {
		const { manifest } = this.props;
		if ( Object.keys((manifest)).length !== 0 && manifest !== prevProps.manifest) {
			this.props.storeManifestStatus();
		}
	}

	render() {
		const { manifestLoaded } = this.props;
		return (
			!manifestLoaded 
				? <Loading />
				: <>
						<Header />
						<main className="main-content" style={{backgroundImage: `url(${process.env.PUBLIC_URL + '/empty-background.jpg'}`}}>
							<section className="weapon__container">
								<Route exact path='/' component={ Home } />
								<Route exact path='/w' component={ Home } />
								<Route path='/w/:builtId' component={ Weapon } />
							</section>
						</main>
					</>
		)
	}
}

Base.propTypes = {
	fetchManifest: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	manifest: state.manifest,
	manifestLoaded: state.manifestLoaded
});

export default connect(mapStateToProps, { fetchManifest, storeManifestStatus })(Base);


class Loading extends React.Component {
	static propTypes = {
		text: PropTypes.string.isRequired
	}

	static defaultProps = {
		text: 'Downloading Manifest'
	}

	state = {
		text: this.props.text
	}

	componentDidMount() {
		// const stopper = this.props.text + '...';
		// this.interval = setInterval(() => {
		// 	this.state.text === stopper
		// 		? this.setState(() => ({ text: this.props.text }))
		// 		: this.setState(({ text }) => ({ text: text + '.' }))
		// });
	}

	componentWillUnmount() {
		window.clearInterval(this.interval)
	}

	render() {
		return (
			<div className="loading">
				{ this.state.text }
			</div>
		)
	}
}


class Home extends React.Component {
	render(){
		return (
			<div className="weapon__wrapper empty">
				<span className="tracked-wide underline uppercase">What is this & how do I use it?</span>
				<p>A weapon roll builder for Destiny 2 that calculates perk benefits on the fly.</p>
				<p>Pick a weapon, pick the perks, see how they affect the stats. Gold perks are from the curated rolls.</p>
				<br/>
				<span className="tracked-wide underline uppercase">Latest Notes</span>
				<ul>
					<li>You can now export a DIM wishlist item.</li>
					<li>Curated-exclusive perks should now be displaying.</li>
					<li>Live screenshot exports of your rolls in the works.</li>
					<li>New Collections: "Seventh Seraph", "World: Worthy", and "Trials of Osiris".</li>
				</ul>
				<br/>
				<span className="tracked-wide underline uppercase">More questions?</span>
				<p>Ask me on <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/aundre_kerr">Twitter</a>.</p>
			</div>
		)
	}
}