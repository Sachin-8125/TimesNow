import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        match: [EMAIL_REGEX, 'Please provide a valid email address']
    },
    passwordHash: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        enum: ['admin', 'editor', 'viewer'],
        default: 'viewer'
    },
    lastLoginAt: {
        type: Date
    }
}, {
    timestamps: true,
    versionKey: false,
    toJSON: {
        transform(doc, ret) {
            delete ret.passwordHash;
            return ret;
        }
    }
});

userSchema.methods.comparePassword = function comparePassword(password) {
    return bcrypt.compare(password, this.passwordHash);
};

userSchema.statics.hashPassword = function hashPassword(password) {
    return bcrypt.hash(password, 12);
};

export const User = mongoose.model('User', userSchema);