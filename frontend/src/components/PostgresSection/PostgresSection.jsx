import React, { useState, useEffect } from 'react';
import { postgresService } from '../../services/postgresService';
import './PostgresSection.css';

// PostgresSection component handles the display and interaction with PostgreSQL users data.
// It allows users to view existing users and add new users through a form.
// The component fetches data from the backend API using the postgresService and manages loading and error states.
// It is styled using the PostgresSection.css file for component-specific styles.

function PostgresSection({ apiUrl }) {

	// React Hooks are special functions that let you use React features (like state and lifecycle methods) 
	// in function components. They always start with "use" (useState, useEffect, etc.) and allow you to 
	// add functionality to your components without writing a class.
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [formData, setFormData] = useState({ name: '', email: '' });

	// "useEffect" is a Hook that lets you perform side effects in function components.
	// Here, we are not assigning the result of useEffect to any variable because its purpose is to run
	// the fetchUsers function when the component mounts (or only once) (i.e., is added to the DOM) for the first time.
	// If we passed a value into the array, it would re-run the effect whenever that value changes.
	useEffect(() => {
		fetchUsers();
	}, []);

	// This function fetches the list of users from the backend API using a "GET" request.
	// It now uses the postgresService to handle the API call.
	const fetchUsers = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await postgresService.getUsers(apiUrl);
			setUsers(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	// This function handles the form submission to add a new user to the PostgreSQL database.
	// It sends a "POST" request to the backend API with the form data (name and email).
	// It now uses the postgresService to handle the API call.
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		try {
			await postgresService.addUser(apiUrl, formData);
			setFormData({ name: '', email: '' });
			fetchUsers();
		} catch (err) {
			setError(err.message);
		}
	};

	// The component's JSX structure defines the UI layout and elements.
	// We define our HTML that we want to render to the screen here instead of a separate template file.
	// This is made possible by JSX (or TSX for TypeScript), which allows us to write HTML-like syntax directly in our JavaScript code.
	// Defined with two way binding to our state variables and event handlers for interactivity.
	return (
		<div className="database-section postgres">
			<div className="section-header">
				<h2>PostgreSQL - Users</h2>
				<p>Relational database demonstration</p>
			</div>

			<div className="section-content">
				<form onSubmit={handleSubmit} className="data-form">
					<input
						type="text"
						placeholder="Name"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						required
					/>
					<input
						type="email"
						placeholder="Email"
						value={formData.email}
						onChange={(e) => setFormData({ ...formData, email: e.target.value })}
						required
					/>
					<button type="submit" className="btn-submit">Add User</button>
				</form>

				{error && <div className="error-message">{error}</div>}

				<div className="data-list">
					<div className="list-header">
						<button onClick={fetchUsers} className="btn-refresh" disabled={loading}>
							{loading ? 'Loading...' : 'Refresh'}
						</button>
						<span className="count">{users.length} users</span>
					</div>

					<div className="items-container">
						{users.map((user) => (
							<div key={user.id} className="data-item">
								<div className="item-header">
									<span className="item-id">#{user.id}</span>
									<span className="item-name">{user.name}</span>
								</div>
								<div className="item-details">
									<span className="item-email">{user.email}</span>
									<span className="item-date">
										{new Date(user.created_at).toLocaleDateString()}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default PostgresSection;
