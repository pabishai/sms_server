import dotenv from 'dotenv'
import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.routes';
import userRoutes  from './routes/user.routes';
import contactRoutes from './routes/contact.routes';
import smsRoutes from './routes/sms.routes'
import authMiddleware from './middleware/auth.middleware';

// initialize dot env
dotenv.config();

// default api path
const apiPath = '/api/v1'

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(`${apiPath}/auth`, authRoutes)
app.use(`${apiPath}/user`, authMiddleware, userRoutes);
app.use(`${apiPath}/contacts`, authMiddleware, contactRoutes)
app.use(`${apiPath}/sms`, authMiddleware, smsRoutes)

export default app;