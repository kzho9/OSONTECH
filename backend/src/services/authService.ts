import { User } from '@prisma/client';
import { prisma } from '@/config/database';
import { redis } from '@/config/redis';
import { 
  hashPassword, 
  comparePassword, 
  generateAccessToken, 
  generateRefreshToken, 
  AppError 
} from '@/utils';
import type { RegisterInput, LoginInput } from '@/validations/auth';

export class AuthService {
  static async register(data: RegisterInput): Promise<{
    user: Omit<User, 'password_hash'>;
    accessToken: string;
    refreshToken: string;
  }> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    // Hash password
    const password_hash = await hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password_hash,
        first_name: data.first_name,
        last_name: data.last_name,
        language: data.language,
      },
    });

    // Generate tokens
    const tokenPayload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Store refresh token in Redis
    await redis.setEx(`refresh_token:${user.id}`, 7 * 24 * 60 * 60, refreshToken);

    // Remove password from response
    const { password_hash: _, ...userResponse } = user;

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  }

  static async login(data: LoginInput): Promise<{
    user: Omit<User, 'password_hash'>;
    accessToken: string;
    refreshToken: string;
  }> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check password
    const isValidPassword = await comparePassword(data.password, user.password_hash);
    
    if (!isValidPassword) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate tokens
    const tokenPayload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Store refresh token in Redis
    await redis.setEx(`refresh_token:${user.id}`, 7 * 24 * 60 * 60, refreshToken);

    // Remove password from response
    const { password_hash: _, ...userResponse } = user;

    return {
      user: userResponse,
      accessToken,
      refreshToken,
    };
  }

  static async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      // Verify refresh token
      const payload = JSON.parse(Buffer.from(refreshToken.split('.')[1], 'base64').toString());
      
      if (payload.type !== 'refresh') {
        throw new AppError('Invalid token type', 401);
      }

      // Check if token exists in Redis
      const storedToken = await redis.get(`refresh_token:${payload.userId}`);
      
      if (!storedToken || storedToken !== refreshToken) {
        throw new AppError('Invalid or expired refresh token', 401);
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new AppError('User not found', 401);
      }

      // Generate new tokens
      const tokenPayload = { userId: user.id, email: user.email };
      const newAccessToken = generateAccessToken(tokenPayload);
      const newRefreshToken = generateRefreshToken(tokenPayload);

      // Update refresh token in Redis
      await redis.setEx(`refresh_token:${user.id}`, 7 * 24 * 60 * 60, newRefreshToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new AppError('Invalid or expired refresh token', 401);
    }
  }

  static async logout(userId: string): Promise<void> {
    // Remove refresh token from Redis
    await redis.del(`refresh_token:${userId}`);
  }

  static async forgotPassword(email: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not
      return;
    }

    // Generate reset token (simplified - in production use crypto.randomBytes)
    const resetToken = Math.random().toString(36).substring(2, 15);
    
    // Store reset token in Redis with 1 hour expiration
    await redis.setEx(`reset_token:${resetToken}`, 60 * 60, user.id);

    // TODO: Send reset email
    console.log(`Reset token for ${email}: ${resetToken}`);
  }

  static async resetPassword(token: string, newPassword: string): Promise<void> {
    // Get user ID from reset token
    const userId = await redis.get(`reset_token:${token}`);
    
    if (!userId) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    // Hash new password
    const password_hash = await hashPassword(newPassword);

    // Update user password
    await prisma.user.update({
      where: { id: userId },
      data: { password_hash },
    });

    // Remove reset token
    await redis.del(`reset_token:${token}`);

    // Remove all refresh tokens for this user
    await redis.del(`refresh_token:${userId}`);
  }
}