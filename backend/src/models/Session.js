import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        tokenId: {
            type: String,
            required: true,
            unique: true,
        },
        refreshTokenHash: {
            type: String,
            required: true,
            select: false,
        },
        userAgent: {
            type: String,
            default: 'unknown',
        },
        ipAddress: {
            type: String,
            default: 'unknown',
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        revokedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: {
            transform(doc, ret) {
                delete ret.refreshTokenHash;
                return ret;
            },
        },
    }
);

sessionSchema.index({ expiresAt: 1 }, { expiresAfterSeconds: 0 });

sessionSchema.index({ user: 1, revokedAt: 1 });

sessionSchema.methods.isValid = function () {
    return !this.revokedAt && this.expiresAt > new Date();
};

export const Session = mongoose.model('Session', sessionSchema);