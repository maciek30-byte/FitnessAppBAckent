import express from 'express';
import cors from 'cors';
import connectDB from './db';
import microcycleRoutes from './routes/microcycleRoutes';
import userRoutes from './routes/userRoutes';
import authRoutes  from "./routes/authRoutes";

const app = express();

// Połączenie z bazą danych
connectDB();

// Konfiguracja CORS
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (origin.startsWith('http://localhost:') || origin.startsWith('https://localhost:')) {
      return callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
};

app.use(cors(corsOptions));

// Middleware do parsowania JSON
app.use(express.json());

// Dodaj middleware do logowania wszystkich żądań
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Trasy
app.use('/api/auth', authRoutes);
app.use('/api/microcycles', microcycleRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

export default app;