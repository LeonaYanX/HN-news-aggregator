const express = require('express');
const connectDb = require('./config/db');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const corsOptions = require('./config/cors');
const {schedule} = require('./schedulers/unblockScheduler');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const commentsRoutes = require('./routes/commentsRoutes');
const userRoutes = require('./routes/userRoutes');
dotenv.config();

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

//Starting unblock scheduller

schedule();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
