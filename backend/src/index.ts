// Bring in required modules and libraries
import express, { json } from 'express';
import cors from 'cors';
import { prisma } from "./lib/prisma"

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware

// Middleware functions are functions that have access to the request object (req),
// the response object (res), and the next middleware function in the application’s request-response cycle.
// Here, we are using CORS to allow cross-origin requests and express.json() to parse JSON request bodies.
// In simple terms its a kind of "gatekeeper" that processes incoming requests before they reach our route handlers.
app.use(cors());
app.use(json());

// Routes

// Basic route to check if the server is running and to provide API documentation
app.get('/', (_, res) => {
	res.json({
		message: 'Welcome to the Full-Stack Demo API',
	});
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown - this is important for closing database connections when the server is stopped
// We always want to ensure that we close our database connections when the server is shutting down
// so we don't have any "orphaned" connections left open, that could be dangerous to a apps security and performance.
process.on('SIGTERM', async () => {
	console.log('SIGTERM received, closing connections...');
	await prisma.$disconnect()
	process.exit(0);
});
