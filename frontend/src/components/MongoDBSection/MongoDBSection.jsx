import React, { useState, useEffect } from 'react';
import { mongodbService } from '../../services/mongodbService';
import './MongoDBSection.css';

// MongoDBSection component handles the display and interaction with MongoDB products data.
// It allows users to view existing products and add new products through a form.
// The component fetches data from the backend API using the mongodbService and manages loading and error states.
// It is styled using the MongoDBSection.css file for component-specific styles.

function MongoDBSection({ apiUrl }) {

	// React Hooks are special functions that let you use React features (like state and lifecycle methods) 
	// in function components. They always start with "use" (useState, useEffect, etc.) and allow you to 
	// add functionality to your components without writing a class.
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [formData, setFormData] = useState({
		name: '',
		category: '',
		price: '',
		stock: '',
	});

	// "useEffect" is a Hook that lets you perform side effects in function components.
	// Here, we are not assigning the result of useEffect to any variable because its purpose is to run
	// the fetchUsers function when the component mounts (or only once) (i.e., is added to the DOM) for the first time.
	// If we passed a value into the array, it would re-run the effect whenever that value changes.
	useEffect(() => {
		fetchProducts();
	}, []);

	// This function fetches the list of products from the backend API using a "GET" request.
	// It now uses the mongodbService to handle the API call.
	const fetchProducts = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await mongodbService.getProducts(apiUrl);
			setProducts(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	// This function handles the form submission to add a new product to the MongoDB database.
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		try {
			await mongodbService.addProduct(apiUrl, formData);
			setFormData({ name: '', category: '', price: '', stock: '' });
			fetchProducts();
		} catch (err) {
			setError(err.message);
		}
	};

	// The component's JSX structure defines the UI layout and elements.
	// We define our HTML that we want to render to the screen here instead of a separate template file.
	// This is made possible by JSX (or TSX for TypeScript), which allows us to write HTML-like syntax directly in our JavaScript code.
	// Defined with two way binding to our state variables and event handlers for interactivity.
	return (
		<div className="database-section mongodb">
			<div className="section-header">
				<h2>MongoDB - Products</h2>
				<p>NoSQL document database demonstration</p>
			</div>

			<div className="section-content">
				<form onSubmit={handleSubmit} className="data-form">
					<input
						type="text"
						placeholder="Product Name"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						required
					/>
					<input
						type="text"
						placeholder="Category"
						value={formData.category}
						onChange={(e) => setFormData({ ...formData, category: e.target.value })}
						required
					/>
					<input
						type="number"
						step="0.01"
						placeholder="Price"
						value={formData.price}
						onChange={(e) => setFormData({ ...formData, price: e.target.value })}
						required
					/>
					<input
						type="number"
						placeholder="Stock"
						value={formData.stock}
						onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
						required
					/>
					<button type="submit" className="btn-submit">Add Product</button>
				</form>

				{error && <div className="error-message">{error}</div>}

				<div className="data-list">
					<div className="list-header">
						<button onClick={fetchProducts} className="btn-refresh" disabled={loading}>
							{loading ? 'Loading...' : 'Refresh'}
						</button>
						<span className="count">{products.length} products</span>
					</div>

					<div className="items-container">
						{products.map((product) => (
							<div key={product._id} className="data-item">
								<div className="item-header">
									<span className="item-name">{product.name}</span>
									<span className="item-price">${product.price}</span>
								</div>
								<div className="item-details">
									<span className="item-category">{product.category}</span>
									<span className="item-stock">
										Stock: {product.stock}
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

export default MongoDBSection;
