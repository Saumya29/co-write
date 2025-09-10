import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import {initialize} from './modules/collaboration/index.js';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.get('/health', (_, res) => {
  res.json({status: 'ok'});
});

app.use('/api', routes);

await initialize();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
