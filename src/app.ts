import express from 'express';
import connectDB from './db';
import authRouter from './routes/auth';

const app = express();

// Połączenie z bazą danych
connectDB();

// Middleware do parsowania JSON
app.use(express.json());

// Trasy autoryzacji
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

export default app;
