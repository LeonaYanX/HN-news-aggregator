// swagger.js
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'HackerNews Clone API',
    description: 'Автоматически сгенерированная документация',
    version: '1.0.0',
  },
  host: 'localhost:5000',
  schemes: ['http'],
  definitions: {
    User: {
      id: 'string',
      username: 'string',
      email: 'string',
      password: 'string',
      createdAt: 'string',
    },
    Submission: {
      id: 'string',
      title: 'string',
      url: 'string',
      text: 'string',
      type: 'string',
      createdAt: 'string',
    },
    Comment: {
      id: 'string',
      submissionId: 'string',
      text: 'string',
      createdAt: 'string',
    },
    Error: {
      status: 'number',
      message: 'string',
    }, 
    Success: {
      message: 'string',
    },
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = [
  './routes/authRoutes.js ',
  './routes/submissionRoutes.js',
  './routes/commentsRoutes.js',
  './routes/adminRoutes.js',
  './routes/userRoutes.js',
  './routes/searchRoutes.js',
];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger spec generated to', outputFile);
  //automatically require and run your app.js file
   //require('./app.js');
});
