import React from 'react';
import 'react-dom';
import './App.css';
import { AppTheme } from './view/AppTheme';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import { SortingDemoView } from './view/sorting/Demo';
import { loadTheme, Pivot, PivotItem } from '@fluentui/react';
import { AppModel } from "./model/AppModel";

export const App = () => {

	initializeIcons();
	loadTheme(AppTheme);

	const model = new AppModel();

	return (
		<div className="App">
			<SortingDemoView model={model.sorting} />
		</div>
	);
}
