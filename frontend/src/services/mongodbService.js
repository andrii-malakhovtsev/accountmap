// MongoDB API service
// This file contains all API calls related to MongoDB products

export const mongodbService = {
	// Fetch all products from MongoDB
	async getProducts(apiUrl) {
		const response = await fetch(`${apiUrl}/api/mongodb/products`);
		const data = await response.json();
		if (!data.success) {
			throw new Error(data.error || 'Failed to fetch products');
		}
		return data.data;
	},

	// Add a new product to MongoDB
	async addProduct(apiUrl, productData) {
		const response = await fetch(`${apiUrl}/api/mongodb/products`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(productData),
		});
		const data = await response.json();
		if (!data.success) {
			throw new Error(data.error || 'Failed to add product');
		}
		return data.data;
	},
};
