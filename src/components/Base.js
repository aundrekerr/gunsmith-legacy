import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchManifest } from './../actions/manifestActions';
import { storeManifestStatus } from './../actions/manifestStatusActions';

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
				? null
				: <React.Fragment>
					<Header />
					<main className="main-content" style={{backgroundImage: `url(${process.env.PUBLIC_URL + '/empty-background.jpg'}`}}>
						<section className="weapon__container">
							<Weapon />
						</section>
					</main>
				</React.Fragment>
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