import React from 'react';
import 'react-dom';
import './App.css';
import { AppTheme } from './view/AppTheme';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { SortingDemoView } from './view/sorting/Demo';
import { loadTheme } from '@fluentui/react';

export const App = () => {

	initializeIcons();
	loadTheme(AppTheme);

	return (
		<div className="App">
			<SortingDemoView />
		</div>
	);
}
