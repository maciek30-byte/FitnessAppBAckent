export const corsOptions = {
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