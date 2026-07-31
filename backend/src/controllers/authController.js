import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { Session } from '../models/Session.js';
import { User } from '../models/User.js';
import {
    REFRESH_COOKIE_NAME,
    refreshCookieOptions,
    clearCookieOptions,
} from '../utils/cookies.js';
import {
    buildAuthResponse,
    createRefreshToken,
    createTokenId,
    getRefreshTokenExpiry,
    hashToken,
    verifyRefreshToken,
} from '../utils/tokens.js';

const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must include a lowercase letter')
    .regex(/[A-Z]/, 'Password must include an uppercase letter')
    .regex(/[0-9]/, 'Password must include a number')
    .regex(/[^A-Za-z0-9]/, 'Password must include a special character');

const registerSchema = z.object({
    name: z.string().trim().min(2).max(80),
    email: z.email(),
    password: passwordSchema,
});

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
});

function createHttpError(statusCode, message) {
    return Object.assign(new Error(message), { statusCode });
}

function sessionMetadata(req) {
    return {
        userAgent: req.get('user-agent') || 'unknown',
        ipAddress: req.ip || req.socket.remoteAddress || 'unknown',
    };
}

async function issueSession(req, res, user, existingSession = null) {
    const tokenId = createTokenId();
    const refreshToken = createRefreshToken(tokenId, user._id.toString());
    const refreshTokenHash = hashToken(refreshToken);
    const expiresAt = getRefreshTokenExpiry();
    const metadata = sessionMetadata(req);

    if (existingSession) {
        existingSession.tokenId = tokenId;
        existingSession.refreshTokenHash = refreshTokenHash;
        existingSession.expiresAt = expiresAt;
        existingSession.userAgent = metadata.userAgent;
        existingSession.ipAddress = metadata.ipAddress;
        existingSession.revokedAt = null;
        await existingSession.save();
    } else {
        await Session.create({
            user: user._id,
            tokenId,
            refreshTokenHash,
            expiresAt,
            ...metadata,
        });
    }

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
    return buildAuthResponse(user);
}

export async function register(req, res, next) {
    try {
        const data = registerSchema.parse(req.body);
        const email = data.email.toLowerCase();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw createHttpError(409, 'Email is already registered');
        }

        const passwordHash = await User.hashPassword(data.password);

        const user = await User.create({
            name: data.name,
            email,
            passwordHash,
            lastLoginAt: new Date(),
        });

        const payload = await issueSession(req, res, user);
        res.status(201).json(payload);
    } catch (error) {
        next(error);
    }
}

export async function login(req, res, next) {
    try {
        const data = loginSchema.parse(req.body);
        const user = await User.findOne({ email: data.email.toLowerCase() });

        if (!user || !(await user.comparePassword(data.password))) {
            throw createHttpError(401, 'Invalid email or password');
        }

        user.lastLoginAt = new Date();
        await user.save();

        const payload = await issueSession(req, res, user);
        res.status(200).json(payload);
    } catch (error) {
        next(error);
    }
}

export async function refresh(req, res, next) {
    try {
        const refreshToken = req.cookies[REFRESH_COOKIE_NAME];
        if (!refreshToken) {
            throw createHttpError(401, 'Refresh token is missing');
        }

        const payload = verifyRefreshToken(refreshToken);

        const session = await Session.findOne({
            tokenId: payload.jti,
            user: payload.sub,
            revokedAt: null,
        }).select('+refreshTokenHash');

        if (!session) {
            throw createHttpError(401, 'Session is no longer valid');
        }

        const incomingHash = hashToken(refreshToken);
        const sessionHashBuffer = Buffer.from(session.refreshTokenHash, 'hex');
        const incomingHashBuffer = Buffer.from(incomingHash, 'hex');

        const isHashValid =
            sessionHashBuffer.length === incomingHashBuffer.length &&
            crypto.timingSafeEqual(sessionHashBuffer, incomingHashBuffer);

        if (!isHashValid) {
            await Session.updateMany(
                { user: payload.sub, revokedAt: null },
                { $set: { revokedAt: new Date() } }
            );
            res.clearCookie(REFRESH_COOKIE_NAME, clearCookieOptions);
            throw createHttpError(
                401,
                'Refresh token reuse detected. All sessions revoked. Please sign in again.'
            );
        }

        if (session.expiresAt <= new Date()) {
            session.revokedAt = new Date();
            await session.save();
            res.clearCookie(REFRESH_COOKIE_NAME, clearCookieOptions);
            throw createHttpError(401, 'Session expired. Please sign in again.');
        }

        const user = await User.findById(payload.sub);
        if (!user) {
            session.revokedAt = new Date();
            await session.save();
            res.clearCookie(REFRESH_COOKIE_NAME, clearCookieOptions);
            throw createHttpError(401, 'User no longer exists');
        }

        const response = await issueSession(req, res, user, session);
        res.status(200).json(response);

    } catch (error) {
        next(error);
    }
}

export async function logout(req, res, next) {
    try {
        const refreshToken = req.cookies[REFRESH_COOKIE_NAME];

        if (refreshToken) {
            try {
                let payload;
                try {
                    payload = verifyRefreshToken(refreshToken);
                } catch {
                    payload = jwt.decode(refreshToken);
                }

                if (payload && payload.jti && payload.sub) {
                    await Session.findOneAndUpdate(
                        {
                            tokenId: payload.jti,
                            user: payload.sub,
                            revokedAt: null,
                        },
                        { $set: { revokedAt: new Date() } }
                    );
                }
            } catch {
                // Ignore invalid or unparseable tokens during logout
            }
        }

        res.clearCookie(REFRESH_COOKIE_NAME, clearCookieOptions);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

export async function getCurrentUser(req, res, next) {
    try {
        const userId = req.user?.id || req.user?.sub;
        const user = await User.findById(userId).select('-passwordHash');

        if (!user) {
            throw createHttpError(404, 'User not found');
        }

        res.status(200).json({
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                lastLoginAt: user.lastLoginAt,
            },
        });
    } catch (error) {
        next(error);
    }
}