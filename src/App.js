import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from "react-router-dom";
import store from './utils/store';
import Base from './components/Base';

import './styles/app.scss';

class App extends Component {

	render() {
		return (
			<Router>
				<Provider store={ store }>
					<Base />
				</Provider>
			</Router>
		);
	}
}

export default App;
