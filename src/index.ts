import 'module-alias/register';
import path from 'path';
import dotenv from 'dotenv';

import cors from 'cors';
import morgan from 'morgan';
import express from 'express';

import routes from '~/routes';
import { connectToDB } from '~/utils';
import { handleError } from '~/middlewares';

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: string;
        [key: string]: any;
      };
    }
  }
}

const app = express();

app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(morgan('dev'));

app.use(routes);

app.use(handleError);

async function main() {
  await connectToDB();
  const PORT = typeof process.env.PORT === 'number' ? process.env.PORT : 5000;

  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

main().catch(console.log);
