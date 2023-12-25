import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './libs/store';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage/Homepage';
import Split from './pages/Split/Split';
import Receipt from './pages/Receipt/Receipt';
import { SplitChoices } from './types/enums';
import Persons from './pages/Persons/Persons';
import SplitWithPerson from './pages/SplitWithPerson/SplitWithPerson';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter basename={process.env.PUBLIC_URL}>
				<Routes>
					<Route path='' Component={Homepage} />
					<Route path={`/${SplitChoices.Split}`} Component={Split} />
					<Route path='/receipt' Component={Receipt} />
					<Route path={`/${SplitChoices.Persons}`} Component={Persons} />
					<Route path={`/${SplitChoices.SplitWithPersons}`} Component={SplitWithPerson} />
				</Routes>
			</BrowserRouter>
		</Provider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
