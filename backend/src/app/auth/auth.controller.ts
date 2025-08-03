import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, UserDto, UserLoginDto } from '@libs/dtos';
import { Public } from '@app/shared/decorators/public.decorator';
import { CurrentUser } from '@app/shared/decorators/current-user.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() user: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    return await this.authService.register(user, res);
  }

  @Public()
  @Post('login')
  async login(@Body() user: UserLoginDto, @Res({ passthrough: true }) res: Response) {
    return await this.authService.login(user, res);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @Get('me')
  async getMe(@CurrentUser() user: UserDto) {
    return await this.authService.me(user.id);
  }
}
