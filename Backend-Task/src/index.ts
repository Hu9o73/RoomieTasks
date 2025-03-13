import express, { Express } from "express";
import https from 'https';
import fs from 'fs';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Import endpoints
import basicEndpoints from "./api/utilityEndpoints";
import householdEndpoints from "./api/householdEndpoints";
import taskEndpoints from "./api/taskEndpoints";

// Import database
import sequelize from "./ConfigFiles/dbConfig";
import { testDatabaseConnection } from "./ConfigFiles/dbUtils";
// Import all models to ensure they're initialized
import "./ConfigFiles/dbAssociations";

const cors = require('cors');

const app: Express = express();
const port = process.env.PORT || 3001;

// Body parser
app.use(express.json());

// CORS for specific origins
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:3000', 'https://roomietasks.hugobnl.fr', 'https://www.roomietasks.hugobnl.fr', 'http://frontend:4200'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Use the endpoints defined
app.use(basicEndpoints);
app.use(householdEndpoints);
app.use(taskEndpoints);

// Database test connection
testDatabaseConnection(sequelize);

// Sync database models with the database
sequelize.sync({ force: false, alter: false }).then(() => {
  console.log('Task database synchronized successfully');
}).catch(err => {
  console.error('Failed to synchronize task database:', err);
});

// Server running
app.listen(port, () => {
  console.log(`[task-service]: Server is running at http://localhost:${port}`);
});