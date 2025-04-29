const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ['guest','admin'], 
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
