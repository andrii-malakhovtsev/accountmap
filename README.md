# Full-Stack Web Demo

A comprehensive full-stack application demonstration featuring React, Express.js, PostgreSQL, and MongoDB, all orchestrated with Docker Compose. Perfect for technical presentations and as a learning resource for students.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
│                  Port: 8080                                 │
│        - User Interface with JSX components                 │
│        - Demonstrates API consumption                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP Requests
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Backend API (Express.js)                       │
│                  Port: 8081                                 │
│        - RESTful endpoints                                  |
│        - Database connection management                     │
└────────┬───────────────────────────────────────┬────────────┘
         │                                       │
         │                                       │
         ▼                                       ▼
┌──────────────────────┐            ┌──────────────────────┐
│   PostgreSQL DB      │            │     MongoDB          │
│   Port: 5432         │            │   Port: 27017        │
│   - Users table      │            │   - Products coll.   │
│   - Relational data  │            │   - Document store   │
└──────────────────────┘            └──────────────────────┘
```

## Features

### Frontend (React)
- Modern React application with functional components and hooks
- Separate sections for PostgreSQL and MongoDB demonstrations
- Real-time data fetching and form submissions
- Responsive design with gradient styling
- Error handling and loading states

### Backend (Express.js)
- RESTful API endpoints for both databases
- Health check endpoints
- CORS enabled for local development
- Automatic database initialization with sample data
- Graceful shutdown handling

### Databases
- **PostgreSQL**: Demonstrates relational data with a users table
- **MongoDB**: Demonstrates document storage with a products collection

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development without Docker)
- Git (for cloning/forking)

## Quick Start

### Using Docker Compose (Recommended)

1. **Clone or fork this repository**
   ```bash
   git clone <repository-url>
   cd full-stack-web-demo
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:8081
   - PostgreSQL: localhost:5432
   - MongoDB: localhost:27017

4. **Stop all services**
   ```bash
   docker-compose down
   ```

5. **Clean up volumes (reset databases)**
   ```bash
   docker-compose down -v
   ```

### Local Development (Without Docker)

#### Backend Setup
```bash
cd backend
npm install
npm start
```

Required environment variables (or use defaults):
```bash
PORT=8081
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=demouser
POSTGRES_PASSWORD=demopass
POSTGRES_DB=demodb
MONGODB_URI=mongodb://demouser:demopass@localhost:27017/demodb?authSource=admin
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

Environment variable:
```bash
REACT_APP_API_URL=http://localhost:8081
```

## API Endpoints

### General
- `GET /` - API information and available endpoints

### PostgreSQL Endpoints
- `GET /api/postgres/users` - Get all users
- `POST /api/postgres/users` - Create a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```
- `GET /api/postgres/health` - Check PostgreSQL connection

### MongoDB Endpoints
- `GET /api/mongodb/products` - Get all products
- `POST /api/mongodb/products` - Create a new product
  ```json
  {
    "name": "Laptop",
    "category": "Electronics",
    "price": 999.99,
    "stock": 15
  }
  ```
- `GET /api/mongodb/health` - Check MongoDB connection

## Project Structure

```
full-stack-web-demo/
├── docker-compose.yml          # Docker orchestration
├── README.md                   # This file
├── .gitignore                  # Git ignore rules
├── backend/
│   ├── Dockerfile              # Backend container config
│   ├── package.json            # Node dependencies
│   └── server.js               # Express server with API routes
└── frontend/
    ├── Dockerfile              # Frontend container config
    ├── package.json            # React dependencies
    ├── public/
    │   └── index.html          # HTML template
    └── src/
        ├── index.js            # React entry point
        ├── index.css           # Global styles
        ├── App.jsx             # Main App component
        ├── App.css             # App styles
        └── components/
            ├── PostgresSection.jsx    # PostgreSQL UI
            ├── MongoDBSection.jsx     # MongoDB UI
            └── DatabaseSection.css    # Shared component styles
```

## Learning Points

### For Students
This project demonstrates:

1. **Frontend Development**
   - React hooks (useState, useEffect)
   - API integration with fetch
   - Component composition
   - Form handling
   - Conditional rendering

2. **Backend Development**
   - RESTful API design
   - Express.js middleware
   - Database connections (SQL and NoSQL)
   - Error handling
   - Async/await patterns

3. **Databases**
   - PostgreSQL (relational database)
   - MongoDB (document database)
   - CRUD operations
   - Data modeling differences

4. **DevOps**
   - Docker containerization
   - Docker Compose orchestration
   - Multi-service applications
   - Volume management
   - Health checks

## Customization

### Adding New Endpoints
Edit `backend/server.js` to add new routes:
```javascript
app.get('/api/your-endpoint', async (req, res) => {
  // Your logic here
});
```

### Adding New Components
Create new JSX files in `frontend/src/components/` and import them in `App.jsx`.

### Modifying Database Schema
PostgreSQL tables are initialized in the `initializeDatabases()` function in `server.js`.

## Troubleshooting

### Port Already in Use
If ports 8080, 8081, 5432, or 27017 are already in use, modify the port mappings in `docker-compose.yml`:
```yaml
ports:
  - "NEW_PORT:CONTAINER_PORT"
```

### Database Connection Errors
Ensure the databases are fully started before the backend connects. The health checks in docker-compose.yml handle this, but if running locally, wait for database startup.

### Frontend Can't Reach Backend
Check that REACT_APP_API_URL is set correctly and the backend is running on the specified port.

## License

This project is open source and available for educational purposes.

## Contributing

Feel free to fork this repository and submit pull requests with improvements!

## Questions?

This demo is maintained by the CEG-CS Alumni Society for educational purposes.
