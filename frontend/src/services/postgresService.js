// PostgreSQL API service
// This file contains all API calls related to PostgreSQL users

export const postgresService = {
	// Fetch all users from PostgreSQL
	async getUsers(apiUrl) {
		const response = await fetch(`${apiUrl}/api/postgres/users`);
		const data = await response.json();
		if (!data.success) {
			throw new Error(data.error || 'Failed to fetch users');
		}
		return data.data;
	},

	// Add a new user to PostgreSQL
	async addUser(apiUrl, userData) {
		const response = await fetch(`${apiUrl}/api/postgres/users`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(userData),
		});
		const data = await response.json();
		if (!data.success) {
			throw new Error(data.error || 'Failed to add user');
		}
		return data.data;
	},
};
