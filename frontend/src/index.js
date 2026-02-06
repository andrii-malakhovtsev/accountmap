import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// This is the entry point for the React frontend application. Here we render the main App component
// into the root div in the public/index.html file. The App component is the root of our component
// tree and contains all other components that make up the user interface of the application.

// You'll see here we get the root elemeent by its ID ('root') and them we use ReactDOM to create a root and render
// our App component within it. This is standard practice for bootstrapping a React application.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
