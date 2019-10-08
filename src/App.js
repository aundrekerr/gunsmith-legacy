import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './utils/store';

import Base from './components/Base';

import './styles/app.scss';

class App extends Component {

	render() {
		return (
			<Provider store={ store }>
				<Base />
			</Provider>
		);
	}
}

export default App;
