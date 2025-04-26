const corsOptions = {
  origin: [
    'https://react-domain.com',
    'https://localhost:5173.com',
  ], // List of trusted domains.
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods.
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'Access-Control-Allow-Credentials',
    'X-Requested-With',
    'Referrer-Policy',
    'X-Frame-Options',
    'X-Debug-Info',
  ], // Allowed request headers.
  credentials: true, // Enable credentials for cookies and authentication.
};

module.exports = corsOptions;
