require('express-async-errors');
const dotenv = require('dotenv');
dotenv.config();
const errorHandler = require('./middleware/errorHandler');
const express = require('express');
const connectDb = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const corsOptions = require('./config/cors');
const {schedule} = require('./schedulers/unblockScheduler');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const commentsRoutes = require('./routes/commentsRoutes');
const userRoutes = require('./routes/userRoutes');




const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions))

connectDb().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);                                    // exit the process if connection is failed
});;

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/submission', submissionRoutes);
app.use('/api/comment', commentsRoutes);
app.use('/api/user', userRoutes);

// after routes
app.use(errorHandler);

//Starting unblock scheduller

schedule();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
