import bodyParser from 'body-parser';
import express from "express";
import routes from './routes';
// import logger.

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

export default app;