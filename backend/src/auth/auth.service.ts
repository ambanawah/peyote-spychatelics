import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: any) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already registered');
    const password = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: { email: dto.email.toLowerCase(), password, name: dto.name },
    });
    const { accessToken } = await this.generateTokens(user.id, user.email, user.role);
    return { user: this.sanitize(user), accessToken };
  }

  async login(dto: any) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const { accessToken } = await this.generateTokens(user.id, user.email, user.role);
    return { user: this.sanitize(user), accessToken };
  }

  async logout(userId: string) {
    return { message: 'Logged out successfully' };
  }

  async refresh(userId: string, token: string) {
    return this.generateTokens(userId, '', '');
  }

  async forgotPassword(dto: any) {
    return { message: 'If that email exists, a reset link has been sent.' };
  }

  async resetPassword(dto: any) {
    return { message: 'Password reset successfully' };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user || !user.isActive) return null;
    const valid = await bcrypt.compare(password, user.password);
    return valid ? user : null;
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return this.sanitize(user);
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN', '7d'),
    });
    return { accessToken };
  }

  private sanitize(user: any) {
    const { password, ...safe } = user;
    return safe;
  }
}
