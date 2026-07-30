import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function createAccessToken(user) {
    return jwt.sign(
        {
            sub: user._id.toString(),
            email: user.email,
            name: user.name,
        },
        env.jwtAccessSecret,
        { expiresIn: env.accessTokenTtl }
    );
}

export function createRefreshToken(tokenId, userId) {
    return jwt.sign(
        {
            jti: tokenId,
            sub: userId.toString(),
        },
        env.jwtRefreshSecret,
        { expiresIn: `${env.refreshTokenTtlDays}d` }
    );
}

export function verifyAccessToken(token) {
    try {
        return jwt.verify(token, env.jwtAccessSecret);
    } catch (error) {
        const message = error.name === 'TokenExpiredError'
            ? 'Access token has expired'
            : 'Invalid access token';
        throw new Error(message);
    }
}

export function verifyRefreshToken(token) {
    try {
        return jwt.verify(token, env.jwtRefreshSecret);
    } catch (error) {
        const message = error.name === 'TokenExpiredError'
            ? 'Refresh token has expired'
            : 'Invalid refresh token';
        throw new Error(message);
    }
}

export function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

export function createTokenId() {
    return crypto.randomUUID();
}

export function getRefreshTokenExpiry() {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + env.refreshTokenTtlDays);
    return expiresAt;
}

export function buildAuthResponse(user) {
    return {
        user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            lastLoginAt: user.lastLoginAt,
        },
        accessToken: createAccessToken(user),
    };
}