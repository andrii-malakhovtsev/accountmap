// Bring in required modules and libraries
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware

// Middleware functions are functions that have access to the request object (req),
// the response object (res), and the next middleware function in the application’s request-response cycle.
// Here, we are using CORS to allow cross-origin requests and express.json() to parse JSON request bodies.
// In simple terms its a kind of "gatekeeper" that processes incoming requests before they reach our route handlers.
app.use(cors());
app.use(express.json());

// PostgreSQL Connection

// 'process.env.VARIABLE_NAME' allows us to use environment variables for sensitive information
// like database credentials. If the environment variable is not set, we fall back to default values
// suitable for local development.
// But for the purposes of this demo and starting point, it is ok :) - LK
const pgPool = new Pool({
	host: process.env.POSTGRES_HOST || 'localhost',
	port: process.env.POSTGRES_PORT || 5432,
	user: process.env.POSTGRES_USER || 'demouser',
	password: process.env.POSTGRES_PASSWORD || 'demopass',
	database: process.env.POSTGRES_DB || 'demodb',
});

// MongoDB Connection - hard coded for demonstration purposes
const mongoUri = process.env.MONGODB_URI || 'mongodb://demouser:demopass@localhost:27017/demodb?authSource=admin';
let mongoClient;
let mongoDB;

// Initialize databases
// This is called the DDL (Data Declaration Language) where we initially create the database
// schema that will be used across the project. MongoDB is schema-less, so we only need to
// create the PostgreSQL table here, but you'll notice we also insert some sample data for mongoDB.

// MongoDB collections are created with less strictness, so we just ensure the sample data is present.
// PostgreSQL requires explicit table creation.
async function initializeDatabases() {
try {
		// Initialize PostgreSQL table
		await pgPool.query(`
			CREATE TABLE IF NOT EXISTS users (
				id SERIAL PRIMARY KEY,
				name VARCHAR(100) NOT NULL,
				email VARCHAR(100) UNIQUE NOT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			)
		`);
    
		// Insert sample data if table is empty
		const result = await pgPool.query('SELECT COUNT(*) FROM users');
		if (parseInt(result.rows[0].count) === 0) {
			await pgPool.query(`
				INSERT INTO users (name, email) VALUES
				('Alice Johnson', 'alice@example.com'),
				('Bob Smith', 'bob@example.com'),
				('Charlie Brown', 'charlie@example.com')
			`);
			console.log('PostgreSQL sample data inserted');
		}

		// Initialize MongoDB
		mongoClient = new MongoClient(mongoUri);
		await mongoClient.connect();
		mongoDB = mongoClient.db();
    
		// Create sample collection and insert data if empty
		const productsCollection = mongoDB.collection('products');
		const count = await productsCollection.countDocuments();
		if (count === 0) {
			await productsCollection.insertMany([
				{ name: 'Laptop', category: 'Electronics', price: 999.99, stock: 15 },
				{ name: 'Mouse', category: 'Electronics', price: 29.99, stock: 50 },
				{ name: 'Keyboard', category: 'Electronics', price: 79.99, stock: 30 },
				{ name: 'Monitor', category: 'Electronics', price: 299.99, stock: 20 }
			]);
			console.log('MongoDB sample data inserted');
		}

		console.log('Databases initialized successfully');
	} catch (error) {
		console.error('Database initialization error:', error);
	}
}

// Routes

// Basic route to check if the server is running and to provide API documentation
app.get('/', (_, res) => {
	res.json({
		message: 'Welcome to the Full-Stack Demo API',
		endpoints: {
            // Documentation of available endpoints for both databases
			postgres: {
				'GET /api/postgres/users': 'Get all users from PostgreSQL',
				'POST /api/postgres/users': 'Create a new user in PostgreSQL',
				'GET /api/postgres/health': 'Check PostgreSQL connection'
			},
			mongodb: {
				'GET /api/mongodb/products': 'Get all products from MongoDB',
				'POST /api/mongodb/products': 'Create a new product in MongoDB',
				'GET /api/mongodb/health': 'Check MongoDB connection'
			}
		}
	});
});

// PostgreSQL Routes - These routes handle user data in PostgreSQL through HTTP requests
app.get('/api/postgres/users', async (req, res) => {
	try {
		const result = await pgPool.query('SELECT * FROM users ORDER BY id');
		res.json({ success: true, data: result.rows });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Route to add a new user to PostgreSQL
app.post('/api/postgres/users', async (req, res) => {
	const { name, email } = req.body;
	try {
		const result = await pgPool.query(
			'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
			[name, email]
		);
		res.json({ success: true, data: result.rows[0] });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Health check route for PostgreSQL
app.get('/api/postgres/health', async (req, res) => {
	try {
		await pgPool.query('SELECT 1');
		res.json({ success: true, status: 'PostgreSQL is connected' });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// MongoDB Routes - These routes handle product data in MongoDB through HTTP requests
app.get('/api/mongodb/products', async (req, res) => {
	try {
		const products = await mongoDB.collection('products').find({}).toArray();
		res.json({ success: true, data: products });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

app.post('/api/mongodb/products', async (req, res) => {
	const { name, category, price, stock } = req.body;
	try {
		const result = await mongoDB.collection('products').insertOne({
			name,
			category,
			price: parseFloat(price),
			stock: parseInt(stock),
			createdAt: new Date()
		});
		res.json({ 
			success: true, 
			data: { _id: result.insertedId, name, category, price, stock }
		});
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

app.get('/api/mongodb/health', async (req, res) => {
	try {
		await mongoDB.admin().ping();
		res.json({ success: true, status: 'MongoDB is connected' });
	} catch (error) {
		res.status(500).json({ success: false, error: error.message });
	}
});

// Start server

// After definiting all routes and middleware, we initialize the databases
initializeDatabases().then(() => {
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
});

// Graceful shutdown - this is important for closing database connections when the server is stopped
// We always want to ensure that we close our database connections when the server is shutting down
// so we don't have any "orphaned" connections left open, that could be dangerous to a apps security and performance.
process.on('SIGTERM', async () => {
	console.log('SIGTERM received, closing connections...');
	await pgPool.end();
	await mongoClient.close();
	process.exit(0);
});
