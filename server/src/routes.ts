import { Request, Response } from 'express';
import { app } from './app';

app.get('/', (req: Request, res: Response) => {
  res.send(
    'You have been added to the watch registry. Actions will follow towards your guild points, dont proceed.'
  );
});
