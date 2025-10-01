import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { transactionIdMiddleware } from './middleware/transactionIdMiddleware.js';
import { loggerConsole } from './middleware/loggerConsole.js';
import { errorHandler } from './middleware/errorHandler.js';
import { setupSwagger } from './config/swagger.js';
import healthCheckRoute from './routes/healthCheckRoute.js';
import { env } from 'process';
import ticketRoutes from './routes/ticketRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(transactionIdMiddleware);
app.use(loggerConsole);

const apiVersion = env.API_VERSION || 'v1';
app.use(`/api/${apiVersion}`, healthCheckRoute);
app.use(`/api/${apiVersion}/tickets`, ticketRoutes);

setupSwagger(app);

app.use(errorHandler);

export default app;