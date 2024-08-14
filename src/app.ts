import express from 'express';
import connectDB from './db';
import appRouter from './routes/routes';

const app = express();

connectDB();

app.use(express.json());

app.use('/api/auth', appRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

export default app;
