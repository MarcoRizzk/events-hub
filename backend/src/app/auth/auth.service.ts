import { Injectable, HttpException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { CreateUserDto, UserDto, UserLoginDto } from '@libs/dtos';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { User } from '@libs/models';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(user: CreateUserDto, res: Response) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    const createdUser = await this.authRepository.createUser(user);
    const findUser = await this.authRepository.findUserById(createdUser.id);
    const token = this.generateToken(findUser!);
    this.setCookie(res, token);
    return findUser;
  }

  async login(userLoginDto: UserLoginDto, res: Response) {
    const user = await this.authRepository.verifyUser(userLoginDto.email);
    if (!user) {
      throw new HttpException('incorrect email or password', 404);
    }
    const isPasswordMatched = await bcrypt.compare(userLoginDto.password, user.password);
    if (!isPasswordMatched) {
      throw new HttpException('incorrect email or password', 401);
    }
    const userResponse = await this.authRepository.findUserById(user.id);
    const token = this.generateToken(userResponse!);
    this.setCookie(res, token);
    return userResponse;
  }

  async me(id: number) {
    return this.authRepository.findUserById(id);
  }

  logout(res: Response) {
    res.cookie('Authentication', '', {
      httpOnly: true,
      sameSite: 'strict',
      expires: new Date(0),
    });

    return { message: 'Logged out successfully' };
  }

  async verifyUser(authToken: string) {
    try {
      const payload = this.jwtService.verify<{ id: number }>(authToken);
      const user = await this.authRepository.findUserById(payload.id);
      if (!user) throw new HttpException('User not found', 404);
      return user;
    } catch {
      throw new HttpException('Invalid token', 401);
    }
  }

  setCookie(res: Response, token: string) {
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + this.configService.get('JWT_EXPIRATION'));
    res.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }

  generateToken(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    return this.jwtService.sign(payload);
  }
}
