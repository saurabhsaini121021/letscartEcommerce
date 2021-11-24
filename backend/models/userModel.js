const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        maxlength: [30, 'Name must be less than 30 characters'],
        minlength: [4, 'Name must be at least 4 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false,  // don't return password in query results
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    // Hash the password before saving the user model
    this.password = await bcrypt.hash(this.password, 10);

});

//JWT token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

// Match user entered password to hashed password in database
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}


//Generating reset password token
userSchema.methods.getResetPasswordToken = function () {
    //Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');      //20 bytes of random hexadecimal characters
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');       //Hash the token
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;        //15 minutes

    return resetToken;
};

module.exports = mongoose.model('User', userSchema);