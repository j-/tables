import * as React from 'react';
import Ribbon from './Ribbon';
import Converter from './Converter';
import './App.css';

const App = () => (
	<div className="App">
		<Ribbon />
		<h1>Tables</h1>
		<Converter />
	</div>
);

export default App;
