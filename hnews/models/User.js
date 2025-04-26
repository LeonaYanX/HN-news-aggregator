const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    lowercase: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ['guest','admin'], 
    required: true,
    default: 'guest'
},
  karma: {
    type: Number,
    default: 1,
  },
  isBlocked: { 
    type: Boolean, 
    default: false 
  },
  blockedUntil: {
     type: Date, 
     default: null 
    },
  about: {
    type: String,
    maxlength: 1000,
  },
  usernameLC: {
    type: String,
    index: true, // for faster search
    lowercase: true, 
    trim: true,
  },  
  submissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission',
  }],
   comments: [{
   type: mongoose.Schema.Types.ObjectId,
   ref: 'Comment',
  }],
  favoriteSubmissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission',
  }],
  favoriteComments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }]
});

/*const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  usernameLC: { type: String, lowercase: true }, // для поиска по ловеркейсу
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  karma: { type: Number, default: 0 },
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

module.exports = mongoose.model('User', userSchema);
 */

//hash password method
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

//compare password in login
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.pre('save', function (next) {
  if (this.isModified('username')) {
    this.usernameLC = this.username.toLowerCase().trim();
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
