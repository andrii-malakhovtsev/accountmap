import React, { useState, useEffect } from 'react';
import './App.css';
import PostgresSection from './components/PostgresSection/PostgresSection.jsx';
import MongoDBSection from './components/MongoDBSection/MongoDBSection.jsx';

// Main Application component. THis is the root of the React frontend and we render the various
// components that we want to see right away. Our two main components are the PostgresSection
// and the MongoDBSection, each responsible for interacting with their respective databases.

// Together, they make up the "Home" page if you will of this demo application.

function App() {
	const [apiStatus, setApiStatus] = useState('Checking...');
    
    // In a real-world application, the API URL would likely be stored in an environment variable
    // or configuration file. Here, we default to localhost:8081 if no environment variable is set.
	const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8081';

    // We want to check the status of the backend API when the component mounts,
    // so we use the useEffect hook to call the checkApiStatus function once.
	useEffect(() => {
		checkApiStatus();
	}, []);

    // This function checks the status of the backend API by making a simple fetch request to the root endpoint.
	const checkApiStatus = async () => {
		try {
			const response = await fetch(`${API_URL}/`);
			if (response.ok) {
				setApiStatus('Connected');
			} else {
				setApiStatus('API Error');
			}
		} catch (error) {
			setApiStatus('Disconnected');
		}
	};

    // The component's JSX structure defines the overall layout of the application.
    // We include a header, main content area with our two database sections, and a footer.
    // We call the PostgresSection and MongoDBSection components here to render them within the App.
    // We send them the API_URL as a prop so they know where to make their requests.
	return (
		<div className="App">
			<header className="App-header">
				<h1>Hackathon Full-Stack Demo Application</h1>
				<p className="subtitle">React + Express + PostgreSQL + MongoDB</p>
				<div className="status-badge">
					API Status: {apiStatus}
				</div>
			</header>

			<main className="App-main">
				<div className="sections-container">
					<PostgresSection apiUrl={API_URL} />
					<MongoDBSection apiUrl={API_URL} />
				</div>
			</main>

			<footer className="App-footer">
				<p>Built for technical demonstration and learning purposes</p>
			</footer>
		</div>
	);
}

export default App;
